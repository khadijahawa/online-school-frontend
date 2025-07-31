"use client";

import DashboardLayout from "@/components/DashboardLayout";
// import AuthGuard from "@/components/AuthGuard";
import {
  mockCourses,
  mockStudents,
  mockUsers,
  mockTeacherPayments,
} from "@/lib/mockData";

const adminMenuItems = [
  { icon: "📊", label: "Dashboard", href: "/admin/dashboard" },
  { icon: "📚", label: "Kurslar", href: "/admin/courses" },
  { icon: "👨‍🏫", label: "Öğretmenler", href: "/admin/teachers" },
  { icon: "👨‍🎓", label: "Öğrenciler", href: "/admin/students" },
  { icon: "💰", label: "Ödemeler", href: "/admin/payments" },
];

export default function AdminDashboard() {
  const totalCourses = mockCourses.length;
  const activeCourses = mockCourses.filter((c) => c.status === "active").length;
  const totalStudents = mockStudents.length;
  const totalTeachers = mockUsers.filter((u) => u.role === "teacher").length;
  const pendingPayments = mockTeacherPayments.filter((p) => !p.isPaid).length;

  return (
    // <AuthGuard requiredRole="admin" redirectTo="/admin/login">
      <DashboardLayout
        title="👨‍💼 Admin Paneli"
        menuItems={adminMenuItems}
        requiredRole="admin"
      >
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Okul Yönetim Dashboard'u
            </h1>
            <p className="text-gray-600">Sistem genel durumu ve hızlı erişim</p>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-500 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Toplam Kurs</p>
                  <p className="text-3xl font-bold">{totalCourses}</p>
                </div>
                <div className="text-4xl opacity-80">📚</div>
              </div>
            </div>

            <div className="bg-green-500 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Aktif Kurs</p>
                  <p className="text-3xl font-bold">{activeCourses}</p>
                </div>
                <div className="text-4xl opacity-80">✅</div>
              </div>
            </div>

            <div className="bg-purple-500 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Toplam Öğrenci</p>
                  <p className="text-3xl font-bold">{totalStudents}</p>
                </div>
                <div className="text-4xl opacity-80">👨‍🎓</div>
              </div>
            </div>

            <div className="bg-orange-500 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Öğretmen</p>
                  <p className="text-3xl font-bold">{totalTeachers}</p>
                </div>
                <div className="text-4xl opacity-80">👨‍🏫</div>
              </div>
            </div>
          </div>

          {/* Son Aktiviteler ve Bekleyen İşler */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Aktif Kurslar */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📚</span>
                Aktif Kurslar
              </h2>
              <div className="space-y-3">
                {mockCourses
                  .filter((c) => c.status === "active")
                  .map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {course.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {course.courseNo}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {course.totalLessons} oturum
                        </p>
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Aktif
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Bekleyen Ödemeler */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">💰</span>
                Bekleyen Ödemeler
              </h2>
              {pendingPayments > 0 ? (
                <div className="space-y-3">
                  {mockTeacherPayments
                    .filter((p) => !p.isPaid)
                    .map((payment, index) => {
                      const teacher = mockUsers.find(
                        (u) => u.id === payment.teacherId
                      );
                      const course = mockCourses.find(
                        (c) => c.id === payment.courseId
                      );
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                        >
                          <div>
                            <p className="font-semibold text-gray-800">
                              {teacher?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {course?.title}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                            ⏳ Bekliyor
                          </span>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Bekleyen ödeme bulunmuyor
                </p>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    // </AuthGuard>
  );
}
