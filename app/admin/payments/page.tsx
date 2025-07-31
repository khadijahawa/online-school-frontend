"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  mockStudentPayments,
  mockTeacherPayments,
  mockStudents,
  mockUsers,
  mockCourses,
} from "@/lib/mockData";

const adminMenuItems = [
  { icon: "📊", label: "Dashboard", href: "/admin/dashboard" },
  { icon: "📚", label: "Kurslar", href: "/admin/courses" },
  { icon: "👨‍🏫", label: "Öğretmenler", href: "/admin/teachers" },
  { icon: "👨‍🎓", label: "Öğrenciler", href: "/admin/students" },
  { icon: "💰", label: "Ödemeler", href: "/admin/payments" },
];

export default function AdminPayments() {
  const [filterType, setFilterType] = useState<"all" | "students" | "teachers">(
    "all"
  );
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "unpaid">(
    "all"
  );

  const getStudentName = (studentId: string) => {
    const student = mockStudents.find((s) => s.id === studentId);
    return student?.name || "Bilinmeyen";
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = mockUsers.find((u) => u.id === teacherId);
    return teacher?.name || "Bilinmeyen";
  };

  const getCourseName = (courseId: string) => {
    const course = mockCourses.find((c) => c.id === courseId);
    return course?.title || "Bilinmeyen";
  };

  const filteredStudentPayments = mockStudentPayments.filter((payment) => {
    if (filterStatus === "all") return true;
    return filterStatus === "paid" ? payment.isPaid : !payment.isPaid;
  });

  const filteredTeacherPayments = mockTeacherPayments.filter((payment) => {
    if (filterStatus === "all") return true;
    return filterStatus === "paid" ? payment.isPaid : !payment.isPaid;
  });

  const totalStudentPayments = mockStudentPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );
  const paidStudentPayments = mockStudentPayments
    .filter((p) => p.isPaid)
    .reduce((sum, p) => sum + p.amount, 0);
  const unpaidStudentPayments = totalStudentPayments - paidStudentPayments;

  const totalTeacherPayments = mockTeacherPayments.length;
  const paidTeacherPayments = mockTeacherPayments.filter(
    (p) => p.isPaid
  ).length;
  const unpaidTeacherPayments = totalTeacherPayments - paidTeacherPayments;

  return (
    <DashboardLayout
      title="👨‍💼 Admin Paneli"
      menuItems={adminMenuItems}
      requiredRole="admin"
    >
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Ödeme Yönetimi
          </h1>
          <p className="text-gray-600">
            Öğrenci ve öğretmen ödemelerini görüntüleyin ve yönetin
          </p>
        </div>

        {/* Özet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Toplam Öğrenci Ödemesi
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalStudentPayments}₺
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-blue-600 text-xl">👨‍🎓</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Ödenen Öğrenci Ödemesi
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {paidStudentPayments}₺
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Bekleyen Öğrenci Ödemesi
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {unpaidStudentPayments}₺
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <span className="text-red-600 text-xl">❌</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Öğretmen Ödemeleri
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {paidTeacherPayments}/{totalTeacherPayments}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <span className="text-orange-600 text-xl">👨‍🏫</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtreleme */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setFilterType("students")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === "students"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Öğrenci Ödemeleri
              </button>
              <button
                onClick={() => setFilterType("teachers")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === "teachers"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Öğretmen Ödemeleri
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === "all"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Tüm Durumlar
              </button>
              <button
                onClick={() => setFilterStatus("paid")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === "paid"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Ödenen
              </button>
              <button
                onClick={() => setFilterStatus("unpaid")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === "unpaid"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Ödenmemiş
              </button>
            </div>
          </div>
        </div>

        {/* Öğrenci Ödemeleri */}
        {(filterType === "all" || filterType === "students") && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Öğrenci Ödemeleri
            </h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Öğrenci
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kurs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tutar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudentPayments.map((payment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {getStudentName(payment.studentId)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {getCourseName(payment.courseId)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.amount}₺
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {payment.date.toLocaleDateString("tr-TR")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              payment.isPaid
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {payment.isPaid ? "Ödendi" : "Ödenmedi"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            Düzenle
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Öğretmen Ödemeleri */}
        {(filterType === "all" || filterType === "teachers") && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Öğretmen Ödemeleri
            </h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Öğretmen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kurs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTeacherPayments.map((payment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {getTeacherName(payment.teacherId)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {getCourseName(payment.courseId)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              payment.isPaid
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {payment.isPaid ? "Ödendi" : "Ödenmedi"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            Düzenle
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
