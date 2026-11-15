"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Maximize2,
  QrCode,
  X,
} from "lucide-react";

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
  accentColor = "#003b71",
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
    QRCode.toDataURL(url, {
      width: 720,
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
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
      <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
        <div
          className="mb-3 h-1.5 w-16 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        {badge && (
          <span
            className="mb-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: accentColor }}
          >
            {badge}
          </span>
        )}
        <h3 className="text-center text-base font-extrabold text-slate-900">
          {title}
        </h3>
        <p className="mb-4 text-center text-xs text-slate-500">{subtitle}</p>

        <button
          type="button"
          onClick={() => setFullscreen(true)}
          title="Clic para ampliar QR en pantalla completa"
          className="group relative mb-4 flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-slate-100 bg-white p-2.5 shadow-inner transition hover:border-slate-300"
        >
          {dataUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dataUrl}
                alt={`Código QR para ${title}`}
                className="h-full w-full rounded-lg object-contain"
              />
              <span className="no-print absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-slate-900/80 px-2 py-1 text-[10px] font-semibold text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                <Maximize2 className="h-3 w-3" />
                Ampliar
              </span>
            </>
          ) : (
            <div className="h-36 w-36 animate-pulse rounded-lg bg-slate-200" />
          )}
        </button>

        <div className="mb-3 flex w-full items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5">
          <QrCode className="h-3.5 w-3.5 shrink-0 text-slate-500" />
          <p className="flex-1 truncate font-mono text-[11px] font-medium text-slate-700">
            {fullUrl}
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="no-print shrink-0 rounded p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
            title="Copiar enlace del formulario"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
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
            style={{ backgroundColor: accentColor }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            Descargar QR
          </button>
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            className="flex items-center justify-center rounded-xl border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            title="Modo Kiosco / Pantalla completa"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <a
            href={path}
            className="flex items-center justify-center rounded-xl border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            title="Abrir formulario"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          onClick={() => setFullscreen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>

            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: accentColor }}
            >
              Escanea con tu cámara
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-slate-900">
              {title}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{subtitle}</p>

            <div className="mx-auto my-6 flex h-72 w-72 items-center justify-center rounded-3xl border-2 border-slate-200 bg-white p-4 shadow-md sm:h-80 sm:w-80">
              {dataUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dataUrl}
                  alt={`QR ${title}`}
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            <p className="mb-5 break-all rounded-xl bg-slate-100 px-3 py-2 font-mono text-xs text-slate-700">
              {fullUrl}
            </p>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={handleDownload}
                style={{ backgroundColor: accentColor }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow"
              >
                <Download className="h-4 w-4" />
                Descargar PNG
              </button>
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
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
