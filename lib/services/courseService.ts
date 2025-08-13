import axiosClient from "../axiosClient";
import {
  Course,
  MappedCourse,
  MappedSession,
  CreateCourseRequest,
  CreateCourseResponse,
} from "../types";

export interface CourseResponse {
  id: number;
  title: string;
  course_no: string;
  teacher_id: number;
  total_sessions: number;
  status: "active" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  Teacher: {
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
      password: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  Sessions: Array<{
    id: number;
    session_number: number;
    date: string;
    topic: string;
    notes: string;
    status: "completed" | "cancelled" | "planned";
    createdAt: string;
    updatedAt: string;
    course_id: number;
  }>;
}

export interface CourseWithSessions extends MappedCourse {
  sessions: MappedSession[];
}

class CourseService {
  // Tüm kursları getir
  async getAllCourses(): Promise<MappedCourse[]> {
    try {
      const response = await axiosClient.get<CourseResponse[]>("/courses");

      return response.data.map(
        (course): MappedCourse => ({
          id: course.id.toString(),
          title: course.title,
          courseNo: course.course_no,
          teacherId: course.teacher_id.toString(),
          totalLessons: course.total_sessions,
          status: course.status,
          createdAt: new Date(course.createdAt),
          teacherName: course.Teacher.User.name,
          teacherEmail: course.Teacher.User.email,
        })
      );
    } catch (error) {
      console.error("Kurslar getirilirken hata:", error);
      throw new Error("Kurslar yüklenirken bir hata oluştu");
    }
  }

  // Belirli bir kursu getir (sessions dahil)
  async getCourseById(id: string): Promise<CourseWithSessions> {
    try {
      const response = await axiosClient.get<CourseResponse>(`/courses/${id}`);
      const course = response.data;

      const mappedCourse: MappedCourse = {
        id: course.id.toString(),
        title: course.title,
        courseNo: course.course_no,
        teacherId: course.teacher_id.toString(),
        totalLessons: course.total_sessions,
        status: course.status,
        createdAt: new Date(course.createdAt),
        teacherName: course.Teacher.User.name,
        teacherEmail: course.Teacher.User.email,
      };

      const mappedSessions: MappedSession[] = course.Sessions.map(
        (session) => ({
          id: session.id.toString(),
          courseId: session.course_id.toString(),
          lessonNumber: session.session_number,
          date: session.date,
          topic: session.topic,
          notes: session.notes,
          status: session.status,
          isCompleted: session.status === "completed",
        })
      );

      return {
        ...mappedCourse,
        sessions: mappedSessions,
      };
    } catch (error) {
      console.error("Kurs getirilirken hata:", error);
      throw new Error("Kurs yüklenirken bir hata oluştu");
    }
  }

  // Yeni kurs ekle
  async createCourse(
    courseData: CreateCourseRequest
  ): Promise<CreateCourseResponse> {
    try {
      const response = await axiosClient.post<CreateCourseResponse>(
        "/admin/courses",
        courseData
      );
      return response.data;
    } catch (error: any) {
      console.error("Kurs eklenirken hata:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Kurs eklenirken bir hata oluştu");
    }
  }

  async updateCourse(
    courseId: string,
    payload: Partial<{
      title: string;
      course_no: string;
      teacher_id: number;
      total_sessions: number;
      status: "active" | "completed" | "cancelled";
    }>
  ): Promise<{ message?: string }> {
    try {
      const response = await axiosClient.patch(
        `/admin/courses/${courseId}`,
        payload
      );
      return response.data;
    } catch (error: any) {
      console.error("Kurs güncellenirken hata:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Kurs güncellenirken bir hata oluştu");
    }
  }

  async deleteCourse(courseId: string): Promise<{ message?: string }> {
    try {
      const response = await axiosClient.delete(`/admin/courses/${courseId}`);
      return response.data;
    } catch (error: any) {
      console.error("Kurs silinirken hata:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Kurs silinirken bir hata oluştu");
    }
  }

  // Öğretmene ait kursları getir
  async getCoursesByTeacher(teacherId: string): Promise<MappedCourse[]> {
    try {
      const allCourses = await this.getAllCourses();
      return allCourses.filter((course) => course.teacherId === teacherId);
    } catch (error) {
      console.error("Öğretmen kursları getirilirken hata:", error);
      throw new Error("Öğretmen kursları yüklenirken bir hata oluştu");
    }
  }

  // Kurs durumuna göre filtrele
  async getCoursesByStatus(
    status: "active" | "completed" | "cancelled"
  ): Promise<MappedCourse[]> {
    try {
      const allCourses = await this.getAllCourses();
      return allCourses.filter((course) => course.status === status);
    } catch (error) {
      console.error("Durum bazlı kurslar getirilirken hata:", error);
      throw new Error("Kurslar filtrelenirken bir hata oluştu");
    }
  }

  // Kurs için session'ları getir
  async getSessionsForCourse(courseId: string): Promise<MappedSession[]> {
    try {
      const course = await this.getCourseById(courseId);
      return course.sessions;
    } catch (error) {
      console.error("Kurs session'ları getirilirken hata:", error);
      throw new Error("Kurs session'ları yüklenirken bir hata oluştu");
    }
  }

  // Kurs istatistiklerini hesapla
  async getCourseStats(courseId: string): Promise<{
    totalLessons: number;
    completedLessons: number;
    studentCount: number;
    paidStudents: number;
  }> {
    try {
      const course = await this.getCourseById(courseId);
      const completedLessons = course.sessions.filter(
        (s) => s.isCompleted
      ).length;

      // TODO: Student count ve payment bilgileri için ayrı endpoint'ler gerekli
      return {
        totalLessons: course.totalLessons,
        completedLessons,
        studentCount: 0, // API'de student count yok
        paidStudents: 0, // API'de payment bilgisi yok
      };
    } catch (error) {
      console.error("Kurs istatistikleri hesaplanırken hata:", error);
      throw new Error("Kurs istatistikleri hesaplanırken bir hata oluştu");
    }
  }

  async enrollStudent(
    courseId: string,
    studentId: number
  ): Promise<{ message: string }> {
    try {
      const response = await axiosClient.post(`/courses/${courseId}/enroll`, {
        studentId,
      });
      return response.data;
    } catch (error: any) {
      console.error("Öğrenci kursa kaydedilirken hata:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Öğrenci kursa kaydedilirken bir hata oluştu");
    }
  }
}

export const courseService = new CourseService();
export default courseService;
