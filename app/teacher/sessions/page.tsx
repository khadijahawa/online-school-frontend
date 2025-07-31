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

export default function TeacherSessions() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [newLesson, setNewLesson] = useState({
    courseId: "",
    topic: "",
    date: "",
    notes: "",
    attendance: [] as string[],
  });

  // Mock: Öğretmen ID'si 2 olarak sabit
  const teacherId = "2";
  const teacherCourses = mockCourses.filter(
    (course) => course.teacherId === teacherId
  );
  const teacherLessons = mockLessons.filter((l) =>
    teacherCourses.some((c) => c.id === l.courseId)
  );

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Yeni ders:", newLesson);
    setShowAddForm(false);
    setNewLesson({
      courseId: "",
      topic: "",
      date: "",
      notes: "",
      attendance: [],
    });
    alert("Ders başarıyla eklendi!");
  };

  const markLessonComplete = (lessonId: string) => {
    alert("Ders tamamlandı olarak işaretlendi!");
  };

  const cancelLesson = (lessonId: string) => {
    if (confirm("Bu dersi iptal etmek istediğinizden emin misiniz?")) {
      alert("Ders iptal edildi!");
    }
  };

  const getCourseStudents = (courseId: string) => {
    const enrollments = mockCourseStudents.filter(
      (cs) => cs.courseId === courseId
    );
    return enrollments
      .map((enrollment) =>
        mockStudents.find((s) => s.id === enrollment.studentId)
      )
      .filter(Boolean);
  };

  return (
    <DashboardLayout
      title="👩‍🏫 Öğretmen Paneli"
      menuItems={teacherMenuItems}
      requiredRole="teacher"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Ders Yönetimi
            </h1>
            <p className="text-gray-600">
              Kurs derslerinizi planlayın ve yönetin
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
          >
            ➕ Yeni Ders Ekle
          </button>
        </div>

        {/* Ders Ekleme Formu */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Yeni Ders Ekle
              </h2>
              <form onSubmit={handleAddLesson} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kurs
                  </label>
                  <select
                    value={newLesson.courseId}
                    onChange={(e) => {
                      setNewLesson({
                        ...newLesson,
                        courseId: e.target.value,
                      });
                      setSelectedCourse(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Kurs seçin</option>
                    {teacherCourses
                      .filter((c) => c.status === "active")
                      .map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title} ({course.courseNo})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ders Konusu
                  </label>
                  <input
                    type="text"
                    value={newLesson.topic}
                    onChange={(e) =>
                      setNewLesson({ ...newLesson, topic: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Örn: Doğal Sayılar"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarih
                  </label>
                  <input
                    type="date"
                    value={newLesson.date}
                    onChange={(e) =>
                      setNewLesson({ ...newLesson, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notlar
                  </label>
                  <textarea
                    value={newLesson.notes}
                    onChange={(e) =>
                      setNewLesson({ ...newLesson, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    rows={3}
                    placeholder="Ders hakkında notlarınız..."
                  />
                </div>

                {selectedCourse && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Katılımcılar
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {getCourseStudents(selectedCourse).map((student) => (
                        <label key={student?.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newLesson.attendance.includes(
                              student?.id || ""
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewLesson({
                                  ...newLesson,
                                  attendance: [
                                    ...newLesson.attendance,
                                    student?.id || "",
                                  ],
                                });
                              } else {
                                setNewLesson({
                                  ...newLesson,
                                  attendance: newLesson.attendance.filter(
                                    (id) => id !== student?.id
                                  ),
                                });
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">
                            {student?.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                  >
                    Ders Ekle
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

        {/* Ders Listesi */}
        <div className="space-y-6">
          {teacherLessons.map((lesson) => {
            const course = mockCourses.find((c) => c.id === lesson.courseId);
            const attendingStudents = lesson.attendance
              .map((studentId) => mockStudents.find((s) => s.id === studentId))
              .filter(Boolean);

            const statusConfig = {
              completed: {
                bg: "bg-green-50",
                border: "border-green-200",
                badge: "bg-green-100 text-green-800",
                icon: "✅",
                label: "Tamamlandı",
              },
              cancelled: {
                bg: "bg-red-50",
                border: "border-red-200",
                badge: "bg-red-100 text-red-800",
                icon: "❌",
                label: "İptal Edildi",
              },
              planned: {
                bg: "bg-blue-50",
                border: "border-blue-200",
                badge: "bg-blue-100 text-blue-800",
                icon: "📅",
                label: "Planlandı",
              },
            };

            const config = statusConfig[lesson.status];

            return (
              <div
                key={lesson.id}
                className={`rounded-xl border-2 p-6 ${config.bg} ${config.border}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {course?.title} - Ders {lesson.lessonNumber}
                    </h3>
                    <p className="text-gray-600 mb-2">{lesson.topic}</p>
                    {lesson.date && (
                      <p className="text-sm text-gray-500">📅 {lesson.date}</p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${config.badge}`}
                  >
                    <span className="mr-1">{config.icon}</span>
                    {config.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Katılımcılar ({attendingStudents.length})
                    </h4>
                    <div className="space-y-1">
                      {attendingStudents.map((student) => (
                        <div
                          key={student?.id}
                          className="flex items-center text-sm"
                        >
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {student?.name}
                        </div>
                      ))}
                      {attendingStudents.length === 0 && (
                        <p className="text-gray-500 text-sm">
                          Henüz katılımcı yok
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Notlar</h4>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded-lg">
                      {lesson.notes || "Not eklenmemiş"}
                    </p>
                  </div>
                </div>

                {lesson.status === "planned" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => markLessonComplete(lesson.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      ✅ Tamamlandı
                    </button>
                    <button
                      onClick={() => cancelLesson(lesson.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      ❌ İptal Et
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                      📝 Düzenle
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {teacherLessons.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                Henüz ders bulunmuyor
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                İlk Dersinizi Ekleyin
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
