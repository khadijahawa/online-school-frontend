import axiosClient from "../axiosClient";
import { CreateTeacherRequest, CreateTeacherResponse } from "../types";

export interface TeacherResponse {
  id: number;
  userId: number;
  user_id: number;
  createdAt: string;
  updatedAt: string;
  User: {
    id: number;
    name: string;
    email: string;
    role: "admin" | "teacher";
    password?: string;
    createdAt: string;
    updatedAt: string;
  };
}

// Kurs response'undan sadece Teacher bilgisini almak için minimal tip
interface CourseTeacherFromCourseResponse {
  id: number;
  userId: number;
  user_id: number;
  createdAt: string;
  updatedAt: string;
  User: {
    id: number;
    name: string;
    email: string;
    role: "admin" | "teacher";
    createdAt: string;
    updatedAt: string;
  };
}

interface CourseForTeacherFallbackResponse {
  id: number;
  title: string;
  course_no: string;
  total_sessions: number;
  status: "active" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  teacher_id: number;
  Teacher: CourseTeacherFromCourseResponse;
}

class TeacherService {
  // Tüm öğretmenleri getir (fallback: kurslardan türet)
  async getAllTeachers(): Promise<TeacherResponse[]> {
    try {
      const response = await axiosClient.get<TeacherResponse[]>(
        "/admin/teachers"
      );
      return response.data;
    } catch (error: any) {
      // 404 ise fallback: /courses'dan benzersiz teacher'ları topla
      if (error?.response?.status === 404) {
        try {
          const coursesRes = await axiosClient.get<
            CourseForTeacherFallbackResponse[]
          >("/courses");
          const teacherMap = new Map<number, TeacherResponse>();

          for (const course of coursesRes.data) {
            const t = course.Teacher;
            if (!t) continue;
            if (!teacherMap.has(t.id)) {
              teacherMap.set(t.id, {
                id: t.id,
                userId: t.userId,
                user_id: t.user_id,
                createdAt: t.createdAt,
                updatedAt: t.updatedAt,
                User: {
                  id: t.User.id,
                  name: t.User.name,
                  email: t.User.email,
                  role: t.User.role,
                  createdAt: t.User.createdAt,
                  updatedAt: t.User.updatedAt,
                },
              });
            }
          }

          return Array.from(teacherMap.values());
        } catch (fallbackError) {
          console.error("Öğretmen fallback yüklenirken hata:", fallbackError);
          throw new Error("Öğretmen listesi yüklenemedi");
        }
      }

      console.error("Öğretmenler getirilirken hata:", error);
      throw new Error("Öğretmenler yüklenirken bir hata oluştu");
    }
  }

  // Belirli bir öğretmeni getir (404'te fallback: kurslardan ara)
  async getTeacherById(id: string): Promise<TeacherResponse> {
    try {
      const response = await axiosClient.get<TeacherResponse>(
        `/admin/teachers/${id}`
      );
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        const teachers = await this.getAllTeachers();
        const found = teachers.find((t) => t.id.toString() === id);
        if (found) return found;
      }
      console.error("Öğretmen getirilirken hata:", error);
      throw new Error("Öğretmen yüklenirken bir hata oluştu");
    }
  }

  // Yeni öğretmen ekle
  async createTeacher(
    teacherData: CreateTeacherRequest
  ): Promise<CreateTeacherResponse> {
    try {
      const response = await axiosClient.post<CreateTeacherResponse>(
        "/admin/teachers",
        teacherData
      );
      return response.data;
    } catch (error: any) {
      console.error("Öğretmen eklenirken hata:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Öğretmen eklenirken bir hata oluştu");
    }
  }

  // Öğretmen bilgilerini güncelle (eğer destekleniyorsa)
  async updateTeacher(
    teacherId: string,
    teacherData: Partial<{ name: string; email: string }>
  ): Promise<TeacherResponse> {
    const response = await axiosClient.patch<TeacherResponse>(
      `/admin/teachers/${teacherId}`,
      teacherData
    );
    return response.data;
  }

  // Öğretmeni sil (eğer destekleniyorsa)
  async deleteTeacher(teacherId: string): Promise<void> {
    await axiosClient.delete(`/admin/teachers/${teacherId}`);
  }

  // Öğretmen istatistiklerini hesapla
  async getTeacherStats(teacherId: string): Promise<{
    totalCourses: number;
    activeCourses: number;
    completedCourses: number;
    totalStudents: number;
    totalLessons: number;
  }> {
    try {
      // TODO: Teacher courses ve students için ayrı endpoint'ler gerekli
      return {
        totalCourses: 0,
        activeCourses: 0,
        completedCourses: 0,
        totalStudents: 0,
        totalLessons: 0,
      };
    } catch (error) {
      console.error("Öğretmen istatistikleri hesaplanırken hata:", error);
      throw new Error("Öğretmen istatistikleri hesaplanırken bir hata oluştu");
    }
  }
}

export const teacherService = new TeacherService();
export default teacherService;
