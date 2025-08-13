"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import courseService from "@/lib/services/courseService";
import studentService from "@/lib/services/studentService";
import teacherService from "@/lib/services/teacherService";
import { MappedCourse, MappedSession, CreateCourseRequest } from "@/lib/types";
import { TeacherResponse } from "@/lib/services/teacherService";

const adminMenuItems = [
  { icon: "📊", label: "Dashboard", href: "/admin/dashboard" },
  { icon: "📚", label: "Kurslar", href: "/admin/courses" },
  { icon: "👨‍🏫", label: "Öğretmenler", href: "/admin/teachers" },
  { icon: "👨‍🎓", label: "Öğrenciler", href: "/admin/students" },
  { icon: "💰", label: "Ödemeler", href: "/admin/payments" },
];

export default function AdminCourses() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "completed"
  >("all");
  const [newCourse, setNewCourse] = useState<CreateCourseRequest>({
    title: "",
    course_no: "",
    teacher_id: 0,
    total_sessions: 1,
    status: "active",
  });
  const [editCourse, setEditCourse] = useState<{
    title: string;
    course_no: string;
    teacher_id: number;
    total_sessions: number;
    status: "active" | "completed" | "cancelled";
  }>({
    title: "",
    course_no: "",
    teacher_id: 0,
    total_sessions: 1,
    status: "active",
  });

  const [courses, setCourses] = useState<MappedCourse[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshCourses = async () => {
    const updated = await courseService.getAllCourses();
    setCourses(updated);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedCourses, fetchedStudents, fetchedTeachers] =
          await Promise.all([
            courseService.getAllCourses(),
            studentService.getAllStudents(),
            teacherService.getAllTeachers(),
          ]);
        setCourses(fetchedCourses);
        setStudents(fetchedStudents);
        setTeachers(fetchedTeachers);
      } catch (err: any) {
        setError(err.message || "Veriler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await courseService.createCourse(newCourse);
      setShowAddForm(false);
      setNewCourse({
        title: "",
        course_no: "",
        teacher_id: 0,
        total_sessions: 1,
        status: "active",
      });

      await refreshCourses();
      alert(response.message || "Kurs başarıyla eklendi!");
    } catch (error: any) {
      alert(`Kurs eklenirken hata: ${error.message}`);
    }
  };

  const openEditModal = (course: MappedCourse) => {
    setEditingCourseId(course.id);
    setEditCourse({
      title: course.title,
      course_no: course.courseNo,
      teacher_id: parseInt(course.teacherId, 10),
      total_sessions: course.totalLessons,
      status: course.status,
    });
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourseId) return;
    try {
      await courseService.updateCourse(editingCourseId, editCourse);
      setEditingCourseId(null);
      await refreshCourses();
      alert("Kurs güncellendi");
    } catch (error: any) {
      alert(`Kurs güncellenirken hata: ${error.message}`);
    }
  };

  const handleDeleteCourse = async () => {
    if (!editingCourseId) return;
    if (!confirm("Bu kursu silmek istediğinize emin misiniz?")) return;
    try {
      await courseService.deleteCourse(editingCourseId);
      setEditingCourseId(null);
      await refreshCourses();
      alert("Kurs silindi");
    } catch (error: any) {
      alert(`Kurs silinirken hata: ${error.message}`);
    }
  };

  const markAsCompleted = () => {
    setEditCourse((prev) => ({ ...prev, status: "completed" }));
  };

  const getTeacherName = (teacherId: string) => {
    const course = courses.find((c) => c.id === teacherId);
    return course?.teacherName || "Bilinmeyen";
  };

  const getCourseStats = async (courseId: string) => {
    try {
      const stats = await courseService.getCourseStats(courseId);
      return stats;
    } catch (error) {
      return {
        totalLessons: 0,
        completedLessons: 0,
        studentCount: 0,
        paidStudents: 0,
      };
    }
  };

  const getCourseStudents = (courseId: string) => {
    // TODO: Student enrollment API endpoint'i gerekli
    // Şimdilik tüm öğrencileri döndür (test için)
    return students.map((student) => ({
      student,
      hasPaid: Math.random() > 0.5,
    }));
  };

  const filteredCourses = courses.filter((course) => {
    if (filterStatus === "all") return true;
    return course.status === filterStatus;
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
              Kurs Yönetimi
            </h1>
            <p className="text-gray-600">
              Tüm kursları görüntüleyin ve yönetin
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
          >
            ➕ Yeni Kurs Ekle
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
              Tümü
            </button>
            <button
              onClick={() => setFilterStatus("active")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === "active"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Aktif Kurslar
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === "completed"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Geçmiş Kurslar
            </button>
          </div>
        </div>

        {/* Kurs Ekleme Formu */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Yeni Kurs Ekle
              </h2>
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kurs Adı
                  </label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Örn: Matematik Temelleri"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kurs Numarası
                  </label>
                  <input
                    type="text"
                    value={newCourse.course_no}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, course_no: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Örn: CR004"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Öğretmen
                  </label>
                  <select
                    value={newCourse.teacher_id || ""}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        teacher_id: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Öğretmen seçin</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.User.name} ({teacher.User.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Toplam Ders Sayısı
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newCourse.total_sessions}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        total_sessions: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durum
                  </label>
                  <select
                    value={newCourse.status || "active"}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Aktif</option>
                    <option value="completed">Geçmiş (Tamamlandı)</option>
                    <option value="cancelled">İptal</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                  >
                    Kurs Ekle
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

        {/* Kurs Düzenleme Formu */}
        {editingCourseId && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Kursu Düzenle
              </h2>
              <form onSubmit={handleUpdateCourse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kurs Adı
                  </label>
                  <input
                    type="text"
                    value={editCourse.title}
                    onChange={(e) =>
                      setEditCourse({ ...editCourse, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kurs Numarası
                  </label>
                  <input
                    type="text"
                    value={editCourse.course_no}
                    onChange={(e) =>
                      setEditCourse({
                        ...editCourse,
                        course_no: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Öğretmen
                  </label>
                  <select
                    value={editCourse.teacher_id || 0}
                    onChange={(e) =>
                      setEditCourse({
                        ...editCourse,
                        teacher_id: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value={0}>Öğretmen seçin</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.User.name} ({teacher.User.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Toplam Ders
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editCourse.total_sessions}
                    onChange={(e) =>
                      setEditCourse({
                        ...editCourse,
                        total_sessions: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durum
                  </label>
                  <select
                    value={editCourse.status}
                    onChange={(e) =>
                      setEditCourse({
                        ...editCourse,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Aktif</option>
                    <option value="completed">Geçmiş (Tamamlandı)</option>
                    <option value="cancelled">İptal</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={markAsCompleted}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Geçmiş kursa çevir
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteCourse}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Sil
                  </button>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                  >
                    Kaydet
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCourseId(null)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-semibold transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Kurs Detayları Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Kurs Detayları
                </h2>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {(() => {
                const course = courses.find((c) => c.id === selectedCourse);
                const courseStudents = getCourseStudents(selectedCourse);

                if (!course) return null;

                return (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600">{course.courseNo}</p>
                      <p className="text-gray-600">
                        Öğretmen: {course.teacherName}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Öğrenciler
                      </h4>
                      {courseStudents.length > 0 ? (
                        <div className="space-y-2">
                          {courseStudents.map((cs, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-gray-800">
                                  {cs.student?.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {cs.student?.email}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  cs.hasPaid
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {cs.hasPaid ? "💰 Ödedi" : "❌ Ödemedi"}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          Öğrenci bilgileri henüz API'ye bağlanmadı
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Dersler
                      </h4>
                      <p className="text-gray-500">
                        Ders bilgileri kurs detaylarında mevcut
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Özet
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">
                            {courseStudents.length}
                          </p>
                          <p className="text-sm text-gray-600">Öğrenci</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {courseStudents.filter((s) => s.hasPaid).length}
                          </p>
                          <p className="text-sm text-gray-600">Ödeme Yapan</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">
                            {/* TODO: Completed sessions count */}0
                          </p>
                          <p className="text-sm text-gray-600">
                            Tamamlanan Ders
                          </p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">
                            {course.totalLessons}
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

        {/* Kurs Listesi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const statusConfig = {
              active: {
                bg: "bg-green-100",
                text: "text-green-800",
                label: "Aktif",
              },
              completed: {
                bg: "bg-blue-100",
                text: "text-blue-800",
                label: "Tamamlandı",
              },
              cancelled: {
                bg: "bg-red-100",
                text: "text-red-800",
                label: "İptal Edildi",
              },
            };
            const config = statusConfig[course.status];

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex justify_between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-gray-600">{course.courseNo}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
                  >
                    {config.label}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">👨‍🏫 Öğretmen:</span>
                    <span className="font-semibold text-gray-800">
                      {course.teacherName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">👨‍🎓 Öğrenci:</span>
                    <span className="font-semibold text-gray-800">
                      {/* TODO: Student count API */}
                      {students.length > 0
                        ? Math.floor(Math.random() * 10) + 1
                        : 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">📝 Ders:</span>
                    <span className="font-semibold text-gray-800">
                      {/* TODO: Completed lessons count */}
                      0/{course.totalLessons}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">💰 Ödeme:</span>
                    <span className="font-semibold text-gray-800">
                      {/* TODO: Payment count API */}
                      0/0
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>İlerleme</span>
                    <span className="font-bold text-gray-800">%0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedCourse(course.id)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Detaylar
                  </button>
                  <button
                    onClick={() => openEditModal(course)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Düzenle
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
