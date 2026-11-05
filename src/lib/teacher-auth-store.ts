// src/lib/teacher-auth-store.ts
// Store autentikasi dan profil guru terhubung langsung ke Supabase Auth & PostgreSQL
// Sesuai spesifikasi PRD & features/07-akun-guru.md

import { createClient } from "./supabase/client";

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  schoolName: string;
  subject: string;
  nip?: string;
  bio?: string;
  createdAt: string;
  avatarUrl?: string;
}

// Data profil guru terdaftar di Supabase
export const DEFAULT_MOCK_TEACHER: TeacherProfile | null = null;

const STORAGE_KEY_SESSION = "sitindak_current_teacher_session";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Mengambil sesi guru dari cache lokal (sinkron, aman untuk SSR / inisialisasi cepat)
 */
export function getCurrentTeacherSession(): TeacherProfile | null {
  if (!isBrowser()) return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return null;
    return JSON.parse(raw) as TeacherProfile;
  } catch (e) {
    console.error("Gagal membaca sesi guru aktif:", e);
    return null;
  }
}

/**
 * Menyimpan sesi guru aktif ke cache lokal dan memicu event lintas-komponen
 */
export function setTeacherSession(teacher: TeacherProfile | null): void {
  if (!isBrowser()) return;

  if (teacher) {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(teacher));
  } else {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  }
  window.dispatchEvent(new Event("sitindak_auth_change"));
}

export interface AuthResponse {
  success: boolean;
  message: string;
  teacher?: TeacherProfile;
}

/**
 * Helper menerjemahkan pesan error Supabase Auth ke Bahasa Indonesia yang ramah pengguna
 */
function translateAuthError(errMessage: string): string {
  const lower = errMessage.toLowerCase();
  if (lower.includes("invalid login credentials") || lower.includes("invalid_grant")) {
    return "Email atau kata sandi salah. Silakan periksa kembali atau gunakan Lupa Kata Sandi.";
  }
  if (lower.includes("user already registered") || lower.includes("already exists")) {
    return "Email ini sudah terdaftar. Silakan gunakan email lain atau langsung Masuk.";
  }
  if (lower.includes("password should be at least")) {
    return "Kata sandi minimal harus 6 karakter.";
  }
  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "Terlalu banyak percobaan. Harap tunggu beberapa saat sebelum mencoba kembali.";
  }
  return errMessage || "Terjadi kesalahan pada sistem autentikasi.";
}

/**
 * Sinkronisasi sesi aktif saat ini dari Supabase Auth dan tabel profiles
 * Memverifikasi langsung ke server Supabase apakah akun masih terdaftar
 */
export async function syncTeacherSessionFromSupabase(): Promise<TeacherProfile | null> {
  if (!isBrowser()) return null;

  const supabase = createClient();

  try {
    // 1. Verifikasi langsung ke server Supabase Auth (bukan hanya cache token lokal)
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      // Jika akun sudah dihapus di Supabase auth.users, batalkan sesi dan bersihkan cache
      await supabase.auth.signOut().catch(() => {});
      setTeacherSession(null);
      return null;
    }

    // 2. Ambil data profil dari tabel profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile) {
      // Jika profil sudah dihapus di tabel profiles Supabase, batalkan sesi dan bersihkan cache
      await supabase.auth.signOut().catch(() => {});
      setTeacherSession(null);
      return null;
    }

    const teacherData: TeacherProfile = {
      id: user.id,
      name: profile.full_name || (user.user_metadata?.full_name as string) || "Guru",
      email: user.email || profile.email || "",
      schoolName: profile.school_name || (user.user_metadata?.school_name as string) || "",
      subject: profile.subject || "Matematika",
      nip: profile.nip || "",
      bio: profile.bio || "",
      createdAt: profile.created_at || user.created_at || new Date().toISOString(),
      avatarUrl: "",
    };

    setTeacherSession(teacherData);
    return teacherData;
  } catch (err) {
    console.warn("Gagal sinkronisasi sesi dari Supabase:", err);
    await supabase.auth.signOut().catch(() => {});
    setTeacherSession(null);
    return null;
  }
}

/**
 * Sub-fitur Masuk: Memvalidasi kredensial email & password via Supabase Auth
 */
export async function loginTeacher(email: string, password: string): Promise<AuthResponse> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanEmail || !cleanPassword) {
    return {
      success: false,
      message: "Harap masukkan email dan kata sandi.",
    };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword,
    });

    if (error || !data.user) {
      return {
        success: false,
        message: translateAuthError(error?.message || "Gagal masuk."),
      };
    }

    // Ambil profil lengkap dari tabel profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    const teacher: TeacherProfile = {
      id: data.user.id,
      name: profile?.full_name || (data.user.user_metadata?.full_name as string) || cleanEmail.split("@")[0],
      email: data.user.email || cleanEmail,
      schoolName: profile?.school_name || "",
      subject: profile?.subject || "Matematika",
      nip: profile?.nip || "",
      bio: profile?.bio || "",
      createdAt: profile?.created_at || data.user.created_at || new Date().toISOString(),
      avatarUrl: "",
    };

    setTeacherSession(teacher);

    return {
      success: true,
      message: `Selamat datang kembali, ${teacher.name}!`,
      teacher,
    };
  } catch (err: unknown) {
    console.error("Kesalahan proses masuk guru:", err);
    const msg = err instanceof Error ? err.message : "Terjadi gangguan koneksi ke server.";
    return {
      success: false,
      message: msg,
    };
  }
}

/**
 * Sub-fitur Daftar: Registrasi guru baru via Supabase Auth
 * Sesuai PRD: Form pendaftaran hanya meminta nama, email, dan kata sandi.
 */
