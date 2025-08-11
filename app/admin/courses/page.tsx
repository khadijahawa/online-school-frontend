"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import courseService from "@/lib/services/courseService";
import studentService from "@/lib/services/studentService";
import { MappedCourse, MappedSession } from "@/lib/types";

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
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "completed"
  >("all");
  const [newCourse, setNewCourse] = useState({
    title: "",
    courseNo: "",
    teacherId: "",
    totalLessons: 1,
  });
  const [courses, setCourses] = useState<MappedCourse[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedCourses, fetchedStudents] = await Promise.all([
          courseService.getAllCourses(),
          studentService.getAllStudents(),
        ]);
        setCourses(fetchedCourses);
        setStudents(fetchedStudents);
      } catch (err: any) {
        setError(err.message || "Veriler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API'ye kurs ekleme endpoint'i gerekli
    console.log("Yeni kurs:", newCourse);
    setShowAddForm(false);
    setNewCourse({ title: "", courseNo: "", teacherId: "", totalLessons: 1 });
    alert("Kurs ekleme özelliği henüz API'ye bağlanmadı!");
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
    return students.map(student => ({
      student,
      hasPaid: Math.random() > 0.5, // Random payment status for demo
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
                    value={newCourse.courseNo}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, courseNo: e.target.value })
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
                    value={newCourse.teacherId}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, teacherId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Öğretmen seçin</option>
                    {/* TODO: Teacher API endpoint'i gerekli */}
                    <option value="1">Öğretmen bilgileri yükleniyor...</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Toplam Ders Sayısı
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newCourse.totalLessons}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        totalLessons: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
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
                <div className="flex justify-between items-start mb-4">
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
                      {students.length > 0 ? Math.floor(Math.random() * 10) + 1 : 0}
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
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-semibold transition-colors">
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
