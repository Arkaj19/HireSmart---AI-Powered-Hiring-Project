import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser as apiGetMe, login as apiLogin, register as apiRegister, logout as apiLogout } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // while auto-checking
  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      const res = await apiGetMe();
      if (res?.success) setUser(res.user);
      else setUser(null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    // eslint-disable-next-line
  }, []);

  const login = async ({ email, employeeId, password }) => {
    setLoading(true);
    try {
      const res = await apiLogin({ email, employeeId, password });
      if (res?.success) {
        await fetchCurrentUser();
        navigate("/"); // go to dashboard/home after login
        return { success: true, message: res.message };
      }
      return { success: false, message: res?.detail || "Login failed" };
    } catch (err) {
      return { success: false, message: err?.message || "Login error" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await apiRegister(formData);
      return res;
    } catch (err) {
      return { success: false, message: err?.message || "Registration failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const res = await apiLogout();
      setUser(null);
      navigate("/login");
      return res;
    } catch (err) {
      return { success: false, message: err?.message || "Logout failed" };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, register, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
