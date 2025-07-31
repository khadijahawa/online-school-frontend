import axiosClient from "./axiosClient";
import Cookies from "js-cookie";
import { decodeToken } from "./jwt";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      role: "admin" | "teacher";
      name: string;
    };
  };
  message?: string;
}

export interface User {
  id: string;
  email: string;
  role: "admin" | "teacher";
  name: string;
}

class AuthService {
  // Login işlemi
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosClient.post("/auth/login", credentials);

      // Backend sadece accessToken döndürüyor, user bilgilerini token'dan çıkaralım
      const { accessToken } = response.data;

      if (accessToken) {
        // Token'dan user bilgilerini decode edelim
        const decodedToken = decodeToken(accessToken);

        if (decodedToken) {
          const user = {
            id: decodedToken.id.toString(),
            email: credentials.email, // Email'i credentials'dan alalım
            role: decodedToken.role as "admin" | "teacher",
            name: credentials.email.split("@")[0], // Geçici olarak email'den name oluşturalım
          };

          // Token'ı cookie'ye kaydet (7 gün)
          Cookies.set("accessToken", accessToken, { expires: 7 });
          Cookies.set("user", JSON.stringify(user), { expires: 7 });

          return {
            success: true,
            data: {
              accessToken,
              user,
            },
          };
        }
      }

      throw new Error("Token decode edilemedi");
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Giriş yapılırken bir hata oluştu"
      );
    }
  }

  // Logout işlemi
  logout(): void {
    Cookies.remove("accessToken");
    Cookies.remove("user");

    // Ana sayfaya yönlendir
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }

  // Mevcut kullanıcıyı al
  getCurrentUser(): User | null {
    try {
      const userStr = Cookies.get("user");
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Token'ı al
  getToken(): string | null {
    return Cookies.get("accessToken") || null;
  }

  // Kullanıcının giriş yapmış olup olmadığını kontrol et
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Token'ın geçerli olup olmadığını kontrol et
    const user = this.getCurrentUser();
    return !!user;
  }

  // Kullanıcının rolünü kontrol et
  hasRole(role: "admin" | "teacher"): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Admin mi kontrol et
  isAdmin(): boolean {
    return this.hasRole("admin");
  }

  // Öğretmen mi kontrol et
  isTeacher(): boolean {
    return this.hasRole("teacher");
  }

  // Token'ı yenile
  async refreshToken(): Promise<boolean> {
    try {
      const currentToken = this.getToken();
      if (!currentToken) return false;

      const response = await axiosClient.post("/auth/refresh-token", {
        refreshToken: currentToken,
      });

      if (response.data.success) {
        const { accessToken } = response.data.data;
        Cookies.set("accessToken", accessToken, { expires: 7 });
        return true;
      }

      return false;
    } catch (error) {
      this.logout();
      return false;
    }
  }
}

export const authService = new AuthService();
export default authService;
