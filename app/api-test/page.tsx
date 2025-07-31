"use client";

import { useState } from "react";
import axiosClient from "@/lib/axiosClient";
import authService from "@/lib/auth";
import { decodeToken } from "@/lib/jwt";

export default function ApiTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const testLogin = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axiosClient.post("/auth/login", {
        email: "admin@example.com",
        password: "123456",
      });

      setResult({
        rawResponse: response.data,
        decodedToken: decodeToken(response.data.accessToken),
        tokenExpired: decodeToken(response.data.accessToken)
          ? new Date(
              decodeToken(response.data.accessToken).exp * 1000
            ).toLocaleString()
          : "N/A",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const testProtectedEndpoint = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axiosClient.get("/api/admin/provider/all");
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const testAuthService = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await authService.login({
        email: "admin@example.com",
        password: "123456",
      });
      setResult(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testTeacherLogin = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axiosClient.post("/auth/login", {
        email: "teacher@example.com",
        password: "123456",
      });

      setResult({
        rawResponse: response.data,
        decodedToken: decodeToken(response.data.accessToken),
        tokenExpired: decodeToken(response.data.accessToken)
          ? new Date(
              decodeToken(response.data.accessToken).exp * 1000
            ).toLocaleString()
          : "N/A",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          API Test Sayfası
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">1. Admin Login</h2>
            <button
              onClick={testLogin}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Testing..." : "Test Admin Login"}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">2. Teacher Login</h2>
            <button
              onClick={testTeacherLogin}
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? "Testing..." : "Test Teacher Login"}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              3. Protected Endpoint
            </h2>
            <button
              onClick={testProtectedEndpoint}
              disabled={loading}
              className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? "Testing..." : "Test Protected API"}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">4. Auth Service</h2>
            <button
              onClick={testAuthService}
              disabled={loading}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Testing..." : "Test Auth Service"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Hata:</strong> {error}
          </div>
        )}

        {result && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Sonuç:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Mevcut Durum:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Authentication:</h3>
              <p>
                Is Authenticated: {authService.isAuthenticated() ? "Yes" : "No"}
              </p>
              <p>Is Admin: {authService.isAdmin() ? "Yes" : "No"}</p>
              <p>Is Teacher: {authService.isTeacher() ? "Yes" : "No"}</p>
            </div>
            <div>
              <h3 className="font-semibold">Current User:</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm">
                {JSON.stringify(authService.getCurrentUser(), null, 2)}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Token Bilgileri:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Current Token:</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs break-all">
                {authService.getToken() || "No token"}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold">Decoded Token:</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm">
                {JSON.stringify(
                  decodeToken(authService.getToken() || ""),
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
