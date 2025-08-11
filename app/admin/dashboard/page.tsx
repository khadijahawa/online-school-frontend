"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import courseService from "@/lib/services/courseService";
import studentService from "@/lib/services/studentService";
import teacherService from "@/lib/services/teacherService";

const adminMenuItems = [
  { icon: "📊", label: "Dashboard", href: "/admin/dashboard" },
  { icon: "📚", label: "Kurslar", href: "/admin/courses" },
  { icon: "👨‍🏫", label: "Öğretmenler", href: "/admin/teachers" },
  { icon: "👨‍🎓", label: "Öğrenciler", href: "/admin/students" },
  { icon: "💰", label: "Ödemeler", href: "/admin/payments" },
];

export default function AdminDashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const totalCourses = courses.length;
  const activeCourses = courses.filter(
    (course) => course.status === "active"
  ).length;
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const pendingPayments = 0; // TODO: Payment API endpoint'i gerekli

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Okul yönetim sisteminin genel durumu</p>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Kurs</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalCourses}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif Kurs</p>
                <p className="text-2xl font-bold text-gray-800">
                  {activeCourses}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Toplam Öğrenci
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalStudents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Toplam Öğretmen
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalTeachers}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Son Aktiviteler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Son Eklenen Kurslar
            </h2>
            {courses.slice(0, 5).length > 0 ? (
              <div className="space-y-3">
                {courses.slice(0, 5).map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {course.title}
                      </p>
                      <p className="text-sm text-gray-600">{course.courseNo}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.status === "active"
                          ? "bg-green-100 text-green-800"
                          : course.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {course.status === "active"
                        ? "Aktif"
                        : course.status === "completed"
                        ? "Tamamlandı"
                        : "İptal"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Henüz kurs bulunmuyor</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Son Eklenen Öğrenciler
            </h2>
            {students.slice(0, 5).length > 0 ? (
              <div className="space-y-3">
                {students.slice(0, 5).map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {student.name}
                      </p>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.isNew
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {student.isNew ? "Yeni" : "Mevcut"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Henüz öğrenci bulunmuyor</p>
            )}
          </div>
        </div>

        {/* Hızlı Erişim */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Hızlı Erişim</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/admin/courses"
              className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">📚</div>
              <div className="font-semibold">Kurs Yönetimi</div>
            </a>
            <a
              href="/admin/teachers"
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">👨‍🏫</div>
              <div className="font-semibold">Öğretmen Yönetimi</div>
            </a>
            <a
              href="/admin/students"
              className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">👨‍🎓</div>
              <div className="font-semibold">Öğrenci Yönetimi</div>
            </a>
            <a
              href="/admin/payments"
              className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">💰</div>
              <div className="font-semibold">Ödeme Yönetimi</div>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
