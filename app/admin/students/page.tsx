"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  mockStudents,
  mockCourseStudents,
  mockCourses,
  mockLessons,
  mockStudentPayments,
} from "@/lib/mockData";

const adminMenuItems = [
  { icon: "📊", label: "Dashboard", href: "/admin/dashboard" },
  { icon: "📚", label: "Kurslar", href: "/admin/courses" },
  { icon: "👨‍🏫", label: "Öğretmenler", href: "/admin/teachers" },
  { icon: "👨‍🎓", label: "Öğrenciler", href: "/admin/students" },
  { icon: "💰", label: "Ödemeler", href: "/admin/payments" },
];

export default function AdminStudents() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [newStudent, setNewStudent] = useState({
    name: "",
    phone: "",
    email: "",
    isNew: true,
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Yeni öğrenci:", newStudent);
    setShowAddForm(false);
    setNewStudent({ name: "", phone: "", email: "", isNew: true });
    alert("Öğrenci başarıyla eklendi!");
  };

  const getStudentCourses = (studentId: string) => {
    const enrollments = mockCourseStudents.filter(
      (cs) => cs.studentId === studentId
    );
    return enrollments.map((enrollment) => {
      const course = mockCourses.find((c) => c.id === enrollment.courseId);
      return {
        course,
        hasPaid: enrollment.hasPaid,
      };
    });
  };

  const getStudentPayments = (studentId: string) => {
    return mockStudentPayments.filter(
      (payment) => payment.studentId === studentId
    );
  };

  const getStudentLessons = (studentId: string) => {
    const studentCourses = getStudentCourses(studentId);
    const courseIds = studentCourses.map((sc) => sc.course?.id).filter(Boolean);

    return mockLessons.filter(
      (lesson) =>
        courseIds.includes(lesson.courseId) &&
        lesson.attendance.includes(studentId)
    );
  };

  const togglePayment = (studentId: string, courseId: string) => {
    // Mock: Ödeme durumunu değiştirme
    alert("Ödeme durumu güncellendi!");
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = mockStudents.find((s) => s.id === teacherId);
    return teacher?.name || "Bilinmeyen";
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
              Öğrenci Yönetimi
            </h1>
            <p className="text-gray-600">
              Tüm öğrencileri görüntüleyin ve yönetin
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
          >
            ➕ Yeni Öğrenci Ekle
          </button>
        </div>

        {/* Öğrenci Ekleme Formu */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Yeni Öğrenci Ekle
              </h2>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Örn: Ali Veli"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={newStudent.phone}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Örn: +90 555 123 4567"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Örn: ali@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newStudent.isNew}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          isNew: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Yeni öğrenci</span>
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                  >
                    Öğrenci Ekle
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

        {/* Öğrenci Detayları Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Öğrenci Detayları
                </h2>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {(() => {
                const student = mockStudents.find(
                  (s) => s.id === selectedStudent
                );
                const studentCourses = getStudentCourses(selectedStudent);
                const studentPayments = getStudentPayments(selectedStudent);
                const studentLessons = getStudentLessons(selectedStudent);

                if (!student) return null;

                const activeCourses = studentCourses.filter(
                  (sc) => sc.course?.status === "active"
                );
                const pastCourses = studentCourses.filter(
                  (sc) => sc.course?.status === "completed"
                );

                return (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {student.name}
                      </h3>
                      <p className="text-gray-600">{student.email}</p>
                      <p className="text-gray-600">{student.phone}</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                          student.isNew
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {student.isNew ? "🟢 Yeni Öğrenci" : "🔁 Devam Eden"}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Aktif Kurslar
                      </h4>
                      {activeCourses.length > 0 ? (
                        <div className="space-y-3">
                          {activeCourses.map((sc, index) => (
                            <div
                              key={index}
                              className="p-4 bg-white border border-gray-200 rounded-lg"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h5 className="font-medium text-gray-800">
                                    {sc.course?.title}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    {sc.course?.courseNo}
                                  </p>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    sc.hasPaid
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {sc.hasPaid ? "💰 Ödedi" : "❌ Ödemedi"}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>
                                  Toplam Ders: {sc.course?.totalLessons}
                                </span>
                                <span>
                                  Katıldığı Ders:{" "}
                                  {
                                    studentLessons.filter(
                                      (l) => l.courseId === sc.course?.id
                                    ).length
                                  }
                                </span>
                              </div>
                            </div>
                          ))}
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
                          {pastCourses.map((sc, index) => (
                            <div
                              key={index}
                              className="p-4 bg-white border border-gray-200 rounded-lg"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h5 className="font-medium text-gray-800">
                                    {sc.course?.title}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    {sc.course?.courseNo}
                                  </p>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    sc.hasPaid
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {sc.hasPaid ? "💰 Ödedi" : "❌ Ödemedi"}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>
                                  Toplam Ders: {sc.course?.totalLessons}
                                </span>
                                <span>
                                  Katıldığı Ders:{" "}
                                  {
                                    studentLessons.filter(
                                      (l) => l.courseId === sc.course?.id
                                    ).length
                                  }
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">Geçmiş kurs bulunmuyor</p>
                      )}
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Ödemeler
                      </h4>
                      {studentPayments.length > 0 ? (
                        <div className="space-y-2">
                          {studentPayments.map((payment, index) => {
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
                                    {payment.date.toLocaleDateString("tr-TR")} -{" "}
                                    {payment.amount}₺
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
                        Katıldığı Dersler
                      </h4>
                      {studentLessons.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {studentLessons.map((lesson, index) => {
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
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-500">Henüz derse katılmamış</p>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Öğrenci Listesi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockStudents.map((student) => {
            const studentCourses = getStudentCourses(student.id);
            const totalCourses = studentCourses.length;
            const paidCourses = studentCourses.filter(
              (sc) => sc.hasPaid
            ).length;
            const activeCourses = studentCourses.filter(
              (sc) => sc.course?.status === "active"
            ).length;
            const pastCourses = studentCourses.filter(
              (sc) => sc.course?.status === "completed"
            ).length;

            return (
              <div
                key={student.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {student.name}
                    </h3>
                    <p className="text-gray-600">{student.email}</p>
                    <p className="text-gray-600">{student.phone}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      student.isNew
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {student.isNew ? "🟢 Yeni Öğrenci" : "🔁 Devam Eden"}
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
                    <span className="text-gray-600">💰 Ödenen:</span>
                    <span className="font-semibold">
                      {paidCourses}/{totalCourses}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedStudent(student.id)}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
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
