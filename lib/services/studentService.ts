import axiosClient from "../axiosClient";
import {
  MappedCourse,
  CreateStudentRequest,
  CreateStudentResponse,
} from "../types";

export interface StudentResponse {
  id: number;
  name: string;
  phone: string;
  email: string;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentCourseResponse {
  id: number;
  title: string;
  course_no: string;
  total_sessions: number;
  status: "active" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  teacher_id: number;
}

class StudentService {
  // Tüm öğrencileri getir
  async getAllStudents(): Promise<StudentResponse[]> {
    try {
      const response = await axiosClient.get<StudentResponse[]>("/students");
      return response.data;
    } catch (error) {
      console.error("Öğrenciler getirilirken hata:", error);
      throw new Error("Öğrenciler yüklenirken bir hata oluştu");
    }
  }

  // Belirli bir öğrenciyi getir
  async getStudentById(id: string): Promise<StudentResponse> {
    try {
      const response = await axiosClient.get<StudentResponse>(
        `/students/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Öğrenci getirilirken hata:", error);
      throw new Error("Öğrenci yüklenirken bir hata oluştu");
    }
  }

  // Öğrencinin kurslarını getir
  async getStudentCourses(studentId: string): Promise<MappedCourse[]> {
    try {
      const response = await axiosClient.get<StudentCourseResponse[]>(
        `/students/${studentId}/courses`
      );

      return response.data.map(
        (course): MappedCourse => ({
          id: course.id.toString(),
          title: course.title,
          courseNo: course.course_no,
          teacherId: course.teacher_id.toString(),
          totalLessons: course.total_sessions,
          status: course.status,
          createdAt: new Date(course.createdAt),
          teacherName: "Öğretmen bilgisi yükleniyor...", // API'de teacher bilgisi yok
          teacherEmail: "email@example.com", // API'de teacher bilgisi yok
        })
      );
    } catch (error) {
      console.error("Öğrenci kursları getirilirken hata:", error);
      throw new Error("Öğrenci kursları yüklenirken bir hata oluştu");
    }
  }

  // Yeni öğrenci ekle
  async createStudent(
    studentData: CreateStudentRequest
  ): Promise<CreateStudentResponse> {
    try {
      const response = await axiosClient.post<CreateStudentResponse>(
        "/students",
        studentData
      );
      return response.data;
    } catch (error: any) {
      console.error("Öğrenci eklenirken hata:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Öğrenci eklenirken bir hata oluştu");
    }
  }

  // Öğrenci bilgilerini güncelle
  async updateStudent(
    studentId: string,
    studentData: Partial<{
      name: string;
      phone: string;
      email: string;
    }>
  ): Promise<StudentResponse> {
    try {
      const response = await axiosClient.patch<StudentResponse>(
        `/students/${studentId}`,
        studentData
      );
      return response.data;
    } catch (error) {
      console.error("Öğrenci güncellenirken hata:", error);
      throw new Error("Öğrenci güncellenirken bir hata oluştu");
    }
  }

  // Öğrenciyi sil
  async deleteStudent(studentId: string): Promise<void> {
    try {
      await axiosClient.delete(`/students/${studentId}`);
    } catch (error) {
      console.error("Öğrenci silinirken hata:", error);
      throw new Error("Öğrenci silinirken bir hata oluştu");
    }
  }

  // Öğrenci istatistiklerini hesapla
  async getStudentStats(studentId: string): Promise<{
    totalCourses: number;
    activeCourses: number;
    completedCourses: number;
    totalLessons: number;
    completedLessons: number;
  }> {
    try {
      const courses = await this.getStudentCourses(studentId);
      const activeCourses = courses.filter((c) => c.status === "active").length;
      const completedCourses = courses.filter(
        (c) => c.status === "completed"
      ).length;

      // TODO: Lesson count için ayrı endpoint gerekli
      return {
        totalCourses: courses.length,
        activeCourses,
        completedCourses,
        totalLessons: 0, // API'de lesson count yok
        completedLessons: 0, // API'de lesson count yok
      };
    } catch (error) {
      console.error("Öğrenci istatistikleri hesaplanırken hata:", error);
      throw new Error("Öğrenci istatistikleri hesaplanırken bir hata oluştu");
    }
  }
}

export const studentService = new StudentService();
export default studentService;
