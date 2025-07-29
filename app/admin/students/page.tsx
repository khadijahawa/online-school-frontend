"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockStudents, mockCourseStudents, mockCourses } from "@/lib/mockData";

const adminMenuItems = [
  { icon: "📊", label: "Dashboard", href: "/admin/dashboard" },
  { icon: "📚", label: "Kurslar", href: "/admin/courses" },
  { icon: "👨‍🏫", label: "Öğretmenler", href: "/admin/teachers" },
  { icon: "👨‍🎓", label: "Öğrenciler", href: "/admin/students" },
  { icon: "💰", label: "Ödemeler", href: "/admin/payments" },
];

export default function AdminStudents() {
  const [showAddForm, setShowAddForm] = useState(false);
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

  const togglePayment = (studentId: string, courseId: string) => {
    // Mock: Ödeme durumunu değiştirme
    alert("Ödeme durumu güncellendi!");
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

        {/* Öğrenci Listesi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockStudents.map((student) => {
            const studentCourses = getStudentCourses(student.id);
            const totalCourses = studentCourses.length;
            const paidCourses = studentCourses.filter(
              (sc) => sc.hasPaid
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
                    <span className="text-gray-600">📚 Kayıtlı Kurs:</span>
                    <span className="font-semibold">{totalCourses}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">💰 Ödenen:</span>
                    <span className="font-semibold">
                      {paidCourses}/{totalCourses}
                    </span>
                  </div>
                </div>

                {/* Kurslar ve Ödeme Durumu */}
                {studentCourses.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Kayıtlı Kurslar:
                    </h4>
                    <div className="space-y-2">
                      {studentCourses.map((sc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {sc.course?.title}
                            </p>
                            <p className="text-xs text-gray-600">
                              {sc.course?.courseNo}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              togglePayment(student.id, sc.course?.id || "")
                            }
                            className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                              sc.hasPaid
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            }`}
                          >
                            {sc.hasPaid ? "💰 Ödedi" : "❌ Ödemedi"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors">
                    Kursa Kaydet
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
