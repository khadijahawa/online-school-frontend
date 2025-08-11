"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import courseService from "@/lib/services/courseService";
import { MappedCourse, MappedSession } from "@/lib/types";

const teacherMenuItems = [
  { icon: "📊", label: "Dashboard", href: "/teacher/dashboard" },
  { icon: "📚", label: "Kurslarım", href: "/teacher/courses" },
  { icon: "📝", label: "Dersler", href: "/teacher/sessions" },
  { icon: "✅", label: "Tamamlanan", href: "/teacher/completed" },
];

export default function TeacherDashboard() {
  const [courses, setCourses] = useState<MappedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mock: Öğretmen ID'si 2 olarak sabit (API'de teacher_id: 1 olarak görünüyor)
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

  const activeCourses = courses.filter((c) => c.status === "active");
  const completedCourses = courses.filter((c) => c.status === "completed");

  // TODO: Total lessons ve completed lessons için session API'leri gerekli
  const totalLessons = 0;
  const completedLessons = 0;

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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Öğretmen Dashboard'u
          </h1>
          <p className="text-gray-600">Kurslarınız ve ders yönetimi</p>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-green-500 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Aktif Kurs</p>
                <p className="text-3xl font-bold">{activeCourses.length}</p>
              </div>
              <div className="text-4xl opacity-80">📚</div>
            </div>
          </div>

          <div className="bg-blue-500 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Tamamlanan</p>
                <p className="text-3xl font-bold">{completedCourses.length}</p>
              </div>
              <div className="text-4xl opacity-80">✅</div>
            </div>
          </div>

          <div className="bg-purple-500 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Toplam Ders</p>
                <p className="text-3xl font-bold">{totalLessons}</p>
              </div>
              <div className="text-4xl opacity-80">📝</div>
            </div>
          </div>

          <div className="bg-orange-500 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Tamamlanan Ders</p>
                <p className="text-3xl font-bold">{completedLessons}</p>
              </div>
              <div className="text-4xl opacity-80">🎯</div>
            </div>
          </div>
        </div>

        {/* Aktif Kurslar ve Son Dersler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Aktif Kurslar */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📚</span>
              Aktif Kurslarım
            </h2>
            <div className="space-y-3">
              {activeCourses.map((course) => {
                // TODO: Course progress için session API'leri gerekli
                const progress = 0;

                return (
                  <div key={course.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {course.title}
                      </h3>
                      <span className="text-sm text-gray-600">
                        {course.courseNo}
                      </span>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>İlerleme</span>
                        <span>
                          {/* TODO: Completed lessons count */}
                          0/{course.totalLessons} ders
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      %{progress} tamamlandı
                    </p>
                  </div>
                );
              })}
              {activeCourses.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  Henüz aktif kursunuz bulunmuyor
                </p>
              )}
            </div>
          </div>

          {/* Son Dersler */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📝</span>
              Son Dersler
            </h2>
            <div className="space-y-3">
              <p className="text-gray-500 text-center py-8">
                Ders bilgileri henüz API'ye bağlanmadı
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
