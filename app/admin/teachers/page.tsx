"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import teacherService from "@/lib/services/teacherService";
import { CreateTeacherRequest } from "@/lib/types";
import type { TeacherResponse } from "@/lib/services/teacherService";

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
  const [newTeacher, setNewTeacher] = useState<CreateTeacherRequest>({
    name: "",
    email: "",
    password: "",
  });
  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedTeachers = await teacherService.getAllTeachers();
        setTeachers(fetchedTeachers);
      } catch (err: any) {
        setError(
          err.message ||
            "Öğretmen listesi yüklenemedi. Lütfen daha sonra tekrar deneyin."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await teacherService.createTeacher(newTeacher);
      setShowAddForm(false);
      setNewTeacher({ name: "", email: "", password: "" });

      // Listeyi yenile
      const updatedTeachers = await teacherService.getAllTeachers();
      setTeachers(updatedTeachers);

      alert(response.message || "Öğretmen başarıyla eklendi!");
    } catch (error: any) {
      alert(`Öğretmen eklenirken hata: ${error.message}`);
    }
  };

  // Backend DELETE desteği yoksa bu fonksiyon kullanılmayabilir
  const handleDeleteTeacher = async (teacherId: string) => {
    if (confirm("Bu öğretmeni silmek istediğinizden emin misiniz?")) {
      try {
        await teacherService.deleteTeacher(teacherId);
        const updatedTeachers = await teacherService.getAllTeachers();
        setTeachers(updatedTeachers);
        alert("Öğretmen başarıyla silindi!");
      } catch (error: any) {
        alert(
          `Öğretmen silinirken hata: ${error.message}. Bu işlem backend tarafından desteklenmiyor olabilir.`
        );
      }
    }
  };

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
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
            <strong className="font-bold">Uyarı:</strong>
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
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
          >
            ➕ Yeni Öğretmen Ekle
          </button>
        </div>

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Örn: Mehmet Öğretmen"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Örn: mehmet@okul.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şifre
                  </label>
                  <input
                    type="password"
                    value={newTeacher.password}
                    onChange={(e) =>
                      setNewTeacher({ ...newTeacher, password: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Örn: mehmet123"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
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
                const teacher = teachers.find(
                  (t) => t.id.toString() === selectedTeacher
                );
                if (!teacher) return null;
                return (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {teacher.User.name}
                      </h3>
                      <p className="text-gray-600">{teacher.User.email}</p>
                      <p className="text-gray-600">ID: {teacher.id}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Kurslar
                      </h4>
                      <p className="text-gray-500">
                        Kurs bilgileri yükleniyor...
                      </p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Özet
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">
                            {/* TODO: Course count */}0
                          </p>
                          <p className="text-sm text-gray-600">Kurs</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {/* TODO: Active courses count */}0
                          </p>
                          <p className="text-sm text-gray-600">Aktif Kurs</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">
                            {/* TODO: Total students count */}0
                          </p>
                          <p className="text-sm text-gray-600">
                            Toplam Öğrenci
                          </p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">
                            {/* TODO: Total lessons count */}0
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

        <div className="grid grid-cols-1 lg:grid-cols-2 xl-grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {teacher.User.name}
                  </h3>
                  <p className="text-gray-600">{teacher.User.email}</p>
                  <p className="text-gray-600">ID: {teacher.id}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  👨‍🏫 Öğretmen
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">📚 Kurs:</span>
                  <span className="font-semibold text-gray-800">
                    {/* TODO: Course count */}0
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">👨‍🎓 Öğrenci:</span>
                  <span className="font-semibold text-gray-800">
                    {/* TODO: Student count */}0
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">📝 Ders:</span>
                  <span className="font-semibold text-gray-800">
                    {/* TODO: Lesson count */}0
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedTeacher(teacher.id.toString())}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                >
                  Detaylar
                </button>
                <button
                  onClick={() => handleDeleteTeacher(teacher.id.toString())}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                  title="Silme özelliği backend tarafından desteklenmeyebilir"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>

        {teachers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              Henüz öğretmen bulunmuyor
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              İlk Öğretmeninizi Ekleyin
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
