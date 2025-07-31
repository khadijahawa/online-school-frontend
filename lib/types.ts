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
  totalLessons: number; // Changed from totalSessions to totalLessons
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

export interface Lesson {
  id: string;
  courseId: string;
  lessonNumber: number;
  date?: string;
  topic: string;
  notes: string;
  attendance: string[]; // Student IDs who attended
  isCompleted: boolean; // Whether the lesson is completed or not
  status: "completed" | "cancelled" | "planned";
}

export interface TeacherPayment {
  teacherId: string;
  courseId: string;
  isPaid: boolean;
}

export interface StudentPayment {
  studentId: string;
  courseId: string;
  amount: number;
  date: Date;
  isPaid: boolean;
}
