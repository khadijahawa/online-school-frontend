"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  mockCourses,
  mockUsers,
  mockSessions,
  mockCourseStudents,
  mockStudents,
} from "@/lib/mockData";

const adminMenuItems = [
  { icon: "📊", label: "Dashboard", href: "/admin/dashboard" },
  { icon: "📚", label: "Kurslar", href: "/admin/courses" },
  { icon: "👨‍🏫", label: "Öğretmenler", href: "/admin/teachers" },
  { icon: "👨‍🎓", label: "Öğrenciler", href: "/admin/students" },
  { icon: "💰", label: "Ödemeler", href: "/admin/payments" },
];

export default function AdminCourses() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    courseNo: "",
    teacherId: "",
    totalSessions: 1,
  });

  const teachers = mockUsers.filter((u) => u.role === "teacher");

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: Kurs ekleme işlemi
    console.log("Yeni kurs:", newCourse);
    setShowAddForm(false);
    setNewCourse({ title: "", courseNo: "", teacherId: "", totalSessions: 1 });
    alert("Kurs başarıyla eklendi!");
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = mockUsers.find((u) => u.id === teacherId);
    return teacher?.name || "Bilinmeyen";
  };

  const getCourseStats = (courseId: string) => {
    const sessions = mockSessions.filter((s) => s.courseId === courseId);
    const students = mockCourseStudents.filter(
      (cs) => cs.courseId === courseId
    );
    const completedSessions = sessions.filter(
      (s) => s.status === "completed"
    ).length;

    return {
      totalSessions: sessions.length,
      completedSessions,
      studentCount: students.length,
      paidStudents: students.filter((s) => s.hasPaid).length,
    };
  };

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

        {/* Kurs Ekleme Formu */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Toplam Oturum Sayısı
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newCourse.totalSessions}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        totalSessions: parseInt(e.target.value),
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

        {/* Kurs Listesi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockCourses.map((course) => {
            const stats = getCourseStats(course.id);
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
                    <span className="font-semibold">
                      {getTeacherName(course.teacherId)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">👨‍🎓 Öğrenci:</span>
                    <span className="font-semibold">{stats.studentCount}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">📝 Oturum:</span>
                    <span className="font-semibold">
                      {stats.completedSessions}/{course.totalSessions}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">💰 Ödeme:</span>
                    <span className="font-semibold">
                      {stats.paidStudents}/{stats.studentCount}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>İlerleme</span>
                    <span>
                      %
                      {Math.round(
                        (stats.completedSessions / course.totalSessions) * 100
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (stats.completedSessions / course.totalSessions) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors">
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
