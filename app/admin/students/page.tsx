"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import studentService from "@/lib/services/studentService";
import courseService from "@/lib/services/courseService";
import { StudentResponse } from "@/lib/services/studentService";
import { CreateStudentRequest, MappedCourse } from "@/lib/types";

const adminMenuItems = [
  { icon: "📊", label: "Dashboard", href: "/admin/dashboard" },
  { icon: "📚", label: "Kurslar", href: "/admin/courses" },
  { icon: "👨‍🏫", label: "Öğretmenler", href: "/admin/teachers" },
  { icon: "👨‍🎓", label: "Öğrenciler", href: "/admin/students" },
  { icon: "💰", label: "Ödemeler", href: "/admin/payments" },
];

export default function AdminStudents() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "new" | "existing">(
    "all"
  );
  const [newStudent, setNewStudent] = useState<CreateStudentRequest>({
    name: "",
    phone: "",
    email: "",
    is_new: false,
  });
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [allCourses, setAllCourses] = useState<MappedCourse[]>([]);
  const [studentCourses, setStudentCourses] = useState<MappedCourse[]>([]);
  const [enrollCourseId, setEnrollCourseId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedStudents, fetchedCourses] = await Promise.all([
          studentService.getAllStudents(),
          courseService.getAllCourses(),
        ]);
        setStudents(fetchedStudents);
        setAllCourses(fetchedCourses);
      } catch (err: any) {
        setError(err.message || "Veriler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Seçilen öğrenci değiştiğinde, öğrencinin kurslarını getir
  useEffect(() => {
    const loadStudentCourses = async () => {
      if (!selectedStudent) {
        setStudentCourses([]);
        setEnrollCourseId("");
        return;
      }
      try {
        const courses = await studentService.getStudentCourses(selectedStudent);
        setStudentCourses(courses);
      } catch (e) {
        setStudentCourses([]);
      }
    };
    loadStudentCourses();
  }, [selectedStudent]);

  const handleEnroll = async () => {
    if (!selectedStudent || !enrollCourseId) return;
    try {
      const resp = await courseService.enrollStudent(
        enrollCourseId,
        parseInt(selectedStudent, 10)
      );
      alert(resp.message || "Öğrenci kursa eklendi");
      // Listeyi tazele
      const courses = await studentService.getStudentCourses(selectedStudent);
      setStudentCourses(courses);
      setEnrollCourseId("");
    } catch (e: any) {
      alert(e.message || "Kursa ekleme sırasında hata oluştu");
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await studentService.createStudent(newStudent);
      setShowAddForm(false);
      setNewStudent({ name: "", phone: "", email: "", is_new: false });

      // Listeyi yenile
      const updatedStudents = await studentService.getAllStudents();
      setStudents(updatedStudents);

      alert(response.message || "Öğrenci başarıyla eklendi!");
    } catch (error: any) {
      alert(`Öğrenci eklenirken hata: ${error.message}`);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (confirm("Bu öğrenciyi silmek istediğinizden emin misiniz?")) {
      try {
        await studentService.deleteStudent(studentId);

        // Listeyi yenile
        const updatedStudents = await studentService.getAllStudents();
        setStudents(updatedStudents);

        alert("Öğrenci başarıyla silindi!");
      } catch (error: any) {
        alert(`Öğrenci silinirken hata: ${error.message}`);
      }
    }
  };

  const filteredStudents = students.filter((student) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "new") return student.isNew;
    if (filterStatus === "existing") return !student.isNew;
    return true;
  });

  if (loading) {
    return (
      <DashboardLayout
        title="👨‍💼 Admin Paneli"
        menuItems={adminMenuItems}
        requiredRole="admin"
      >
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">
              Veriler yükleniyor...
            </span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout
        title="👨‍💼 Admin Paneli"
        menuItems={adminMenuItems}
        requiredRole="admin"
      >
        <div className="p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Hata:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="👨‍💼 Admin Paneli"
      menuItems={adminMenuItems}
      requiredRole="admin"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Öğrenci Yönetimi
            </h1>
            <p className="text-gray-600">
              Tüm öğrencileri görüntüleyin ve yönetin
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
          >
            ➕ Yeni Öğrenci Ekle
          </button>
        </div>

        {/* Filtreleme */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Tümü ({students.length})
            </button>
            <button
              onClick={() => setFilterStatus("new")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === "new"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Yeni Öğrenciler ({students.filter((s) => s.isNew).length})
            </button>
            <button
              onClick={() => setFilterStatus("existing")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === "existing"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Mevcut Öğrenciler ({students.filter((s) => !s.isNew).length})
            </button>
          </div>
        </div>

        {/* Öğrenci Ekleme Formu */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Yeni Öğrenci Ekle
              </h2>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Örn: Ali Veli"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={newStudent.phone}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Örn: 5551234567"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Örn: ali@veli.com"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newStudent.is_new}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          is_new: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Yeni öğrenci</span>
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                  >
                    Öğrenci Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-semibold transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Öğrenci Detayları Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w_full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Öğrenci Detayları
                </h2>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {(() => {
                const student = students.find(
                  (s) => s.id.toString() === selectedStudent
                );

                if (!student) return null;

                return (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {student.name}
                      </h3>
                      <p className="text-gray-600">{student.email}</p>
                      <p className="text-gray-600">{student.phone}</p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          student.isNew
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {student.isNew
                          ? "🆕 Yeni Öğrenci"
                          : "👨‍🎓 Mevcut Öğrenci"}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Kursları
                      </h4>
                      {studentCourses.length > 0 ? (
                        <div className="space-y-2">
                          {studentCourses.map((course) => (
                            <div
                              key={course.id}
                              className="p-3 bg-white border border-gray-200 rounded-lg"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {course.title}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {course.courseNo}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      course.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {course.status === "active"
                                      ? "Aktif"
                                      : "Geçmiş"}
                                  </span>
                                  <div className="text-xs text-gray-500 mt-1">
                                    Ödeme: Bilinmiyor
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          Bu öğrenci için kurs bulunamadı
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Kursa Ekle
                      </h4>
                      <div className="flex items-center space-x-3">
                        <select
                          value={enrollCourseId}
                          onChange={(e) => setEnrollCourseId(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Kurs seçin</option>
                          {allCourses.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title} ({c.courseNo})
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={handleEnroll}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                          disabled={!enrollCourseId}
                        >
                          Ekle
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Özet
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">
                            {studentCourses.length}
                          </p>
                          <p className="text-sm text-gray-600">Kurs</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {
                              studentCourses.filter(
                                (c) => c.status === "active"
                              ).length
                            }
                          </p>
                          <p className="text-sm text-gray-600">Aktif Kurs</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">
                            {
                              studentCourses.filter(
                                (c) => c.status === "completed"
                              ).length
                            }
                          </p>
                          <p className="text-sm text-gray-600">
                            Tamamlanan Kurs
                          </p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">
                            0
                          </p>
                          <p className="text-sm text-gray-600">Toplam Ders</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Öğrenci Listesi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {student.name}
                  </h3>
                  <p className="text-gray-600">{student.email}</p>
                  <p className="text-gray-600">{student.phone}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    student.isNew
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {student.isNew ? "🆕 Yeni" : "👨‍🎓 Mevcut"}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">📚 Kurs:</span>
                  <span className="font-semibold text-gray-800">
                    {/* TODO: Course count */}0
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">📝 Ders:</span>
                  <span className="font-semibold text-gray-800">
                    {/* TODO: Lesson count */}0
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">💰 Ödeme:</span>
                  <span className="font-semibold text-gray-800">
                    {/* TODO: Payment status */}❌ Ödemedi
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedStudent(student.id.toString())}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                >
                  Detaylar
                </button>
                <button
                  onClick={() => handleDeleteStudent(student.id.toString())}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              {filterStatus === "all"
                ? "Henüz öğrenci bulunmuyor"
                : filterStatus === "new"
                ? "Yeni öğrenci bulunmuyor"
                : "Mevcut öğrenci bulunmuyor"}
            </p>
            {filterStatus === "all" && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                İlk Öğrencinizi Ekleyin
              </button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