export async function registerTeacher(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanName || !cleanEmail || !cleanPassword) {
    return {
      success: false,
      message: "Nama lengkap, email, dan kata sandi wajib diisi.",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return {
      success: false,
      message: "Format email tidak valid. Masukkan email resmi atau sekolah.",
    };
  }

  if (cleanPassword.length < 6) {
    return {
      success: false,
      message: "Kata sandi minimal harus 6 karakter.",
    };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: cleanPassword,
      options: {
        data: {
          full_name: cleanName,
          school_name: "",
        },
      },
    });

    if (error || !data.user) {
      return {
        success: false,
        message: translateAuthError(error?.message || "Gagal melakukan pendaftaran akun."),
      };
    }

    const teacher: TeacherProfile = {
      id: data.user.id,
      name: cleanName,
      email: cleanEmail,
      schoolName: "",
      subject: "Matematika",
      nip: "",
      bio: "",
      createdAt: data.user.created_at || new Date().toISOString(),
      avatarUrl: "",
    };

    setTeacherSession(teacher);

    return {
      success: true,
      message: `Pendaftaran berhasil! Selamat datang di SITINDAK, ${teacher.name}.`,
      teacher,
    };
  } catch (err: unknown) {
    console.error("Kesalahan proses registrasi guru:", err);
    const msg = err instanceof Error ? err.message : "Gagal menghubungkan ke server autentikasi.";
    return {
      success: false,
      message: msg,
    };
  }
}

/**
 * Sub-fitur Keluar: Mengakhiri sesi guru aktif di Supabase Auth
 */
export async function logoutTeacher(): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch (e) {
    console.error("Gagal keluar dari Supabase:", e);
  } finally {
    setTeacherSession(null);
  }
}

/**
 * Sub-fitur Atur Profil: Memperbarui nama, sekolah, dan profil di Supabase
 */
export async function updateTeacherProfile(
  updatedFields: Partial<Omit<TeacherProfile, "id" | "email">>
): Promise<AuthResponse> {
  const current = getCurrentTeacherSession();
  if (!current) {
    return {
      success: false,
      message: "Sesi guru tidak aktif atau telah kedaluwarsa. Silakan masuk kembali.",
    };
  }

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const userId = user?.id || current.id;

    const payload: {
      full_name?: string;
      school_name?: string;
      subject?: string;
      nip?: string;
      bio?: string;
      updated_at: string;
    } = {
      updated_at: new Date().toISOString(),
    };

    if (updatedFields.name !== undefined) payload.full_name = updatedFields.name;
    if (updatedFields.schoolName !== undefined) payload.school_name = updatedFields.schoolName;
    if (updatedFields.subject !== undefined) payload.subject = updatedFields.subject;
    if (updatedFields.nip !== undefined) payload.nip = updatedFields.nip;
    if (updatedFields.bio !== undefined) payload.bio = updatedFields.bio;

    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", userId);

    if (error) {
      console.error("Gagal update profil di database:", error);
      return {
        success: false,
        message: "Gagal menyimpan perubahan ke database: " + error.message,
      };
    }

    const updated: TeacherProfile = {
      ...current,
      ...updatedFields,
    };

    setTeacherSession(updated);

    return {
      success: true,
      message: "Profil dan data sekolah berhasil diperbarui!",
      teacher: updated,
    };
  } catch (err: unknown) {
    console.error("Kesalahan update profil:", err);
    return {
      success: false,
      message: "Terjadi kesalahan saat menyimpan profil.",
    };
  }
}

/**
 * Sub-fitur Lupa Kata Sandi: Mengirim email reset kata sandi via Supabase Auth
 */
export async function requestPasswordReset(email: string): Promise<AuthResponse> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return {
      success: false,
      message: "Masukkan alamat email akun guru Anda.",
    };
  }

  try {
    const supabase = createClient();
    const redirectTo = isBrowser()
      ? `${window.location.origin}/guru/lupa-sandi?step=2`
      : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo,
    });

    if (error) {
      return {
        success: false,
        message: translateAuthError(error.message),
      };
    }

    return {
      success: true,
      message: `Tautan pemulihan kata sandi telah dikirim ke ${cleanEmail}. Periksa kotak masuk atau spam email Anda.`,
    };
  } catch (err: unknown) {
    console.error("Kesalahan request reset password:", err);
    return {
      success: false,
      message: "Gagal memproses permintaan reset kata sandi.",
    };
  }
}

/**
 * Sub-fitur Reset Kata Sandi Baru: Memperbarui kata sandi pengguna yang sedang login/dalam sesi recovery
 */
export async function resetTeacherPassword(newPassword: string): Promise<AuthResponse> {
  const cleanPass = newPassword.trim();
  if (cleanPass.length < 6) {
    return {
      success: false,
      message: "Kata sandi baru minimal harus 6 karakter.",
    };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: cleanPass,
    });

    if (error) {
      return {
        success: false,
        message: translateAuthError(error.message),
      };
    }

    return {
      success: true,
      message: "Kata sandi Anda berhasil diperbarui! Silakan masuk kembali.",
    };
  } catch (err: unknown) {
    console.error("Kesalahan reset kata sandi baru:", err);
    return {
      success: false,
      message: "Gagal memperbarui kata sandi baru.",
    };
  }
}

/**
 * Cepat masuk sebagai akun guru demo terverifikasi
 */
export async function loginAsDemoTeacher(): Promise<AuthResponse> {
  return {
    success: false,
    message: "Akun demo telah dinonaktifkan.",
  };
}
