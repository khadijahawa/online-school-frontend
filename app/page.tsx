import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎓 Okul Yönetim Platformu
          </h1>
          <p className="text-gray-600">Giriş yapmak istediğiniz paneli seçin</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/admin/login"
            className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl text-center font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            👨‍💼 Admin Paneli
            <p className="text-sm opacity-90 mt-1">Okul yöneticileri için</p>
          </Link>

          <Link
            href="/teacher/login"
            className="block w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl text-center font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            👩‍🏫 Öğretmen Paneli
            <p className="text-sm opacity-90 mt-1">Öğretmenler için</p>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">© 2024 Okul Yönetim Platformu</p>
        </div>
      </div>
    </div>
  );
}
