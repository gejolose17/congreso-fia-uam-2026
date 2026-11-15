"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import {
  Briefcase,
  ChevronRight,
  Download,
  GraduationCap,
  Maximize2,
  Printer,
  QrCode,
  ShieldCheck,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { QrCodeCard } from "./QrCodeCard";

const CATEGORIES = [
  {
    id: "estudiantes",
    title: "Estudiantes UAM",
    description:
      "Valida tu número de CIF en la lista de pagos confirmados y registra tu ingreso.",
    href: "/registro/estudiantes",
    badge: "Formulario 1 · Con CIF",
    icon: GraduationCap,
    color: "bg-[#003b71]",
    accentHex: "#003b71",
    ring: "hover:ring-[#003b71]/40",
    pill: "bg-blue-50 text-[#003b71]",
  },
  {
    id: "patrocinadores",
    title: "Patrocinadores",
    description:
      "Selecciona tu empresa aliada e ingresa tu nombre y apellido para acreditarte.",
    href: "/registro/patrocinadores",
    badge: "Formulario 2 · Empresas",
    icon: Briefcase,
    color: "bg-[#008b9a]",
    accentHex: "#008b9a",
    ring: "hover:ring-[#008b9a]/40",
    pill: "bg-teal-50 text-[#007481]",
  },
  {
    id: "docentes",
    title: "Docentes UAM",
    description:
      "Registro exclusivo para catedráticos de Ingeniería Industrial, Civil o Arquitectura.",
    href: "/registro/docentes",
    badge: "Formulario 3 · FIA",
    icon: Users,
    color: "bg-[#1e40af]",
    accentHex: "#1e40af",
    ring: "hover:ring-indigo-400/50",
    pill: "bg-indigo-50 text-indigo-800",
  },
  {
    id: "invitados",
    title: "Invitados Especiales",
    description:
      "Registro ágil de asistencia con nombre y apellido para invitados y conferencistas.",
    href: "/registro/invitados",
    badge: "Formulario 4 · General",
    icon: UserCheck,
    color: "bg-[#b45309]",
    accentHex: "#b45309",
    ring: "hover:ring-amber-400/50",
    pill: "bg-amber-50 text-amber-800",
  },
];

