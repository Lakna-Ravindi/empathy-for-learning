// src/hooks/useAuth.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { loginUser, registerUser, getCurrentUser, logoutUser } from "../api/authApi";

export function useAuth() {
  const navigate = useNavigate();
  const { setAuth, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login 
  const login = async ({ username, password, role }) => {
    setLoading(true);
    setError(null);
    try {
      // 1. POST JSON to /api/auth/login → { access_token, refresh_token, token_type }
      const { access_token, refresh_token } = await loginUser({ username, password });

      // 2. Store tokens so interceptor can attach them immediately
      localStorage.setItem("token", access_token);
      localStorage.setItem("refresh_token", refresh_token); // store for later refresh

      // 3. GET /api/auth/me → { username, role }
      const user = await getCurrentUser();

      // 4. Save to Zustand + localStorage
      setAuth(access_token, user, user.role || role);

      // 5. Role-based redirect
      navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard");

    } catch (err) {
      // FastAPI returns error in err.response.data.detail
      const msg =
        err.response?.data?.detail ||
        "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Register 
  const register = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      // Backend returns { message: "...", status: "success" }
      await registerUser(formData);

      // Redirect to login with success banner
      navigate("/login", {
        state: { message: "Account created! Please sign in." },
      });

    } catch (err) {
      const detail = err.response?.data?.detail;

      // FastAPI 422 validation errors come as an array
      if (Array.isArray(detail)) {
        const first = detail[0];
        const field = first.loc?.[first.loc.length - 1] ?? "field";
        setError(`${field}: ${first.msg}`);
      } else {
        setError(detail || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const logout = async () => {
    await authApi.logout();  // notify backend 
    localStorage.removeItem("refresh_token");
    clearAuth();             // wipe Zustand + localStorage
    navigate("/login");
  };

  return { login, register, logout, loading, error, setError }; 
}