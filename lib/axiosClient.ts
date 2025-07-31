import Cookies from "js-cookie";
import axios from "axios";
import { isTokenExpired } from "./jwt";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://online-school-backend-gumy.onrender.com";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  // Removed default headers to handle them dynamically in the interceptor
});

axiosClient.interceptors.request.use(
  async (config) => {
    const token = Cookies.get("accessToken");

    // Initialize headers if they don't exist
    config.headers = config.headers || {};

    // Special handling for FormData
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else if (typeof config.data === "object") {
      config.headers["Content-Type"] = "application/json";
    }

    // Always set these headers
    config.headers["Accept"] = "application/json";
    if (token && !isTokenExpired(token)) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // console.log("Request config:", {
    //   url: config.url,
    //   method: config.method,
    //   headers: config.headers,
    //   dataType:
    //     config.data instanceof FormData ? "FormData" : typeof config.data
    // });

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    // console.log("Response received:", {
    //   status: response.status,
    //   url: response.config.url
    // });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // console.error("Response error:", {
    //   message: error.message,
    //   status: error.response?.status,
    //   url: originalRequest?.url
    // });

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const currentToken = Cookies.get("accessToken");
        if (!currentToken) throw new Error("No access token available");

        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken: currentToken }
        );

        if (refreshResponse.data.success) {
          const { accessToken: newAccessToken } = refreshResponse.data.data;
          Cookies.set("accessToken", newAccessToken, { expires: 7 });

          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        Cookies.remove("accessToken");
        Cookies.remove("user");
        // You might want to redirect to login here
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
