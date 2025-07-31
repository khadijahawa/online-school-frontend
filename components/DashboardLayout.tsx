"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import authService from "@/lib/auth";

interface MenuItem {
  icon: string;
  label: string;
  href: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  menuItems: MenuItem[];
  requiredRole: "admin" | "teacher";
}

export default function DashboardLayout({
  children,
  title,
  menuItems,
  requiredRole,
}: DashboardLayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Geçici olarak authentication kontrolünü devre dışı bırakıyoruz
    const currentUser = authService.getCurrentUser();
    
    if (currentUser) {
      setUser(currentUser);
    } else {
      // Test için mock user oluşturuyoruz
      setUser({
        id: "1",
        email: requiredRole === "admin" ? "admin@example.com" : "teacher@example.com",
        role: requiredRole,
        name: requiredRole === "admin" ? "Admin" : "Teacher"
      });
    }
    
    setLoading(false);
  }, [router, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar title={title} menuItems={menuItems} userEmail={user.email} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
