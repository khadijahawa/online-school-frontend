export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher";
}

export interface Teacher {
  userId: string;
  assignedCourses: string[];
}

export interface Course {
  id: string;
  title: string;
  courseNo: string;
  teacherId: string;
  totalSessions: number;
  status: "active" | "completed" | "cancelled";
  createdAt: Date;
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  email: string;
  isNew: boolean;
}

export interface CourseStudent {
  courseId: string;
  studentId: string;
  hasPaid: boolean;
}

export interface Session {
  id: string;
  courseId: string;
  sessionNumber: number;
  date?: string;
  topic: string;
  notes: string;
  attendance: string[];
  status: "completed" | "cancelled" | "planned";
}

export interface TeacherPayment {
  teacherId: string;
  courseId: string;
  isPaid: boolean;
}
