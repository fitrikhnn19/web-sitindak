"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, KeyRound, Sparkles, Menu, X, ArrowRight, User, ShieldCheck, LogOut } from "lucide-react";
import { useTeacherAuth } from "@/lib/useTeacherAuth";

interface NavbarProps {
  onOpenTokenModal: () => void;
  onOpenTeacherModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTokenModal,
  onOpenTeacherModal,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { teacher, isLoggedIn } = useTeacherAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Beranda", href: "#beranda" },
    { label: "Metode 3-Tingkat", href: "#fitur" },
    { label: "Keunggulan", href: "#keunggulan" },
    { label: "Alur Siswa", href: "#alur-siswa" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs py-3"
          : "bg-white/80 backdrop-blur-md border-b border-slate-100 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Compass className="w-5 h-5 text-white transform group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  SITINDAK
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  Three-Tier
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium leading-none mt-0.5">
                Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs xl:text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link
              href="/asesmen"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-600" />
              <span>Kerjakan Asesmen</span>
            </Link>

            {isLoggedIn && teacher ? (
              <Link
                href="/guru"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
              >
                <div className="w-5 h-5 rounded-full bg-blue-800 text-white text-[10px] flex items-center justify-center font-bold">
                  {teacher.name.substring(0, 1)}
                </div>
                <span className="max-w-[110px] truncate">{teacher.name.split(" ")[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button
                onClick={onOpenTeacherModal}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
              >
                <span>Portal Guru</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Buka Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-4 border-t border-slate-200 bg-white rounded-2xl px-4 shadow-lg animate-in fade-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-2 py-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs sm:text-sm font-medium text-slate-700 hover:text-blue-600 py-1.5 px-2 rounded-md hover:bg-slate-50 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2 mt-2">
              <Link
                href="/asesmen"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200"
              >
                <KeyRound className="w-4 h-4 text-slate-600" />
                <span>Masuk dengan Token Siswa</span>
              </Link>
              
              <Link
                href="/guru"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700"
              >
                <span>Portal Masuk Guru</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
