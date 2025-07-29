"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
  mockCourses,
  mockSessions,
  mockUsers,
  mockStudents,
  mockCourseStudents,
} from "@/lib/mockData";

const teacherMenuItems = [
  { icon: "📊", label: "Dashboard", href: "/teacher/dashboard" },
  { icon: "📚", label: "Kurslarım", href: "/teacher/courses" },
  { icon: "📝", label: "Oturumlar", href: "/teacher/sessions" },
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
  const totalSessions = mockSessions.filter((s) =>
    teacherCourses.some((c) => c.id === s.courseId)
  ).length;
  const completedSessions = mockSessions.filter(
    (s) =>
      teacherCourses.some((c) => c.id === s.courseId) &&
      s.status === "completed"
  ).length;

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
          <p className="text-gray-600">Kurslarınız ve oturum yönetimi</p>
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
                <p className="text-purple-100">Toplam Oturum</p>
                <p className="text-3xl font-bold">{totalSessions}</p>
              </div>
              <div className="text-4xl opacity-80">📝</div>
            </div>
          </div>

          <div className="bg-orange-500 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Tamamlanan Oturum</p>
                <p className="text-3xl font-bold">{completedSessions}</p>
              </div>
              <div className="text-4xl opacity-80">🎯</div>
            </div>
          </div>
        </div>

        {/* Aktif Kurslar ve Son Oturumlar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Aktif Kurslar */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📚</span>
              Aktif Kurslarım
            </h2>
            <div className="space-y-3">
              {activeCourses.map((course) => {
                const courseSessions = mockSessions.filter(
                  (s) => s.courseId === course.id
                );
                const completedSessionsCount = courseSessions.filter(
                  (s) => s.status === "completed"
                ).length;
                const progress = Math.round(
                  (completedSessionsCount / course.totalSessions) * 100
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
                          {completedSessionsCount}/{course.totalSessions} oturum
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

          {/* Son Oturumlar */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📝</span>
              Son Oturumlar
            </h2>
            <div className="space-y-3">
              {mockSessions
                .filter((s) => teacherCourses.some((c) => c.id === s.courseId))
                .slice(0, 5)
                .map((session) => {
                  const course = mockCourses.find(
                    (c) => c.id === session.courseId
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
                  const config = statusConfig[session.status];

                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {course?.title}
                        </p>
                        <p className="text-sm text-gray-600">{session.topic}</p>
                        {session.date && (
                          <p className="text-xs text-gray-500">
                            {session.date}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
                        >
                          <span className="mr-1">{config.icon}</span>
                          {session.status === "completed"
                            ? "Tamamlandı"
                            : session.status === "cancelled"
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
  );
}
