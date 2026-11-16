"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Maximize2,
  QrCode,
  X,
} from "lucide-react";
import { generateUamQrDataUrl } from "@/lib/qr-client";

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
    generateUamQrDataUrl(url, 720)
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
    <div className="min-h-screen bg-gradient-to-br from-[#F17C30] via-[#e06d22] to-[#0099A8] px-4 py-6 text-white sm:py-10">
      <div className="mx-auto max-w-xl">
        {/* Top Institutional Header with FIA.png & logo34.png */}
        <header className="mb-5 rounded-3xl border border-white/30 bg-white/95 px-4 py-3 shadow-xl backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/FIA.png"
                alt="Facultad de Ingeniería y Arquitectura UAM"
                className="h-9 w-auto object-contain sm:h-11"
              />
              <div className="h-8 w-px bg-slate-200" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/logo34.png"
                alt="34 Aniversario UAM"
                className="h-10 w-auto object-contain sm:h-12"
              />
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0099A8] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Portal
              </Link>
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#F17C30] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
              >
                <QrCode className="h-3.5 w-3.5" />
                Ver QR
              </button>
            </div>
          </div>
        </header>

        {/* Main Form Card */}
        <div className="overflow-hidden rounded-3xl border border-white/30 bg-[#0099A8] text-white shadow-2xl">
          {/* Card Header in Primary #F17C30 */}
          <div className="bg-[#F17C30] px-6 py-6 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-block rounded-full bg-[#0099A8] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                  {badge}
                </span>
                <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-white">
                  {title}
                </h1>
                <p className="mt-1 text-sm text-white/95">{subtitle}</p>
              </div>
              {qrDataUrl && (
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  title="Ampliar QR para escanear"
                  className="group shrink-0 rounded-2xl border-2 border-white bg-white p-1.5 shadow-lg transition hover:scale-105"
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

          {/* Form Body */}
          <div className="p-6 text-white sm:p-7">{children}</div>

          {/* Embedded Direct QR Footer inside each of the 4 forms */}
          <div className="border-t border-white/20 bg-black/15 px-6 py-4 text-white">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-3.5">
                {qrDataUrl && (
                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="shrink-0 rounded-xl border-2 border-white bg-white p-1.5 shadow-md transition hover:scale-105"
                    title="Clic para ampliar QR"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrDataUrl}
                      alt={`QR ${title}`}
                      className="h-16 w-16 object-contain"
                    />
                  </button>
                )}
                <div>
                  <p className="text-xs font-extrabold text-white">
                    Código QR Oficial · {title}
                  </p>
                  <p className="text-[11px] text-white/90">
                    Escanea este QR con el celular para cargar directamente este formulario.
                  </p>
                  <p className="mt-0.5 max-w-[220px] truncate font-mono text-[10px] text-white/85 sm:max-w-[240px]">
                    {fullUrl}
                  </p>
                </div>
              </div>

              <div className="flex w-full shrink-0 gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-white/40 bg-white/15 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-white/25 sm:flex-initial"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  Ampliar
                </button>
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#F17C30] px-3 py-2 text-xs font-bold text-white shadow-sm hover:opacity-95 sm:flex-initial"
                >
                  <Download className="h-3.5 w-3.5" />
                  PNG
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs font-semibold text-white/90">
          Congreso de Ingeniería y Arquitectura · Universidad Americana (UAM)
        </p>
      </div>

      {/* Fullscreen QR Modal for this specific form */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-white/30 bg-gradient-to-b from-[#F17C30] to-[#0099A8] p-6 text-center text-white shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
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

            <span className="inline-block rounded-full bg-[#0099A8] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow">
              {badge}
            </span>
            <h2 className="mt-2.5 text-2xl font-extrabold text-white">
              {title}
            </h2>
            <p className="mt-1 text-xs text-white/90">
              Apunta la cámara de tu teléfono al código QR para abrir este formulario inmediatamente.
            </p>

            <div className="mx-auto my-5 flex h-72 w-72 items-center justify-center rounded-3xl border-4 border-white bg-white p-4 shadow-xl">
              {qrDataUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt={`QR ${title}`}
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            <div className="mb-4 flex items-center gap-2 rounded-xl bg-black/25 px-3 py-2 text-white">
              <p className="flex-1 truncate font-mono text-xs text-white">
                {fullUrl}
              </p>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="inline-flex items-center gap-1 rounded-lg bg-[#F17C30] px-2.5 py-1 text-xs font-bold text-white shadow-sm hover:opacity-95"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-white" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-white" />
                    Copiar
                  </>
                )}
              </button>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#F17C30] py-3 text-sm font-bold text-white shadow-lg ring-1 ring-white/40"
              >
                <Download className="h-4 w-4" />
                Descargar QR (PNG)
              </button>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="rounded-xl border border-white/40 bg-white/15 px-5 py-3 text-sm font-bold text-white hover:bg-white/25"
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
