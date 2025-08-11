export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "teacher";
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: number;
  userId: number;
  user_id: number;
  createdAt: string;
  updatedAt: string;
  User: User;
}

export interface Course {
  id: number;
  title: string;
  course_no: string;
  teacher_id: number;
  total_sessions: number;
  status: "active" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  Teacher: Teacher;
  Sessions: Session[];
}

export interface Student {
  id: number;
  name: string;
  phone: string;
  email: string;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseStudent {
  courseId: number;
  studentId: number;
  hasPaid: boolean;
}

export interface Session {
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

export interface TeacherPayment {
  teacherId: number;
  courseId: number;
  isPaid: boolean;
}

export interface StudentPayment {
  studentId: number;
  courseId: number;
  amount: number;
  date: string;
  isPaid: boolean;
}

// Frontend'de kullanılan mapped types
export interface MappedCourse {
  id: string;
  title: string;
  courseNo: string;
  teacherId: string;
  totalLessons: number;
  status: "active" | "completed" | "cancelled";
  createdAt: Date;
  teacherName: string;
  teacherEmail: string;
}

export interface MappedSession {
  id: string;
  courseId: string;
  lessonNumber: number;
  date?: string;
  topic: string;
  notes: string;
  status: "completed" | "cancelled" | "planned";
  isCompleted: boolean;
}

export interface MappedUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher";
}
