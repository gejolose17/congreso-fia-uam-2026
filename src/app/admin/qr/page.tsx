"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Printer, QrCode } from "lucide-react";
import { QrCodeCard } from "@/components/QrCodeCard";

export default function QrCenterPage() {
  const [baseOrigin, setBaseOrigin] = useState<string>("");

  useEffect(() => {
    setBaseOrigin(window.location.origin);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F17C30] via-[#e26e22] to-[#0099A8] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Institutional Header with FIA.png & logo34.png */}
        <div className="no-print mb-6 flex flex-col gap-4 rounded-3xl border border-white/35 bg-[#0099A8] p-6 text-white shadow-2xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/FIA.png"
                alt="FIA UAM"
                className="h-8 w-auto object-contain sm:h-10"
              />
              <div className="h-7 w-px bg-slate-200" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/logo34.png"
                alt="34 Aniversario UAM"
                className="h-9 w-auto object-contain sm:h-11"
              />
            </div>

            <div className="flex items-center gap-2">
              <QrCode className="h-6 w-6 text-white" />
              <h1 className="text-2xl font-extrabold text-white">
                Centro Oficial de Códigos QR · Congreso FIA UAM 2026
              </h1>
            </div>
            <p className="mt-1 text-sm text-white/95">
              Cada uno de los 4 formularios cuenta con su propio QR individual en color #0099A8 con el logo UAM.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/40 bg-white/15 px-4 py-3 text-sm font-bold text-white hover:bg-white/25"
            >
              <ArrowLeft className="h-4 w-4" />
              Portal
            </Link>
            <Link
              href="/admin/ruletas"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/40 bg-white/15 px-4 py-3 text-sm font-bold text-white hover:bg-white/25"
            >
              🎰 Ruletas
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F17C30] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-95"
            >
              <Printer className="h-4 w-4" />
              Imprimir los 4 Carteles QR
            </button>
          </div>
        </div>

        {/* Custom Base URL bar (hidden on print) */}
        <div className="no-print mb-6 flex flex-col gap-2 rounded-2xl border border-white/30 bg-black/20 px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Globe className="h-4 w-4 text-white" />
            <span>Dominio Web codificado en los QRs (automático en Vercel):</span>
          </div>
          <input
            type="text"
            value={baseOrigin}
            onChange={(e) => setBaseOrigin(e.target.value)}
            placeholder="https://tu-proyecto.vercel.app"
            className="w-full rounded-xl border border-white/40 bg-white/15 px-3 py-1.5 font-mono text-xs font-bold text-white placeholder-white/60 outline-none focus:border-[#F17C30] sm:w-96"
          />
        </div>

        {/* Primary 4 Form QRs */}
        <div className="mb-8">
          <h2 className="no-print mb-4 text-sm font-extrabold uppercase tracking-wider text-white">
            Los 4 Formularios Oficiales (Escaneo Directo · #0099A8 + UAM.png)
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <QrCodeCard
              badge="Formulario 1"
              title="1. Estudiantes UAM"
              subtitle="Validación por número de CIF"
              path="/registro/estudiantes"
              accentColor="#F17C30"
              customBaseOrigin={baseOrigin}
            />
            <QrCodeCard
              badge="Formulario 2"
              title="2. Patrocinadores"
              subtitle="Selección de empresa + nombre"
              path="/registro/patrocinadores"
              accentColor="#F17C30"
              customBaseOrigin={baseOrigin}
            />
            <QrCodeCard
              badge="Formulario 3"
              title="3. Docentes UAM"
              subtitle="Industrial · Civil · Arquitectura"
              path="/registro/docentes"
              accentColor="#F17C30"
              customBaseOrigin={baseOrigin}
            />
            <QrCodeCard
              badge="Formulario 4"
              title="4. Invitados Especiales"
              subtitle="Registro con nombre y apellido"
              path="/registro/invitados"
              accentColor="#F17C30"
              customBaseOrigin={baseOrigin}
            />
          </div>
        </div>

        {/* General Portal QR */}
        <div className="no-print border-t border-white/25 pt-6">
          <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wider text-white">
            QR General del Portal (4 Categorías en una sola pantalla)
          </h2>
          <div className="max-w-sm">
            <QrCodeCard
              badge="Portal Completo"
              title="Portal General (4 Botones)"
              subtitle="Escanea para elegir cualquiera de los 4 formularios"
              path="/"
              accentColor="#F17C30"
              customBaseOrigin={baseOrigin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
