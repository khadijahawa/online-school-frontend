"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  mockUsers,
  mockCourses,
  mockLessons,
  mockTeacherPayments,
} from "@/lib/mockData";

const adminMenuItems = [
  { icon: "📊", label: "Dashboard", href: "/admin/dashboard" },
  { icon: "📚", label: "Kurslar", href: "/admin/courses" },
  { icon: "👨‍🏫", label: "Öğretmenler", href: "/admin/teachers" },
  { icon: "👨‍🎓", label: "Öğrenciler", href: "/admin/students" },
  { icon: "💰", label: "Ödemeler", href: "/admin/payments" },
];

export default function AdminTeachers() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
  });

  const teachers = mockUsers.filter((u) => u.role === "teacher");

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Yeni öğretmen:", newTeacher);
    setShowAddForm(false);
    setNewTeacher({ name: "", email: "" });
    alert("Öğretmen başarıyla eklendi!");
  };

  const getTeacherCourses = (teacherId: string) => {
    return mockCourses.filter((course) => course.teacherId === teacherId);
  };

  const getTeacherPayments = (teacherId: string) => {
    return mockTeacherPayments.filter(
      (payment) => payment.teacherId === teacherId
    );
  };

  const getTeacherLessons = (teacherId: string) => {
    const teacherCourses = getTeacherCourses(teacherId);
    const courseIds = teacherCourses.map((course) => course.id);

    return mockLessons.filter((lesson) => courseIds.includes(lesson.courseId));
  };

  const getCourseStats = (courseId: string) => {
    const lessons = mockLessons.filter((l) => l.courseId === courseId);
    const completedLessons = lessons.filter((l) => l.isCompleted).length;

    return {
      totalLessons: lessons.length,
      completedLessons,
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
              Öğretmen Yönetimi
            </h1>
            <p className="text-gray-600">
              Tüm öğretmenleri görüntüleyin ve yönetin
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
          >
            ➕ Yeni Öğretmen Ekle
          </button>
        </div>

        {/* Öğretmen Ekleme Formu */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Yeni Öğretmen Ekle
              </h2>
              <form onSubmit={handleAddTeacher} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={newTeacher.name}
                    onChange={(e) =>
                      setNewTeacher({ ...newTeacher, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Örn: Ayşe Öğretmen"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={newTeacher.email}
                    onChange={(e) =>
                      setNewTeacher({ ...newTeacher, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Örn: ayse@school.com"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                  >
                    Öğretmen Ekle
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

        {/* Öğretmen Detayları Modal */}
        {selectedTeacher && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Öğretmen Detayları
                </h2>
                <button
                  onClick={() => setSelectedTeacher(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {(() => {
                const teacher = mockUsers.find((t) => t.id === selectedTeacher);
                const teacherCourses = getTeacherCourses(selectedTeacher);
                const teacherPayments = getTeacherPayments(selectedTeacher);
                const teacherLessons = getTeacherLessons(selectedTeacher);

                if (!teacher) return null;

                const activeCourses = teacherCourses.filter(
                  (course) => course.status === "active"
                );
                const pastCourses = teacherCourses.filter(
                  (course) => course.status === "completed"
                );

                return (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {teacher.name}
                      </h3>
                      <p className="text-gray-600">{teacher.email}</p>
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 bg-blue-100 text-blue-800">
                        👨‍🏫 Öğretmen
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Aktif Kurslar
                      </h4>
                      {activeCourses.length > 0 ? (
                        <div className="space-y-3">
                          {activeCourses.map((course, index) => {
                            const stats = getCourseStats(course.id);
                            return (
                              <div
                                key={index}
                                className="p-4 bg-white border border-gray-200 rounded-lg"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h5 className="font-medium text-gray-800">
                                      {course.title}
                                    </h5>
                                    <p className="text-sm text-gray-600">
                                      {course.courseNo}
                                    </p>
                                  </div>
                                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    🟢 Aktif
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                  <span>
                                    Toplam Ders: {course.totalLessons}
                                  </span>
                                  <span>
                                    Tamamlanan: {stats.completedLessons}
                                  </span>
                                </div>
                                <div className="mt-2">
                                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>İlerleme</span>
                                    <span>
                                      %
                                      {Math.round(
                                        (stats.completedLessons /
                                          course.totalLessons) *
                                          100
                                      )}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${Math.min(
                                          (stats.completedLessons /
                                            course.totalLessons) *
                                            100,
                                          100
                                        )}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-500">Aktif kurs bulunmuyor</p>
                      )}
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Geçmiş Kurslar
                      </h4>
                      {pastCourses.length > 0 ? (
                        <div className="space-y-3">
                          {pastCourses.map((course, index) => {
                            const stats = getCourseStats(course.id);
                            return (
                              <div
                                key={index}
                                className="p-4 bg-white border border-gray-200 rounded-lg"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h5 className="font-medium text-gray-800">
                                      {course.title}
                                    </h5>
                                    <p className="text-sm text-gray-600">
                                      {course.courseNo}
                                    </p>
                                  </div>
                                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    🔵 Tamamlandı
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                  <span>
                                    Toplam Ders: {course.totalLessons}
                                  </span>
                                  <span>
                                    Tamamlanan: {stats.completedLessons}
                                  </span>
                                </div>
                                <div className="mt-2">
                                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>İlerleme</span>
                                    <span>
                                      %
                                      {Math.round(
                                        (stats.completedLessons /
                                          course.totalLessons) *
                                          100
                                      )}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${Math.min(
                                          (stats.completedLessons /
                                            course.totalLessons) *
                                            100,
                                          100
                                        )}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-500">Geçmiş kurs bulunmuyor</p>
                      )}
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Ödemeler
                      </h4>
                      {teacherPayments.length > 0 ? (
                        <div className="space-y-2">
                          {teacherPayments.map((payment, index) => {
                            const course = mockCourses.find(
                              (c) => c.id === payment.courseId
                            );
                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                              >
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {course?.title}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {course?.courseNo}
                                  </p>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    payment.isPaid
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {payment.isPaid ? "✅ Ödendi" : "❌ Ödenmedi"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-500">Ödeme kaydı bulunmuyor</p>
                      )}
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Verdiği Dersler
                      </h4>
                      {teacherLessons.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {teacherLessons.map((lesson, index) => {
                            const course = mockCourses.find(
                              (c) => c.id === lesson.courseId
                            );
                            return (
                              <div
                                key={index}
                                className="p-3 bg-white border border-gray-200 rounded-lg"
                              >
                                <h5 className="font-medium text-gray-800 mb-1">
                                  {course?.title} - Ders {lesson.lessonNumber}
                                </h5>
                                <p className="text-sm text-gray-600 mb-1">
                                  {lesson.topic}
                                </p>
                                {lesson.date && (
                                  <p className="text-sm text-gray-500">
                                    📅 {lesson.date}
                                  </p>
                                )}
                                <span
                                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                    lesson.isCompleted
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {lesson.isCompleted
                                    ? "✅ Tamamlandı"
                                    : "⏳ Bekliyor"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-500">Henüz ders vermemiş</p>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Öğretmen Listesi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {teachers.map((teacher) => {
            const teacherCourses = getTeacherCourses(teacher.id);
            const totalCourses = teacherCourses.length;
            const activeCourses = teacherCourses.filter(
              (course) => course.status === "active"
            ).length;
            const pastCourses = teacherCourses.filter(
              (course) => course.status === "completed"
            ).length;
            const totalLessons = teacherCourses.reduce(
              (sum, course) => sum + course.totalLessons,
              0
            );
            const completedLessons = getTeacherLessons(teacher.id).filter(
              (lesson) => lesson.isCompleted
            ).length;

            return (
              <div
                key={teacher.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {teacher.name}
                    </h3>
                    <p className="text-gray-600">{teacher.email}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    👨‍🏫 Öğretmen
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">📚 Toplam Kurs:</span>
                    <span className="font-semibold">{totalCourses}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">🟢 Aktif Kurs:</span>
                    <span className="font-semibold">{activeCourses}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">🔵 Geçmiş Kurs:</span>
                    <span className="font-semibold">{pastCourses}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">📝 Toplam Ders:</span>
                    <span className="font-semibold">{totalLessons}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">✅ Tamamlanan:</span>
                    <span className="font-semibold">{completedLessons}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedTeacher(teacher.id)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
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