export function PortalClient() {
  const [showQrPanel, setShowQrPanel] = useState(true);
  const [qrMap, setQrMap] = useState<Record<string, string>>({});
  const [originUrl, setOriginUrl] = useState<string>("");
  const [activeModalCat, setActiveModalCat] = useState<
    (typeof CATEGORIES)[number] | null
  >(null);

  useEffect(() => {
    const origin = window.location.origin.replace(/\/$/, "");
    setOriginUrl(origin);

    Promise.all(
      CATEGORIES.map(async (cat) => {
        const url = `${origin}${cat.href}`;
        const dataUrl = await QRCode.toDataURL(url, {
          width: 600,
          margin: 2,
          errorCorrectionLevel: "H",
          color: {
            dark: "#0f172a",
            light: "#ffffff",
          },
        });
        return [cat.id, dataUrl] as const;
      })
    )
      .then((entries) => {
        setQrMap(Object.fromEntries(entries));
      })
      .catch(console.error);
  }, []);

  const handleDownloadCategoryQr = (cat: (typeof CATEGORIES)[number]) => {
    const dataUrl = qrMap[cat.id];
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qr-${cat.id}-fia-2026.png`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#00284d] via-[#003b71] to-[#002444] text-white">
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-black/10 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-black text-[#003b71] shadow">
              FIA
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                Universidad Americana · Nicaragua
              </p>
              <p className="text-sm font-bold text-white sm:text-base">
                Congreso de Ingeniería y Arquitectura 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/qr"
              className="hidden items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20 sm:inline-flex"
            >
              <Printer className="h-4 w-4" />
              Imprimir QRs
            </Link>
            <button
              type="button"
              onClick={() => setShowQrPanel((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/25"
            >
              {showQrPanel ? (
                <>
                  <X className="h-4 w-4" />
                  Ocultar Panel QR
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4" />
                  Ver Todos los QRs
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero & Selector */}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-400/15 px-3.5 py-1 text-xs font-semibold text-teal-200 ring-1 ring-teal-300/30">
            Sistema de Acreditación Rápida con Código QR
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Bienvenido al Congreso FIA 2026
          </h1>
          <p className="mt-3 text-sm text-blue-100/85 sm:text-base">
            Escanea con tu celular el <strong>Código QR</strong> de tu categoría o toca el formulario correspondiente para registrarte en segundos.
          </p>
        </div>

        {/* 4 Main Category Cards - Each with its own integrated QR Code */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const qrSrc = qrMap[cat.id];
            return (
              <div
                key={cat.id}
                className={`group relative flex flex-col justify-between rounded-3xl bg-white p-6 text-slate-900 shadow-xl ring-1 ring-white/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl ${cat.ring}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${cat.color} text-white shadow-md`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold ${cat.pill}`}
                    >
                      {cat.badge}
                    </span>
                  </div>

                  {/* Content + Direct QR Side-by-Side */}
                  <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <Link href={cat.href}>
                        <h2 className="text-xl font-extrabold text-slate-900 transition group-hover:text-[#003b71]">
                          {cat.title}
                        </h2>
                      </Link>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                        {cat.description}
                      </p>
                      <p className="mt-2 font-mono text-[11px] text-slate-400">
                        {originUrl ? `${originUrl}${cat.href}` : cat.href}
                      </p>
                    </div>

                    {/* Scannable QR Box for this specific form */}
                    <div className="flex flex-col items-center self-center rounded-2xl border border-slate-200 bg-slate-50 p-2.5 shadow-inner sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setActiveModalCat(cat)}
                        title={`Ampliar QR de ${cat.title}`}
                        className="relative flex h-28 w-28 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm transition hover:scale-105"
                      >
                        {qrSrc ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={qrSrc}
                            alt={`Código QR ${cat.title}`}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="h-24 w-24 animate-pulse rounded-lg bg-slate-200" />
                        )}
                      </button>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveModalCat(cat)}
                          className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100"
                        >
                          <Maximize2 className="h-2.5 w-2.5" />
                          Ampliar QR
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadCategoryQr(cat)}
                          className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100"
                          title="Descargar QR en PNG"
                        >
                          <Download className="h-2.5 w-2.5" />
                          PNG
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <Link
                    href={cat.href}
                    className="inline-flex flex-1 items-center justify-between text-sm font-bold text-[#003b71] hover:underline"
                  >
                    <span>Abrir formulario de {cat.title}</span>
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full QR Center Section */}
        {showQrPanel && (
          <section className="mt-10 rounded-3xl bg-white p-6 text-slate-900 shadow-2xl sm:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#003b71]">
                  4 Formularios con QR Individual
                </span>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  Códigos QR de Acceso Directo por Categoría
                </h2>
                <p className="text-sm text-slate-600">
                  Cada uno de los 4 formularios tiene su propio código QR. Al escanearlo con cualquier teléfono, carga directamente el formulario correspondiente.
                </p>
              </div>
              <Link
                href="/admin/qr"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#003b71] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#002a52]"
              >
                <Printer className="h-4 w-4" />
                Imprimir Carteles QR
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <QrCodeCard
                badge="Formulario 1"
                title="1. Estudiantes UAM"
                subtitle="Validación directa por CIF"
                path="/registro/estudiantes"
                accentColor="#003b71"
              />
              <QrCodeCard
                badge="Formulario 2"
                title="2. Patrocinadores"
                subtitle="Registro por empresa aliada"
                path="/registro/patrocinadores"
                accentColor="#008b9a"
              />
              <QrCodeCard
                badge="Formulario 3"
                title="3. Docentes UAM"
                subtitle="Registro por carrera FIA"
                path="/registro/docentes"
                accentColor="#1e40af"
              />
              <QrCodeCard
                badge="Formulario 4"
                title="4. Invitados"
                subtitle="Registro de invitados especiales"
                path="/registro/invitados"
                accentColor="#b45309"
              />
            </div>
          </section>
        )}
      </main>

      {/* Fullscreen QR Modal when clicking any card's QR */}
      {activeModalCat && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          onClick={() => setActiveModalCat(null)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white p-6 text-center text-slate-900 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModalCat(null)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>

            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: activeModalCat.accentHex }}
            >
              {activeModalCat.badge}
            </span>
            <h2 className="mt-2.5 text-2xl font-extrabold text-slate-900">
              {activeModalCat.title}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Escanea este código QR con la cámara de tu celular para cargar el formulario.
            </p>

            <div className="mx-auto my-6 flex h-72 w-72 items-center justify-center rounded-3xl border-2 border-slate-200 bg-white p-4 shadow-md">
              {qrMap[activeModalCat.id] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrMap[activeModalCat.id]}
                  alt={`QR ${activeModalCat.title}`}
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            <p className="mb-5 break-all rounded-xl bg-slate-100 px-3 py-2 font-mono text-xs text-slate-700">
              {originUrl
                ? `${originUrl}${activeModalCat.href}`
                : activeModalCat.href}
            </p>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => handleDownloadCategoryQr(activeModalCat)}
                style={{ backgroundColor: activeModalCat.accentHex }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow"
              >
                <Download className="h-4 w-4" />
                Descargar PNG
              </button>
              <Link
                href={activeModalCat.href}
                className="flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Ir al formulario
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-blue-200/70">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
          <p>
            Facultad de Ingeniería y Arquitectura (FIA) · Universidad Americana (UAM), Nicaragua
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/qr"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-blue-100/80 transition hover:bg-white/10 hover:text-white"
            >
              <QrCode className="h-3.5 w-3.5" />
              Centro de QRs
            </Link>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-blue-100/80 transition hover:bg-white/10 hover:text-white"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Panel Organizadores
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
