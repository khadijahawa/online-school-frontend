"use client";

import DashboardLayout from "@/components/DashboardLayout";
// import AuthGuard from "@/components/AuthGuard";
import {
  mockCourses,
  mockLessons,
  mockUsers,
  mockStudents,
  mockCourseStudents,
} from "@/lib/mockData";

const teacherMenuItems = [
  { icon: "📊", label: "Dashboard", href: "/teacher/dashboard" },
  { icon: "📚", label: "Kurslarım", href: "/teacher/courses" },
  { icon: "📝", label: "Dersler", href: "/teacher/sessions" },
  { icon: "✅", label: "Tamamlanan", href: "/teacher/completed" },
];

export default function TeacherDashboard() {
  // Mock: Öğretmen ID'si 2 olarak sabit
  const teacherId = "2";
  const teacherCourses = mockCourses.filter(
    (course) => course.teacherId === teacherId
  );
  const activeCourses = teacherCourses.filter((c) => c.status === "active");
  const completedCourses = teacherCourses.filter(
    (c) => c.status === "completed"
  );
  const totalLessons = mockLessons.filter((l) =>
    teacherCourses.some((c) => c.id === l.courseId)
  ).length;
  const completedLessons = mockLessons.filter(
    (l) => teacherCourses.some((c) => c.id === l.courseId) && l.isCompleted
  ).length;

  return (
    // <AuthGuard requiredRole="teacher" redirectTo="/teacher/login">
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
                const courseLessons = mockLessons.filter(
                  (l) => l.courseId === course.id
                );
                const completedLessonsCount = courseLessons.filter(
                  (l) => l.isCompleted
                ).length;
                const progress = Math.round(
                  (completedLessonsCount / course.totalLessons) * 100
                );

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
                          {completedLessonsCount}/{course.totalLessons} ders
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
              {mockLessons
                .filter((l) => teacherCourses.some((c) => c.id === l.courseId))
                .slice(0, 5)
                .map((lesson) => {
                  const course = mockCourses.find(
                    (c) => c.id === lesson.courseId
                  );
                  const statusConfig = {
                    completed: {
                      bg: "bg-green-100",
                      text: "text-green-800",
                      icon: "✅",
                    },
                    cancelled: {
                      bg: "bg-red-100",
                      text: "text-red-800",
                      icon: "❌",
                    },
                    planned: {
                      bg: "bg-blue-100",
                      text: "text-blue-800",
                      icon: "📅",
                    },
                  };
                  const config = statusConfig[lesson.status];

                  return (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {course?.title}
                        </p>
                        <p className="text-sm text-gray-600">{lesson.topic}</p>
                        {lesson.date && (
                          <p className="text-xs text-gray-500">{lesson.date}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
                        >
                          <span className="mr-1">{config.icon}</span>
                          {lesson.status === "completed"
                            ? "Tamamlandı"
                            : lesson.status === "cancelled"
                            ? "İptal Edildi"
                            : "Planlandı"}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
    // </AuthGuard>
  );
}
