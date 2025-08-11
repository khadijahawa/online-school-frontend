import axiosClient from "../axiosClient";
import { MappedSession } from "../types";

export interface SessionResponse {
  id: number;
  session_number: number;
  date: string;
  topic: string;
  notes: string;
  status: "completed" | "cancelled" | "planned";
  createdAt: string;
  updatedAt: string;
  course_id: number;
}

class SessionService {
  // Kurs ID'sine göre session'ları getir
  async getSessionsByCourse(courseId: string): Promise<MappedSession[]> {
    try {
      // API'de doğrudan course/:id endpoint'i var, oradan sessions'ları alacağız
      // Bu endpoint'i courseService'de kullanacağız
      throw new Error("Bu metod courseService üzerinden kullanılmalı");
    } catch (error) {
      console.error("Session'lar getirilirken hata:", error);
      throw new Error("Session'lar yüklenirken bir hata oluştu");
    }
  }

  // Session'ı tamamlandı olarak işaretle
  async markSessionComplete(sessionId: string): Promise<void> {
    try {
      await axiosClient.patch(`/sessions/${sessionId}`, {
        status: "completed",
      });
    } catch (error) {
      console.error("Session tamamlanırken hata:", error);
      throw new Error("Session tamamlanırken bir hata oluştu");
    }
  }

  // Session'ı iptal et
  async cancelSession(sessionId: string): Promise<void> {
    try {
      await axiosClient.patch(`/sessions/${sessionId}`, {
        status: "cancelled",
      });
    } catch (error) {
      console.error("Session iptal edilirken hata:", error);
      throw new Error("Session iptal edilirken bir hata oluştu");
    }
  }

  // Yeni session ekle
  async createSession(sessionData: {
    course_id: number;
    session_number: number;
    date: string;
    topic: string;
    notes: string;
  }): Promise<MappedSession> {
    try {
      const response = await axiosClient.post<SessionResponse>(
        "/sessions",
        sessionData
      );
      const session = response.data;

      return {
        id: session.id.toString(),
        courseId: session.course_id.toString(),
        lessonNumber: session.session_number,
        date: session.date,
        topic: session.topic,
        notes: session.notes,
        status: session.status,
        isCompleted: session.status === "completed",
      };
    } catch (error) {
      console.error("Session eklenirken hata:", error);
      throw new Error("Session eklenirken bir hata oluştu");
    }
  }

  // Session'ı güncelle
  async updateSession(
    sessionId: string,
    sessionData: Partial<{
      date: string;
      topic: string;
      notes: string;
      status: "completed" | "cancelled" | "planned";
    }>
  ): Promise<MappedSession> {
    try {
      const response = await axiosClient.patch<SessionResponse>(
        `/sessions/${sessionId}`,
        sessionData
      );
      const session = response.data;

      return {
        id: session.id.toString(),
        courseId: session.course_id.toString(),
        lessonNumber: session.session_number,
        date: session.date,
        topic: session.topic,
        notes: session.notes,
        status: session.status,
        isCompleted: session.status === "completed",
      };
    } catch (error) {
      console.error("Session güncellenirken hata:", error);
      throw new Error("Session güncellenirken bir hata oluştu");
    }
  }
}

export const sessionService = new SessionService();
export default sessionService;
