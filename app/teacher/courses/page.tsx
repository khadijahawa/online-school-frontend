"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  mockCourses,
  mockLessons,
  mockStudents,
  mockCourseStudents,
} from "@/lib/mockData";

const teacherMenuItems = [
  { icon: "📊", label: "Dashboard", href: "/teacher/dashboard" },
  { icon: "📚", label: "Kurslarım", href: "/teacher/courses" },
  { icon: "📝", label: "Dersler", href: "/teacher/sessions" },
  { icon: "✅", label: "Tamamlanan", href: "/teacher/completed" },
];

export default function TeacherCourses() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // Mock: Öğretmen ID'si 2 olarak sabit
  const teacherId = "2";
  const teacherCourses = mockCourses.filter(
    (course) => course.teacherId === teacherId
  );

  const getCourseStats = (courseId: string) => {
    const lessons = mockLessons.filter((l) => l.courseId === courseId);
    const students = mockCourseStudents.filter(
      (cs) => cs.courseId === courseId
    );
    const completedLessons = lessons.filter((l) => l.isCompleted).length;

    return {
      totalLessons: lessons.length,
      completedLessons,
      studentCount: students.length,
      paidStudents: students.filter((s) => s.hasPaid).length,
    };
  };

  const getCourseStudents = (courseId: string) => {
    const enrollments = mockCourseStudents.filter(
      (cs) => cs.courseId === courseId
    );
    return enrollments
      .map((enrollment) => {
        const student = mockStudents.find((s) => s.id === enrollment.studentId);
        return {
          student,
          hasPaid: enrollment.hasPaid,
        };
      })
      .filter(Boolean);
  };

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
          {teacherCourses.map((course) => {
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
                    <span className="text-gray-600">👨‍🎓 Öğrenci:</span>
                    <span className="font-semibold text-gray-600">
                      {stats.studentCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">📝 Ders:</span>
                    <span className="font-semibold  text-gray-600">
                      {stats.completedLessons}/{course.totalLessons}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">💰 Ödeme:</span>
                    <span className="font-semibold  text-gray-600">
                      {stats.paidStudents}/{stats.studentCount}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>İlerleme</span>
                    <span className="text-gray-800 font-bold">
                      %
                      {Math.round(
                        (stats.completedLessons / course.totalLessons) * 100
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (stats.completedLessons / course.totalLessons) * 100,
                          100
                        )}%`,
                      }}
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
                const course = mockCourses.find((c) => c.id === selectedCourse);
                const courseStudents = getCourseStudents(selectedCourse);
                const stats = getCourseStats(selectedCourse);

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
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Dersler
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockLessons
                          .filter((l) => l.courseId === selectedCourse)
                          .map((lesson) => (
                            <div
                              key={lesson.id}
                              className="p-3 bg-white border border-gray-200 rounded-lg"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium text-gray-800">
                                  Ders {lesson.lessonNumber}: {lesson.topic}
                                </h5>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                              {lesson.date && (
                                <p className="text-sm text-gray-600 mb-1">
                                  📅 {lesson.date}
                                </p>
                              )}
                              <p className="text-sm text-gray-600">
                                Katılım: {lesson.attendance.length} öğrenci
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Özet
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">
                            {stats.studentCount}
                          </p>
                          <p className="text-sm text-gray-600">Öğrenci</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {stats.paidStudents}
                          </p>
                          <p className="text-sm text-gray-600">Ödeme Yapan</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">
                            {stats.completedLessons}
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
