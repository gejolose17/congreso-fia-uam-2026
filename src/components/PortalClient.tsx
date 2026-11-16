"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { generateUamQrDataUrl } from "@/lib/qr-client";

const CATEGORIES = [
  {
    id: "estudiantes",
    title: "Estudiantes UAM",
    description:
      "Valida tu número de CIF en la lista de pagos confirmados y registra tu ingreso.",
    href: "/registro/estudiantes",
    badge: "Formulario 1 · Con CIF",
    icon: GraduationCap,
  },
  {
    id: "patrocinadores",
    title: "Patrocinadores",
    description:
      "Selecciona tu empresa aliada e ingresa tu nombre y apellido para acreditarte.",
    href: "/registro/patrocinadores",
    badge: "Formulario 2 · Empresas",
    icon: Briefcase,
  },
  {
    id: "docentes",
    title: "Docentes UAM",
    description:
      "Registro exclusivo para catedráticos de Ingeniería Industrial, Civil o Arquitectura.",
    href: "/registro/docentes",
    badge: "Formulario 3 · FIA",
    icon: Users,
  },
  {
    id: "invitados",
    title: "Invitados Especiales",
    description:
      "Registro ágil de asistencia con nombre y apellido para invitados y conferencistas.",
    href: "/registro/invitados",
    badge: "Formulario 4 · General",
    icon: UserCheck,
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
        const dataUrl = await generateUamQrDataUrl(url, 720);
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
    <div className="min-h-screen bg-gradient-to-br from-[#F17C30] via-[#e57025] to-[#0099A8] text-white">
      {/* Top Institutional Header with FIA.png and logo34.png */}
      <header className="border-b border-white/25 bg-white/95 shadow-lg backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/image/FIA.png"
              alt="Facultad de Ingeniería y Arquitectura UAM"
              className="h-10 w-auto object-contain sm:h-12"
            />
            <div className="h-9 w-px bg-slate-200" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/image/logo34.png"
              alt="34 Aniversario UAM"
              className="h-11 w-auto object-contain sm:h-14"
            />
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/qr"
              className="hidden items-center gap-1.5 rounded-xl bg-[#0099A8] px-3.5 py-2 text-xs font-bold text-white shadow transition hover:opacity-95 sm:inline-flex"
            >
              <Printer className="h-4 w-4" />
              Imprimir QRs
            </Link>
            <button
              type="button"
              onClick={() => setShowQrPanel((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#F17C30] px-3.5 py-2 text-xs font-bold text-white shadow transition hover:opacity-95"
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
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-3xl text-center text-white">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0099A8] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md ring-1 ring-white/40">
            Sistema de Acreditación Rápida · Congreso FIA UAM 2026
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white drop-shadow sm:text-5xl">
            Bienvenido al Congreso FIA 2026
          </h1>
          <p className="mt-3 text-sm font-medium text-white/95 sm:text-base">
            Escanea con tu celular el <strong>Código QR</strong> de tu categoría o toca el formulario correspondiente para registrarte en segundos.
          </p>
        </div>

        {/* 4 Main Category Cards - Secondary #0099A8 with Primary #F17C30 accents & White Text */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const qrSrc = qrMap[cat.id];
            return (
              <div
                key={cat.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/35 bg-[#0099A8] p-6 text-white shadow-2xl transition duration-200 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F17C30] text-white shadow-lg ring-2 ring-white/30">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-[#F17C30] px-3 py-1 text-[11px] font-bold text-white shadow">
                      {cat.badge}
                    </span>
                  </div>

                  {/* Content + Direct QR Side-by-Side */}
                  <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <Link href={cat.href}>
                        <h2 className="text-xl font-extrabold text-white transition group-hover:underline">
                          {cat.title}
                        </h2>
                      </Link>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/95">
                        {cat.description}
                      </p>
                      <p className="mt-2 font-mono text-[11px] text-white/85">
                        {originUrl ? `${originUrl}${cat.href}` : cat.href}
                      </p>
                    </div>

                    {/* Scannable QR Box (#0099A8 + UAM.png) for this specific form */}
                    <div className="flex flex-col items-center self-center rounded-2xl border border-white/30 bg-black/15 p-2.5 shadow-inner sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setActiveModalCat(cat)}
                        title={`Ampliar QR de ${cat.title}`}
                        className="relative flex h-28 w-28 items-center justify-center rounded-xl border-2 border-white bg-white p-1.5 shadow-md transition hover:scale-105"
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
                      <div className="mt-2 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveModalCat(cat)}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#F17C30] px-2 py-1 text-[10px] font-bold text-white shadow hover:opacity-95"
                        >
                          <Maximize2 className="h-2.5 w-2.5" />
                          Ampliar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadCategoryQr(cat)}
                          className="inline-flex items-center gap-1 rounded-lg border border-white/40 bg-white/15 px-2 py-1 text-[10px] font-bold text-white hover:bg-white/25"
                          title="Descargar QR en PNG"
                        >
                          <Download className="h-2.5 w-2.5" />
                          PNG
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/25 pt-4">
                  <Link
                    href={cat.href}
                    className="inline-flex w-full items-center justify-between rounded-xl bg-[#F17C30] px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-95"
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
          <section className="mt-10 rounded-3xl border border-white/35 bg-black/20 p-6 text-white shadow-2xl backdrop-blur-md sm:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="inline-block rounded-full bg-[#F17C30] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow">
                  4 Formularios con QR #0099A8 + Logo UAM
                </span>
                <h2 className="mt-1.5 text-xl font-extrabold text-white">
                  Códigos QR de Acceso Directo por Categoría
                </h2>
                <p className="text-sm text-white/95">
                  Cada uno de los 4 formularios tiene su propio código QR personalizado con el logo UAM. Al escanearlo con cualquier teléfono, carga directamente el formulario correspondiente.
                </p>
              </div>
              <Link
                href="/admin/qr"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#F17C30] px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:opacity-95"
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
                accentColor="#F17C30"
              />
              <QrCodeCard
                badge="Formulario 2"
                title="2. Patrocinadores"
                subtitle="Registro por empresa aliada"
                path="/registro/patrocinadores"
                accentColor="#F17C30"
              />
              <QrCodeCard
                badge="Formulario 3"
                title="3. Docentes UAM"
                subtitle="Registro por carrera FIA"
                path="/registro/docentes"
                accentColor="#F17C30"
              />
              <QrCodeCard
                badge="Formulario 4"
                title="4. Invitados"
                subtitle="Registro de invitados especiales"
                path="/registro/invitados"
                accentColor="#F17C30"
              />
            </div>
          </section>
        )}
      </main>

      {/* Fullscreen QR Modal when clicking any card's QR */}
      {activeModalCat && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setActiveModalCat(null)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-white/30 bg-gradient-to-b from-[#F17C30] to-[#0099A8] p-6 text-center text-white shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModalCat(null)}
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
              {activeModalCat.badge}
            </span>
            <h2 className="mt-2.5 text-2xl font-extrabold text-white">
              {activeModalCat.title}
            </h2>
            <p className="mt-1 text-sm text-white/95">
              Escanea este código QR con la cámara de tu celular para cargar el formulario.
            </p>

            <div className="mx-auto my-6 flex h-72 w-72 items-center justify-center rounded-3xl border-4 border-white bg-white p-4 shadow-xl">
              {qrMap[activeModalCat.id] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrMap[activeModalCat.id]}
                  alt={`QR ${activeModalCat.title}`}
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            <p className="mb-5 break-all rounded-xl bg-black/25 px-3 py-2 font-mono text-xs text-white">
              {originUrl
                ? `${originUrl}${activeModalCat.href}`
                : activeModalCat.href}
            </p>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => handleDownloadCategoryQr(activeModalCat)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#F17C30] py-3 text-sm font-bold text-white shadow-lg ring-1 ring-white/40"
              >
                <Download className="h-4 w-4" />
                Descargar PNG
              </button>
              <Link
                href={activeModalCat.href}
                className="flex items-center justify-center rounded-xl border border-white/40 bg-white/15 px-4 py-3 text-sm font-bold text-white hover:bg-white/25"
              >
                Ir al formulario
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/20 bg-black/20 py-6 text-center text-xs text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
          <p className="font-semibold text-white">
            Facultad de Ingeniería y Arquitectura (FIA) · Universidad Americana (UAM), Nicaragua
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/qr"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 font-bold text-white transition hover:bg-white/25"
            >
              <QrCode className="h-3.5 w-3.5" />
              Centro de QRs
            </Link>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#F17C30] px-3 py-1.5 font-bold text-white shadow transition hover:opacity-95"
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
