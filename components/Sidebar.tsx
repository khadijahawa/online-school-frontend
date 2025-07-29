"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface MenuItem {
  icon: string;
  label: string;
  href: string;
}

interface SidebarProps {
  title: string;
  menuItems: MenuItem[];
  userEmail: string;
}

export default function Sidebar({ title, menuItems, userEmail }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-600 mt-1">{userEmail}</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-gray-700">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
        >
          <span className="text-xl">🚪</span>
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
}
