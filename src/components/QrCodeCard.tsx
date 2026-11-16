"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Maximize2,
  QrCode,
  X,
} from "lucide-react";
import { generateUamQrDataUrl } from "@/lib/qr-client";

interface QrCodeCardProps {
  title: string;
  subtitle: string;
  path: string;
  badge?: string;
  accentColor?: string;
  customBaseOrigin?: string;
}

export function QrCodeCard({
  title,
  subtitle,
  path,
  badge,
  accentColor = "#F17C30",
  customBaseOrigin,
}: QrCodeCardProps) {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [fullUrl, setFullUrl] = useState<string>(path);
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const origin = (
      customBaseOrigin?.trim() || window.location.origin
    ).replace(/\/$/, "");
    const url = `${origin}${path}`;
    setFullUrl(url);
    generateUamQrDataUrl(url, 720)
      .then(setDataUrl)
      .catch(console.error);
  }, [path, customBaseOrigin]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    a.download = `qr-${slug}.png`;
    a.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <>
      <div className="flex flex-col items-center rounded-2xl border border-white/25 bg-[#0099A8] p-5 text-white shadow-lg transition hover:shadow-xl">
        <div
          className="mb-3 h-1.5 w-16 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        {badge && (
          <span
            className="mb-1.5 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
            style={{ backgroundColor: accentColor }}
          >
            {badge}
          </span>
        )}
        <h3 className="text-center text-base font-extrabold text-white">
          {title}
        </h3>
        <p className="mb-4 text-center text-xs text-white/90">{subtitle}</p>

        <button
          type="button"
          onClick={() => setFullscreen(true)}
          title="Clic para ampliar QR en pantalla completa"
          className="group relative mb-4 flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-white bg-white p-2.5 shadow-md transition hover:scale-[1.02]"
        >
          {dataUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dataUrl}
                alt={`Código QR para ${title}`}
                className="h-full w-full rounded-lg object-contain"
              />
              <span className="no-print absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-[#F17C30] px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow transition group-hover:opacity-100">
                <Maximize2 className="h-3 w-3" />
                Ampliar
              </span>
            </>
          ) : (
            <div className="h-36 w-36 animate-pulse rounded-lg bg-slate-200" />
          )}
        </button>

        <div className="mb-3 flex w-full items-center gap-1.5 rounded-lg bg-black/20 px-2.5 py-1.5 text-white">
          <QrCode className="h-3.5 w-3.5 shrink-0 text-white" />
          <p className="flex-1 truncate font-mono text-[11px] font-medium text-white">
            {fullUrl}
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="no-print shrink-0 rounded p-1 text-white/90 hover:bg-white/20 hover:text-white"
            title="Copiar enlace del formulario"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-white" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        <div className="no-print flex w-full gap-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!dataUrl}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#F17C30] px-3 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-95 disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            Descargar QR
          </button>
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            className="flex items-center justify-center rounded-xl border border-white/30 bg-white/15 px-2.5 py-2 text-xs font-semibold text-white transition hover:bg-white/25"
            title="Modo Kiosco / Pantalla completa"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <a
            href={path}
            className="flex items-center justify-center rounded-xl border border-white/30 bg-white/15 px-2.5 py-2 text-xs font-semibold text-white transition hover:bg-white/25"
            title="Abrir formulario"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setFullscreen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-white/25 bg-gradient-to-b from-[#F17C30] to-[#0099A8] p-6 text-center text-white shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto mb-3 inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/FIA.png"
                alt="FIA UAM"
                className="h-7 w-auto object-contain"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/logo34.png"
                alt="34 Aniversario UAM"
                className="h-8 w-auto object-contain"
              />
            </div>

            <h2 className="mt-1 text-2xl font-extrabold text-white">
              {title}
            </h2>
            <p className="mt-1 text-sm text-white/90">{subtitle}</p>

            <div className="mx-auto my-5 flex h-72 w-72 items-center justify-center rounded-3xl border-4 border-white bg-white p-4 shadow-xl sm:h-80 sm:w-80">
              {dataUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dataUrl}
                  alt={`QR ${title}`}
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            <p className="mb-5 break-all rounded-xl bg-black/25 px-3 py-2 font-mono text-xs text-white">
              {fullUrl}
            </p>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={handleDownload}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#F17C30] py-3 text-sm font-bold text-white shadow-lg ring-1 ring-white/40 hover:opacity-95"
              >
                <Download className="h-4 w-4" />
                Descargar PNG
              </button>
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                className="rounded-xl border border-white/40 bg-white/15 px-5 py-3 text-sm font-bold text-white hover:bg-white/25"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
