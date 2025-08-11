"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import courseService from "@/lib/services/courseService";
import sessionService from "@/lib/services/sessionService";
import { MappedCourse, MappedSession } from "@/lib/types";

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
  const [courses, setCourses] = useState<MappedCourse[]>([]);
  const [sessions, setSessions] = useState<MappedSession[]>([]);
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

        // Tüm kursların session'larını topla
        const allSessions: MappedSession[] = [];
        for (const course of fetchedCourses) {
          try {
            const courseSessions = await courseService.getSessionsForCourse(
              course.id
            );
            allSessions.push(...courseSessions);
          } catch (err) {
            console.warn(
              `Course ${course.id} sessions could not be loaded:`,
              err
            );
          }
        }
        setSessions(allSessions);
      } catch (err: any) {
        setError(err.message || "Veriler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId]);

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: API'ye session ekleme endpoint'i gerekli
      console.log("Yeni ders:", newLesson);
      setShowAddForm(false);
      setNewLesson({
        courseId: "",
        topic: "",
        date: "",
        notes: "",
        attendance: [],
      });
      alert("Ders ekleme özelliği henüz API'ye bağlanmadı!");
    } catch (error) {
      console.error("Ders eklenirken hata:", error);
      alert("Ders eklenirken bir hata oluştu!");
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    try {
      await sessionService.markSessionComplete(lessonId);
      // Session listesini yenile
      window.location.reload();
    } catch (error) {
      alert("Ders tamamlanırken bir hata oluştu!");
    }
  };

  const cancelLesson = async (lessonId: string) => {
    if (confirm("Bu dersi iptal etmek istediğinizden emin misiniz?")) {
      try {
        await sessionService.cancelSession(lessonId);
        // Session listesini yenile
        window.location.reload();
      } catch (error) {
        alert("Ders iptal edilirken bir hata oluştu!");
      }
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
                    {courses
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
          {sessions.map((session) => {
            const course = courses.find((c) => c.id === session.courseId);
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

            const config = statusConfig[session.status];

            return (
              <div
                key={session.id}
                className={`rounded-xl border-2 p-6 ${config.bg} ${config.border}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {course?.title} - Ders {session.lessonNumber}
                    </h3>
                    <p className="text-gray-600 mb-2">{session.topic}</p>
                    {session.date && (
                      <p className="text-sm text-gray-500">📅 {session.date}</p>
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
                      Katılımcılar
                    </h4>
                    <p className="text-gray-500 text-sm">
                      Katılımcı bilgileri henüz API'ye bağlanmadı
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Notlar</h4>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded-lg">
                      {session.notes || "Not eklenmemiş"}
                    </p>
                  </div>
                </div>

                {session.status === "planned" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => markLessonComplete(session.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      ✅ Tamamlandı
                    </button>
                    <button
                      onClick={() => cancelLesson(session.id)}
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

          {sessions.length === 0 && (
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
