"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Shapes,
  X,
  Smartphone,
  Laptop,
  Check,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  FolderOpen,
} from "lucide-react";
import { GEOMETRY_SVG_PRESETS } from "@/lib/question-bank-store";

interface ImageUploaderProps {
  imageUrl?: string;
  svgDiagram?: string;
  onChange: (data: { imageUrl?: string; svgDiagram?: string }) => void;
  className?: string;
}

/**
 * Utility: Compresses and resizes raster images (PNG, JPG, WebP)
 * to max 800px dimension and converts to efficient Base64 JPEG.
 */
function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.fillStyle = "#ffffff"; // clean white background for transparent PNGs
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to web-friendly JPEG at 0.84 quality
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.84);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error("Gagal memproses gambar"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Gagal membaca berkas"));
    reader.readAsDataURL(file);
  });
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl,
  svgDiagram,
  onChange,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "preset" | "url">("upload");
  const [urlInput, setUrlInput] = useState(imageUrl || "");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeFileName, setActiveFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync urlInput when prop changes
  useEffect(() => {
    if (imageUrl && !urlInput) {
      setUrlInput(imageUrl);
    }
  }, [imageUrl]);

  const hasMedia = Boolean(imageUrl || svgDiagram);

  const showSuccessFeedback = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const processFile = async (file: File) => {
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const isImage = file.type.startsWith("image/");
      const isSvgExt = file.name.toLowerCase().endsWith(".svg");

      if (!isImage && !isSvgExt) {
        setErrorMsg("Format file tidak didukung! Harap unggah gambar (PNG, JPG, SVG, WebP).");
        setIsProcessing(false);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Ukuran file terlalu besar! Maksimal 5MB.");
        setIsProcessing(false);
        return;
      }

      setActiveFileName(file.name);

      if (isSvgExt || file.type === "image/svg+xml") {
        const reader = new FileReader();
        reader.onload = (event) => {
          const svgContent = event.target?.result as string;
          if (svgContent.includes("<svg")) {
            onChange({ svgDiagram: svgContent, imageUrl: undefined });
            showSuccessFeedback(`Diagram SVG "${file.name}" berhasil dipasang.`);
          } else {
            onChange({ imageUrl: svgContent, svgDiagram: undefined });
            showSuccessFeedback(`Gambar "${file.name}" berhasil dipasang.`);
          }
          setIsProcessing(false);
        };
        reader.onerror = () => {
          setErrorMsg("Gagal membaca berkas SVG. Silakan coba kembali.");
          setIsProcessing(false);
        };
        reader.readAsText(file);
      } else {
        const optimized = await compressImageFile(file);
        onChange({ imageUrl: optimized, svgDiagram: undefined });
        showSuccessFeedback(`Gambar "${file.name}" berhasil dioptimasi & dipasang.`);
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal memproses gambar. Pastikan format berkas valid.");
      setIsProcessing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSelectPreset = (presetSvg: string, title: string) => {
    setErrorMsg(null);
    setActiveFileName(`Preset: ${title}`);
    onChange({ svgDiagram: presetSvg, imageUrl: undefined });
    showSuccessFeedback(`Preset geometri "${title}" berhasil diterapkan.`);
  };

  const handleApplyUrl = (overrideUrl?: string) => {
    setErrorMsg(null);
    const targetUrl = (overrideUrl !== undefined ? overrideUrl : urlInput).trim();

    if (!targetUrl) {
      setErrorMsg("Harap masukkan tautan URL gambar yang valid!");
      return;
    }

    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://") && !targetUrl.startsWith("data:")) {
      setErrorMsg("URL harus diawali dengan http:// atau https://");
      return;
    }

    setActiveFileName("Tautan Gambar URL");
    onChange({ imageUrl: targetUrl, svgDiagram: undefined });
    showSuccessFeedback("Tautan gambar berhasil dipasang.");
  };

  const handleClear = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setUrlInput("");
    setActiveFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onChange({ imageUrl: undefined, svgDiagram: undefined });
  };

  return (
    <div className={`rounded-xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4 ${className}`}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>Gambar Bangun Geometri atau Grafik Soal</span>
            <span className="text-[11px] font-normal text-slate-500">(Opsional)</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Sisipkan diagram bidang kartesius, vektor transformasi, atau bangun geometri agar soal mudah dipahami siswa.
          </p>
        </div>

        {hasMedia && (
          <button
            type="button"
            onClick={handleClear}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Hapus Gambar</span>
          </button>
        )}
      </div>

      {/* Alert Notices */}
      {errorMsg && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ACTIVE ATTACHED MEDIA CARD */}
      {hasMedia && (
        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Check className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Gambar Soal Aktif Terpasang</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                    Siap Tampil di Siswa
                  </span>
                </p>
                <p className="text-[11px] text-slate-600">
                  {activeFileName || (svgDiagram ? "Diagram SVG Geometri" : "Berkas Gambar Soal")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Responsive Device Switcher */}
              <div className="flex rounded-lg bg-white p-0.5 border border-slate-200 shadow-xs">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md flex items-center gap-1 transition-all ${previewDevice === "desktop"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  <Laptop className="w-3 h-3" />
                  <span>Laptop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md flex items-center gap-1 transition-all ${previewDevice === "mobile"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Layar HP</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Hapus gambar ini"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Graphic Render */}
          <div className="flex justify-center bg-white rounded-lg p-4 border border-slate-200 overflow-hidden shadow-xs">
            <div
              className={`transition-all duration-300 flex items-center justify-center ${previewDevice === "mobile"
                ? "w-[260px] p-2 rounded-xl border border-slate-300 bg-slate-50 shadow-sm"
                : "w-full max-w-sm p-2"
                }`}
            >
              {svgDiagram ? (
                <div
                  className="w-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-auto"
                  dangerouslySetInnerHTML={{ __html: svgDiagram }}
                />
              ) : imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt="Pratinjau Gambar Soal"
                  className="max-h-56 max-w-full rounded-md object-contain mx-auto"
                  onError={() => setErrorMsg("Gagal memuat gambar dari sumber yang ditentukan. Periksa kembali tautan/berkas gambar.")}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Tabs Selector for Adding / Changing Image */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700">
            {hasMedia ? "Ganti atau Pilih Sumber Gambar Lain:" : "Pilih Metode Penyisipan Gambar:"}
          </span>
        </div>

        <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200 mb-4 max-w-md">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${activeTab === "upload"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Unggah Berkas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preset")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${activeTab === "preset"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <Shapes className="w-3.5 h-3.5" />
            <span>Preset Geometri</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${activeTab === "url"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Tautan URL</span>
          </button>
        </div>
      </div>

      {/* TAB 1: FILE UPLOAD (Click + Drag & Drop) */}
      {activeTab === "upload" && (
        <div className="space-y-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 sm:p-8 cursor-pointer transition-all ${isDragging
              ? "border-blue-500 bg-blue-50/50 scale-[1.01]"
              : "border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50"
              }`}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 shadow-xs">
              {isProcessing ? (
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-800 text-center">
              {isDragging ? "Lepaskan Berkas Gambar di Sini..." : "Klik untuk Pilih Gambar atau Seret Berkas ke Sini"}
            </p>

            <p className="text-[11px] text-slate-500 mt-1 text-center font-medium">
              Mendukung PNG, JPG, JPEG, WebP, dan SVG (Otomatis dioptimasi untuk HP siswa)
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Jelajahi Berkas dari Perangkat</span>
            </button>

            {/* Accessible Hidden Input */}
            <input
              id="image-file-input"
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml,.svg"
              onChange={handleFileInputChange}
              className="sr-only"
            />
          </div>
        </div>
      )}

      {/* TAB 2: GEOMETRY PRESETS */}
      {activeTab === "preset" && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 font-medium">
            Pilih salah satu diagram geometri bawaan untuk langsung digunakan pada soal asesmen:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {GEOMETRY_SVG_PRESETS.map((preset) => {
              const isSelected = svgDiagram === preset.svg;
              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.svg, preset.title)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${isSelected
                    ? "bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-500"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                >
                  <div className="w-full h-28 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center p-1 border border-slate-200 mb-2">
                    <div
                      className="w-full h-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: preset.svg }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {preset.title}
                    </h5>
                    {isSelected ? (
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-[10px] text-blue-600 font-bold hover:underline">
                        Pilih
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                    {preset.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: URL INPUT */}
      {activeTab === "url" && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 font-medium">
            Tempelkan alamat URL gambar grafik/bangun (misal: tautan dari Google Drive atau CDN publik):
          </p>
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
              }}
              onBlur={() => {
                if (urlInput.trim()) {
                  handleApplyUrl(urlInput);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleApplyUrl();
                }
              }}
              placeholder="https://contoh.com/gambar-translasi.png"
              className="flex-1 px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => handleApplyUrl()}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Terapkan URL</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
