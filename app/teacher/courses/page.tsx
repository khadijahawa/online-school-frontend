"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import courseService from "@/lib/services/courseService";
import { MappedCourse, MappedSession } from "@/lib/types";

const teacherMenuItems = [
  { icon: "📊", label: "Dashboard", href: "/teacher/dashboard" },
  { icon: "📚", label: "Kurslarım", href: "/teacher/courses" },
  { icon: "📝", label: "Dersler", href: "/teacher/sessions" },
  { icon: "✅", label: "Tamamlanan", href: "/teacher/completed" },
];

export default function TeacherCourses() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [courses, setCourses] = useState<MappedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mock: Öğretmen ID'si 1 olarak sabit (API'de teacher_id: 1 olarak görünüyor)
  const teacherId = "1";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedCourses = await courseService.getCoursesByTeacher(
          teacherId
        );
        setCourses(fetchedCourses);
      } catch (err: any) {
        setError(err.message || "Veriler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId]);

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
    return [];
  };

  if (loading) {
    return (
      <DashboardLayout
        title="👩‍🏫 Öğretmen Paneli"
        menuItems={teacherMenuItems}
        requiredRole="teacher"
      >
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
        title="👩‍🏫 Öğretmen Paneli"
        menuItems={teacherMenuItems}
        requiredRole="teacher"
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
      title="👩‍🏫 Öğretmen Paneli"
      menuItems={teacherMenuItems}
      requiredRole="teacher"
    >
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Kurslarım</h1>
          <p className="text-gray-600">
            Size atanan kursları görüntüleyin ve yönetin
          </p>
        </div>

        {/* Kurs Listesi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => {
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
                    <span className="text-gray-600">👨‍🎓 Öğrenci:</span>
                    <span className="font-semibold text-gray-600">
                      {/* TODO: Student count API */}0
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">📝 Ders:</span>
                    <span className="font-semibold  text-gray-600">
                      {/* TODO: Completed lessons count */}
                      0/{course.totalLessons}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">💰 Ödeme:</span>
                    <span className="font-semibold  text-gray-600">
                      {/* TODO: Payment count API */}
                      0/0
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>İlerleme</span>
                    <span className="text-gray-800 font-bold">%0</span>
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
                    Ders Ekle
                  </button>
                </div>
              </div>
            );
          })}
        </div>

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
                        Durum:{" "}
                        {course.status === "active" ? "Aktif" : "Tamamlandı"}
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
      </div>
    </DashboardLayout>
  );
}
