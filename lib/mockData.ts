import {
  User,
  Course,
  Student,
  Session,
  CourseStudent,
  TeacherPayment,
} from "./types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@school.com",
    role: "admin",
  },
  {
    id: "2",
    name: "Ayşe Öğretmen",
    email: "teacher@school.com",
    role: "teacher",
  },
  {
    id: "3",
    name: "Mehmet Öğretmen",
    email: "mehmet@school.com",
    role: "teacher",
  },
];

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Matematik Temelleri",
    courseNo: "CR001",
    teacherId: "2",
    totalSessions: 8,
    status: "active",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "İngilizce Konuşma",
    courseNo: "CR002",
    teacherId: "3",
    totalSessions: 10,
    status: "active",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    title: "Fizik Laboratuvarı",
    courseNo: "CR003",
    teacherId: "2",
    totalSessions: 6,
    status: "completed",
    createdAt: new Date("2024-01-10"),
  },
];

export const mockStudents: Student[] = [
  {
    id: "1",
    name: "Ali Veli",
    phone: "+90 555 123 4567",
    email: "ali@email.com",
    isNew: true,
  },
  {
    id: "2",
    name: "Fatma Yılmaz",
    phone: "+90 555 234 5678",
    email: "fatma@email.com",
    isNew: false,
  },
  {
    id: "3",
    name: "Can Demir",
    phone: "+90 555 345 6789",
    email: "can@email.com",
    isNew: true,
  },
  {
    id: "4",
    name: "Zeynep Kaya",
    phone: "+90 555 456 7890",
    email: "zeynep@email.com",
    isNew: false,
  },
];

export const mockCourseStudents: CourseStudent[] = [
  { courseId: "1", studentId: "1", hasPaid: true },
  { courseId: "1", studentId: "2", hasPaid: false },
  { courseId: "2", studentId: "2", hasPaid: true },
  { courseId: "2", studentId: "3", hasPaid: true },
  { courseId: "3", studentId: "1", hasPaid: true },
  { courseId: "3", studentId: "4", hasPaid: false },
];

export const mockSessions: Session[] = [
  {
    id: "1",
    courseId: "1",
    sessionNumber: 1,
    date: "2024-01-20",
    topic: "Doğal Sayılar",
    notes: "Öğrenciler konuyu iyi anladı",
    attendance: ["1", "2"],
    status: "completed",
  },
  {
    id: "2",
    courseId: "1",
    sessionNumber: 2,
    date: "2024-01-27",
    topic: "Tam Sayılar",
    notes: "Ek çalışma gerekli",
    attendance: ["1"],
    status: "completed",
  },
  {
    id: "3",
    courseId: "1",
    sessionNumber: 3,
    topic: "Kesirler",
    notes: "",
    attendance: [],
    status: "planned",
  },
  {
    id: "4",
    courseId: "2",
    sessionNumber: 1,
    date: "2024-01-22",
    topic: "Basic Greetings",
    notes: "Great participation",
    attendance: ["2", "3"],
    status: "completed",
  },
];

export const mockTeacherPayments: TeacherPayment[] = [
  { teacherId: "2", courseId: "3", isPaid: true },
  { teacherId: "2", courseId: "1", isPaid: false },
  { teacherId: "3", courseId: "2", isPaid: false },
];
