// src/lib/useTeacherAuth.ts
// React Hook untuk state autentikasi guru terhubung ke Supabase Auth
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TeacherProfile,
  getCurrentTeacherSession,
  loginTeacher,
  registerTeacher,
  logoutTeacher,
  updateTeacherProfile,
  requestPasswordReset,
  resetTeacherPassword,
  loginAsDemoTeacher,
  syncTeacherSessionFromSupabase,
  AuthResponse,
} from "./teacher-auth-store";
import { createClient } from "./supabase/client";

export function useTeacherAuth() {
  const [teacher, setTeacher] = useState<TeacherProfile | null>(() => getCurrentTeacherSession());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync state dari cache & Supabase
  const syncSession = useCallback(async () => {
    // 1. Ambil dari cache lokal terlebih dahulu untuk kecepatan render UI
    const cached = getCurrentTeacherSession();
    if (cached) {
      setTeacher(cached);
    }

    // 2. Sinkronkan dengan Supabase Auth session
    const current = await syncTeacherSessionFromSupabase();
    setTeacher(current);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    syncSession();

    // Listener Supabase Auth state change
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setTeacher(null);
        setIsLoading(false);
      } else {
        syncSession();
      }
    });

    // Listener cross-tab / local event
    const handleStorageChange = () => {
      const current = getCurrentTeacherSession();
      setTeacher(current);
    };

    window.addEventListener("sitindak_auth_change", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("sitindak_auth_change", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [syncSession]);

  const handleLogin = async (email: string, pass: string): Promise<AuthResponse> => {
    setIsLoading(true);
    const res = await loginTeacher(email, pass);
    if (res.success && res.teacher) {
      setTeacher(res.teacher);
    }
    setIsLoading(false);
    return res;
  };

  const handleRegister = async (name: string, email: string, pass: string): Promise<AuthResponse> => {
    setIsLoading(true);
    const res = await registerTeacher(name, email, pass);
    if (res.success && res.teacher) {
      setTeacher(res.teacher);
    }
    setIsLoading(false);
    return res;
  };

  const handleLogout = async (): Promise<void> => {
    await logoutTeacher();
    setTeacher(null);
  };

  const handleUpdateProfile = async (
    fields: Partial<Omit<TeacherProfile, "id" | "email">>
  ): Promise<AuthResponse> => {
    const res = await updateTeacherProfile(fields);
    if (res.success && res.teacher) {
      setTeacher(res.teacher);
    }
    return res;
  };

  const handleLoginDemo = async (): Promise<AuthResponse> => {
    setIsLoading(true);
    const res = await loginAsDemoTeacher();
    if (res.success && res.teacher) {
      setTeacher(res.teacher);
    }
    setIsLoading(false);
    return res;
  };

  return {
    teacher,
    isLoggedIn: !!teacher,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    requestPasswordReset,
    resetPassword: resetTeacherPassword,
    loginAsDemo: handleLoginDemo,
    refreshSession: syncSession,
  };
}
