"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Printer,
  Clock,
  Lock,
  ChevronRight,
  RefreshCw,
  PlusCircle,
  FileCheck,
} from "lucide-react";
import {
  ClassCheatingReport,
  StudentCheatingSummary,
  exportCheatingAuditToCsv,
  recordStudentCheatingEvent,
  getClassCheatingReport,
  fetchClassCheatingReportFromSupabase,
} from "@/lib/cheating-detection-store";
import { getAllAssessments, fetchAssessmentsFromSupabase } from "@/lib/assessment-management-store";
import { StudentCheatingDetailModal } from "./StudentCheatingDetailModal";

interface CheatingReportDashboardProps {
  initialToken?: string;
  onSelectToken?: (token: string) => void;
}

export const CheatingReportDashboard: React.FC<CheatingReportDashboardProps> = ({
  initialToken = "",
  onSelectToken,
}) => {
  const [selectedToken, setSelectedToken] = useState<string>(initialToken);
  const [report, setReport] = useState<ClassCheatingReport>(() =>
    getClassCheatingReport(initialToken)
  );

  const [assessmentOptions, setAssessmentOptions] = useState<
    Array<{ tokenCode: string; title: string; className: string }>
  >(() => {
    return getAllAssessments().map((a) => ({
      tokenCode: a.token.code,
      title: a.title,
      className: a.className,
    }));
  });

  React.useEffect(() => {
    fetchAssessmentsFromSupabase().then((items) => {
      if (items && items.length > 0) {
        setAssessmentOptions(
          items.map((a) => ({
            tokenCode: a.token.code,
            title: a.title,
            className: a.className,
          }))
        );
      }
    });
  }, []);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"semua" | "flagged" | "clean">("semua");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("semua");
  const [sortBy, setSortBy] = useState<"incidents_desc" | "name_asc" | "duration_desc">("incidents_desc");

  // Selected Student for Detail Modal
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<StudentCheatingSummary | null>(null);

  // Toast / feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dengan Supabase saat token berganti
  React.useEffect(() => {
    fetchClassCheatingReportFromSupabase(selectedToken).then((remoteReport) => {
      if (remoteReport) {
        setReport(remoteReport);
      }
    });
  }, [selectedToken]);

  const handleTokenChange = (token: string) => {
    setSelectedToken(token);
    setReport(getClassCheatingReport(token));
    fetchClassCheatingReportFromSupabase(token).then((remoteReport) => {
      if (remoteReport) setReport(remoteReport);
    });
    if (onSelectToken) onSelectToken(token);
  };

  const handleRefresh = () => {
    setReport(getClassCheatingReport(selectedToken));
    fetchClassCheatingReportFromSupabase(selectedToken).then((remoteReport) => {
      if (remoteReport) setReport(remoteReport);
    });
    showToast("Data laporan integritas berhasil diperbarui dari rekaman pengerjaan.");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Unduh CSV Bukti Audit
  const handleDownloadCsv = () => {
    const csvContent = exportCheatingAuditToCsv(report);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `SITINDAK_Laporan_Kecurangan_${report.tokenCode}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("File CSV Laporan Integritas berhasil diunduh.");
  };

  const handlePrint = () => {
    window.print();
  };

  // Simulasi penambahan kejadian mencurigakan untuk pengujian interaktif guru
  const handleSimulateCheating = () => {
    const targetStudent = report.students.find((s) => s.hasCheating) || report.students[1];
    if (!targetStudent) return;

    recordStudentCheatingEvent({
      studentId: targetStudent.studentId,
      studentName: targetStudent.studentName,
      className: report.className,
      tokenCode: report.tokenCode,
      eventType: "pindah_tab",
      eventLabel: "Pindah Tab Peramban",
      occurredAt: new Date().toISOString(),
      detail: `Siswa baru saja beralih tab peramban selama 8 detik saat mengerjakan lembar asesmen.`,
      questionNumber: 5,
      questionTitle: "Refleksi terhadap Sumbu Koordinat",
      durationSeconds: 8,
      severity: "sedang",
    });

    setReport(getClassCheatingReport(selectedToken));
    showToast(`Simulasi: Berhasil mencatat 1 kejadian pindah tab baru pada ${targetStudent.studentName}.`);
  };

  // Filtered Students List
  const filteredStudents = useMemo(() => {
    return report.students
      .filter((s) => {
        const matchSearch = s.studentName.toLowerCase().includes(searchQuery.toLowerCase());
        let matchStatus = true;
        if (statusFilter === "flagged") matchStatus = s.hasCheating;
        if (statusFilter === "clean") matchStatus = !s.hasCheating;

        let matchEventType = true;
        if (eventTypeFilter !== "semua") {
          matchEventType = s.events.some((e) => e.eventType === eventTypeFilter);
        }

        return matchSearch && matchStatus && matchEventType;
      })
      .sort((a, b) => {
        if (sortBy === "incidents_desc") {
          if (b.totalEvents !== a.totalEvents) return b.totalEvents - a.totalEvents;
          return a.studentName.localeCompare(b.studentName);
        }
        if (sortBy === "name_asc") {
          return a.studentName.localeCompare(b.studentName);
        }
        if (sortBy === "duration_desc") {
          return (b.durationMinutes || 0) - (a.durationMinutes || 0);
        }
        return 0;
      });
  }, [report.students, searchQuery, statusFilter, eventTypeFilter, sortBy]);

  const flaggedPercentage = Math.round(
    (report.flaggedStudentsCount / (report.totalStudents || 1)) * 100
  );
  const cleanPercentage = Math.round(
    (report.cleanStudentsCount / (report.totalStudents || 1)) * 100
  );

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200 shadow-sm print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Teacher Security & Authorization Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:border-none print:shadow-none print:p-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Laporan Integritas & Deteksi Kecurangan Ujian
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Otorisasi Terverifikasi
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Guru Pengampu: <strong className="text-slate-800">{report.teacherName}</strong> (NIP: {report.teacherNip}) • Akses Sah Kelas {report.className}
            </p>
          </div>
        </div>

        {/* Top Action Buttons: Class Selector, Refresh, Download, Print */}
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          {/* Class Selector */}
          <div className="relative">
            <select
              value={selectedToken}
              onChange={(e) => handleTokenChange(e.target.value)}
              className="text-xs font-semibold py-2 pl-3 pr-8 rounded-lg bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer max-w-[280px] truncate shadow-xs"
              title="Pilih Token Asesmen"
            >
              {!assessmentOptions.some((o) => o.tokenCode === selectedToken) && (
                <option value={selectedToken}>
                  {report.className} — {selectedToken} ({report.assessmentTitle})
                </option>
              )}
              {assessmentOptions.map((opt) => (
                <option key={opt.tokenCode} value={opt.tokenCode}>
                  {opt.className} — {opt.tokenCode} ({opt.title})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-300 transition-colors shadow-xs"
            title="Muat ulang rekaman integritas terbaru"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Cetak Berita Acara</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Unduh CSV Audit</span>
          </button>
        </div>
      </div>

      {/* Empty State Check */}
      {report.totalStudents === 0 && report.students.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xs">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Belum Ada Log Integritas & Kecurangan
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
            Pengawasan mode fokus ujian (perpindahan tab, jendela kehilangan fokus, upaya menyalin teks soal) akan tercatat dan ditampilkan secara real-time saat siswa mulai mengerjakan asesmen.
          </p>
          <div className="inline-flex items-center gap-3">
            <a
              href="/guru/asesmen"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            >
              <span>+ Buat Asesmen Baru</span>
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* 4 Primary Metric Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Siswa Berintegritas Penuh */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Integritas Penuh</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {report.cleanStudentsCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ {report.totalStudents} siswa ({cleanPercentage}%)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            0 catatan perpindahan tab atau keluar layar
          </p>
        </div>

        {/* Card 2: Siswa Terindikasi Pelanggaran */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-amber-300 shadow-sm">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Terindikasi Insiden</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-800">
              {report.flaggedStudentsCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">siswa ({flaggedPercentage}%)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Tercatat beralih tab atau kehilangan fokus
          </p>
        </div>

        {/* Card 3: Total Kejadian Mencurigakan */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Insiden</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
              <Clock className="w-4 h-4 text-slate-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {report.totalIncidents}
            </span>
            <span className="text-xs text-slate-500 font-medium">insiden</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Dicatat otomatis dengan cap waktu forensik
          </p>
        </div>

        {/* Card 4: Indeks Integritas Kelas */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Mutu Integritas</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {report.integrityRating}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-700">
              {report.averageIntegrityScore}%
            </span>
            <span className="text-xs text-slate-500 font-medium">rata-rata</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Tingkat kepatuhan pengerjaan asesmen
          </p>
        </div>

      </div>

      {/* Incident Type Breakdown Visual & Interactive Proctoring Simulator Bar */}
      <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 print:border-none">
        
        {/* Left: Incident Breakdown Bar */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Distribusi Jenis Kejadian Mencurigakan
            </span>
            <span className="text-slate-500 font-mono text-[11px] font-semibold">
              {report.totalIncidents} Total Insiden
            </span>
          </div>

          {/* Mini progress bar segments */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
            {report.incidentTypeBreakdown.pindah_tab > 0 && (
              <div
                style={{
                  width: `${(report.incidentTypeBreakdown.pindah_tab / (report.totalIncidents || 1)) * 100}%`,
                }}
                className="bg-amber-400 h-full"
                title={`Pindah Tab: ${report.incidentTypeBreakdown.pindah_tab}`}
              />
            )}
            {report.incidentTypeBreakdown.keluar_halaman > 0 && (
              <div
                style={{
                  width: `${(report.incidentTypeBreakdown.keluar_halaman / (report.totalIncidents || 1)) * 100}%`,
                }}
                className="bg-rose-500 h-full"
                title={`Jendela Kehilangan Fokus: ${report.incidentTypeBreakdown.keluar_halaman}`}
              />
            )}
            {report.incidentTypeBreakdown.keluar_layar_penuh > 0 && (
              <div
                style={{
                  width: `${(report.incidentTypeBreakdown.keluar_layar_penuh / (report.totalIncidents || 1)) * 100}%`,
                }}
                className="bg-blue-500 h-full"
                title={`Keluar Layar Penuh: ${report.incidentTypeBreakdown.keluar_layar_penuh}`}
              />
            )}
            {report.incidentTypeBreakdown.salin_soal > 0 && (
              <div
                style={{
                  width: `${(report.incidentTypeBreakdown.salin_soal / (report.totalIncidents || 1)) * 100}%`,
                }}
                className="bg-purple-500 h-full"
                title={`Upaya Salin Teks: ${report.incidentTypeBreakdown.salin_soal}`}
              />
            )}
          </div>

          {/* Legend Badges */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 pt-1 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Pindah Tab ({report.incidentTypeBreakdown.pindah_tab})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Kehilangan Fokus ({report.incidentTypeBreakdown.keluar_halaman})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Keluar Layar Penuh ({report.incidentTypeBreakdown.keluar_layar_penuh})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>Upaya Salin Soal ({report.incidentTypeBreakdown.salin_soal})</span>
            </span>
          </div>
        </div>

        {/* Right: Simulation trigger button */}
        <div className="shrink-0 flex items-center gap-2 print:hidden pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">
              Uji Coba Pengawasan
            </span>
            <span className="text-xs text-slate-700 font-semibold">
              Simulasi Pindah Tab Siswa
            </span>
          </div>
          <button
            onClick={handleSimulateCheating}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 transition-all flex items-center gap-1.5 shadow-xs"
            title="Tambahkan 1 catatan pindah tab tiruan untuk melihat pembaruan data seketika"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>+ Simulasi Kejadian</span>
          </button>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm print:hidden">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama siswa..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setStatusFilter("semua")}
              className={`px-3 py-1.5 text-xs rounded-md font-semibold transition-all ${
                statusFilter === "semua"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Semua ({report.totalStudents})
            </button>
            <button
              onClick={() => setStatusFilter("flagged")}
              className={`px-3 py-1.5 text-xs rounded-md font-semibold transition-all flex items-center gap-1 ${
                statusFilter === "flagged"
                  ? "bg-amber-100 text-amber-900 shadow-xs"
                  : "text-slate-600 hover:text-amber-800"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Terindikasi ({report.flaggedStudentsCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter("clean")}
              className={`px-3 py-1.5 text-xs rounded-md font-semibold transition-all flex items-center gap-1 ${
                statusFilter === "clean"
                  ? "bg-emerald-100 text-emerald-900 shadow-xs"
                  : "text-slate-600 hover:text-emerald-800"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Bersih ({report.cleanStudentsCount})</span>
            </button>
          </div>

          {/* Event Type Dropdown */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="semua">Semua Jenis Insiden</option>
              <option value="pindah_tab">Pindah Tab Peramban</option>
              <option value="keluar_halaman">Jendela Kehilangan Fokus</option>
              <option value="keluar_layar_penuh">Keluar Layar Penuh</option>
              <option value="salin_soal">Upaya Salin Teks</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-300">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="incidents_desc">Insiden Terbanyak</option>
              <option value="name_asc">Nama Siswa (A–Z)</option>
              <option value="duration_desc">Durasi Pengerjaan</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Student Roster List */}
      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 sm:px-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Daftar Rekaman Kejadian per Siswa ({filteredStudents.length} Siswa)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Siswa yang berintegritas penuh ditandai jelas agar mudah dibedakan dengan yang terindikasi insiden.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono font-medium hidden sm:inline">
            Status: Asesmen Selesai Terkirim
          </span>
        </div>

        {report.students.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs p-6 space-y-2">
            <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-bold text-slate-800">Belum ada aktivitas ujian yang tercatat untuk token {selectedToken}.</p>
            <p className="text-slate-500">Log integritas dan pemantauan peramban akan aktif otomatis saat siswa mulai mengerjakan ujian.</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs p-6">
            Tidak ada data siswa yang cocok dengan filter atau kata kunci pencarian.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredStudents.map((student) => {
              const initials = student.studentName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("");

              return (
                <div
                  key={student.studentId}
                  className={`p-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                    student.hasCheating
                      ? "bg-amber-50/40 hover:bg-amber-50/70"
                      : "hover:bg-slate-50/80"
                  }`}
                >
                  {/* Left: Avatar, Name & Summary Tags */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs border ${
                        student.hasCheating
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}
                    >
                      {initials}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {student.studentName}
                        </span>

                        {/* Distinction badge: Honest vs Suspicious */}
                        {student.hasCheating ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                            <span>{student.totalEvents}x Kejadian</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Integritas Terjaga Penuh (0 Kejadian)</span>
                          </span>
                        )}
                      </div>

                      {/* Detail metadata row */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Durasi: {student.durationMinutes || 30} menit</span>
                        </span>
                        <span>•</span>
                        <span>Skor Integritas: <strong className="text-slate-800">{student.integrityScorePct}%</strong></span>
                        {student.events.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-amber-800 font-semibold">
                              Jenis: {Array.from(new Set(student.events.map((e) => e.eventLabel))).join(", ")}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Action: Open Audit Detail Modal */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => setSelectedStudentForModal(student)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs ${
                        student.hasCheating
                          ? "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
                          : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300"
                      }`}
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>{student.hasCheating ? "Buka Kronologi & Bukti" : "Lihat Detail"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Detail Modal per Student */}
      </>
      )}

      <StudentCheatingDetailModal
        isOpen={!!selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
        student={selectedStudentForModal}
        assessmentTitle={report.assessmentTitle}
      />

    </div>
  );
};
