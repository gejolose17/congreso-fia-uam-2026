"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import QRCode from "qrcode";
import {
  ArrowLeft,
  Building2,
  Check,
  Copy,
  Download,
  Maximize2,
  QrCode,
  X,
} from "lucide-react";

interface RegistrationShellProps {
  badge: string;
  title: string;
  subtitle: string;
  accentClass?: string;
  accentHex?: string;
  children: React.ReactNode;
}

export function RegistrationShell({
  badge,
  title,
  subtitle,
  accentClass = "bg-[#003b71]",
  accentHex = "#003b71",
  children,
}: RegistrationShellProps) {
  const pathname = usePathname() || "/";
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [fullUrl, setFullUrl] = useState<string>(pathname);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const origin = window.location.origin.replace(/\/$/, "");
    const url = `${origin}${pathname}`;
    setFullUrl(url);
    QRCode.toDataURL(url, {
      width: 640,
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [pathname]);

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    a.download = `qr-${slug}.png`;
    a.click();
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-[#f4f7fb] to-slate-100 px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-lg">
        {/* Top Navigation Bar */}
        <div className="mb-5 flex items-center justify-between gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Portal Principal
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-[#003b71] shadow-sm ring-1 ring-slate-200 transition hover:bg-blue-50"
            >
              <QrCode className="h-3.5 w-3.5" />
              QR de este Formulario
            </button>
            <div className="hidden items-center gap-1.5 text-xs font-semibold text-[#003b71] sm:flex">
              <Building2 className="h-4 w-4" />
              <span>FIA · UAM</span>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/70 ring-1 ring-slate-200/80">
          <div className={`${accentClass} px-6 py-6 text-white`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-sm">
                  {badge}
                </span>
                <h1 className="mt-2.5 text-2xl font-bold tracking-tight">
                  {title}
                </h1>
                <p className="mt-1 text-sm text-white/85">{subtitle}</p>
              </div>
              {qrDataUrl && (
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  title="Ampliar QR para escanear"
                  className="group shrink-0 rounded-2xl bg-white p-1.5 shadow-lg transition hover:scale-105"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt={`QR ${title}`}
                    className="h-16 w-16 rounded-xl object-contain"
                  />
                </button>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-7">{children}</div>

          {/* Embedded Direct QR Footer inside each of the 4 forms */}
          <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-4">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-3.5">
                {qrDataUrl && (
                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="shrink-0 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm transition hover:scale-105"
                    title="Clic para ampliar QR"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrDataUrl}
                      alt={`QR ${title}`}
                      className="h-14 w-14 object-contain"
                    />
                  </button>
                )}
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Código QR de {title}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Escanea este QR con el celular para cargar directamente este formulario.
                  </p>
                  <p className="mt-0.5 max-w-[220px] truncate font-mono text-[10px] text-slate-600 sm:max-w-[240px]">
                    {fullUrl}
                  </p>
                </div>
              </div>

              <div className="flex w-full shrink-0 gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-100 sm:flex-initial"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  Ampliar
                </button>
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  style={{ backgroundColor: accentHex }}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90 sm:flex-initial"
                >
                  <Download className="h-3.5 w-3.5" />
                  PNG
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Congreso de Ingeniería y Arquitectura · Universidad Americana (UAM)
        </p>
      </div>

      {/* Fullscreen QR Modal for this specific form */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>

            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: accentHex }}
            >
              {badge}
            </span>
            <h2 className="mt-2.5 text-2xl font-extrabold text-slate-900">
              {title}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Apunta la cámara de tu teléfono al código QR para abrir este formulario inmediatamente.
            </p>

            <div className="mx-auto my-5 flex h-72 w-72 items-center justify-center rounded-3xl border-2 border-slate-200 bg-white p-4 shadow-md">
              {qrDataUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt={`QR ${title}`}
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            <div className="mb-4 flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2">
              <p className="flex-1 truncate font-mono text-xs text-slate-700">
                {fullUrl}
              </p>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copiar
                  </>
                )}
              </button>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={handleDownloadQr}
                style={{ backgroundColor: accentHex }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow"
              >
                <Download className="h-4 w-4" />
                Descargar QR (PNG)
              </button>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
