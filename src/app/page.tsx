"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ThreeTierExplanation } from "@/components/ThreeTierExplanation";
import { StudentExperienceSection } from "@/components/StudentExperienceSection";
import { Footer } from "@/components/Footer";
import { TokenTesterModal } from "@/components/TokenTesterModal";
import { TeacherModal } from "@/components/TeacherModal";

export default function Home() {
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Navigation Header */}
      <Navbar
        onOpenTokenModal={() => setTokenModalOpen(true)}
        onOpenTeacherModal={() => setTeacherModalOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        onOpenTokenModal={() => setTokenModalOpen(true)}
        onOpenTeacherModal={() => setTeacherModalOpen(true)}
      />

      {/* 3-Tier Core Principles & Comparison */}
      <ThreeTierExplanation />

      {/* Mobile & Laptop Student Experience */}
      <StudentExperienceSection
        onOpenTokenModal={() => setTokenModalOpen(true)}
      />

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <TokenTesterModal
        isOpen={tokenModalOpen}
        onClose={() => setTokenModalOpen(false)}
      />

      <TeacherModal
        isOpen={teacherModalOpen}
        onClose={() => setTeacherModalOpen(false)}
      />
    </main>
  );
}
