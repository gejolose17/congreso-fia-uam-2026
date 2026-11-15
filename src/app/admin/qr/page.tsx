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
    <div className="min-h-screen bg-[#f4f7fb] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="no-print mb-8 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003b71] hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver al Portal Principal
            </Link>
            <div className="mt-2 flex items-center gap-2">
              <QrCode className="h-6 w-6 text-[#003b71]" />
              <h1 className="text-2xl font-extrabold text-slate-900">
                Centro Oficial de Códigos QR · Congreso FIA UAM 2026
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Cada uno de los 4 formularios cuenta con su propio QR individual. Cuando los asistentes lo leen con su celular, les carga directamente ese formulario.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#003b71] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#002a52]"
            >
              <Printer className="h-4 w-4" />
              Imprimir los 4 Carteles QR
            </button>
          </div>
        </div>

        {/* Custom Base URL bar (hidden on print) */}
        <div className="no-print mb-6 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Globe className="h-4 w-4 text-[#008b9a]" />
            <span>Dominio Web codificado en los QRs (automático en Vercel):</span>
          </div>
          <input
            type="text"
            value={baseOrigin}
            onChange={(e) => setBaseOrigin(e.target.value)}
            placeholder="https://tu-proyecto.vercel.app"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 font-mono text-xs font-semibold text-slate-800 outline-none focus:border-[#003b71] focus:bg-white sm:w-96"
          />
        </div>

        {/* Primary 4 Form QRs */}
        <div className="mb-8">
          <h2 className="no-print mb-4 text-sm font-extrabold uppercase tracking-wider text-slate-500">
            Los 4 Formularios Oficiales (Escaneo Directo)
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <QrCodeCard
              badge="Formulario 1"
              title="1. Estudiantes UAM"
              subtitle="Validación por número de CIF"
              path="/registro/estudiantes"
              accentColor="#003b71"
              customBaseOrigin={baseOrigin}
            />
            <QrCodeCard
              badge="Formulario 2"
              title="2. Patrocinadores"
              subtitle="Selección de empresa + nombre"
              path="/registro/patrocinadores"
              accentColor="#008b9a"
              customBaseOrigin={baseOrigin}
            />
            <QrCodeCard
              badge="Formulario 3"
              title="3. Docentes UAM"
              subtitle="Industrial · Civil · Arquitectura"
              path="/registro/docentes"
              accentColor="#1e40af"
              customBaseOrigin={baseOrigin}
            />
            <QrCodeCard
              badge="Formulario 4"
              title="4. Invitados Especiales"
              subtitle="Registro con nombre y apellido"
              path="/registro/invitados"
              accentColor="#b45309"
              customBaseOrigin={baseOrigin}
            />
          </div>
        </div>

        {/* General Portal QR */}
        <div className="no-print border-t border-slate-200 pt-6">
          <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wider text-slate-500">
            QR General del Portal (4 Categorías en una sola pantalla)
          </h2>
          <div className="max-w-sm">
            <QrCodeCard
              badge="Portal Completo"
              title="Portal General (4 Botones)"
              subtitle="Escanea para elegir cualquiera de los 4 formularios"
              path="/"
              accentColor="#003b71"
              customBaseOrigin={baseOrigin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
