"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Loader2, Users } from "lucide-react";
import { FIA_CAREERS } from "@/lib/constants";
import { RegistrationShell } from "@/components/RegistrationShell";
import { RegistrationPassQr } from "@/components/RegistrationPassQr";

export default function DocentesPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [career, setCareer] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    fullName: string;
    career: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!firstName.trim() || !lastName.trim()) {
      setError("Ingresa tu nombre y apellido.");
      return;
    }
    if (!career) {
      setError("Selecciona la carrera en la que impartes docencia.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "teacher",
          firstName,
          lastName,
          career,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error || "No se pudo completar el registro.");
        return;
      }
      setSuccessData({
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        career,
      });
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setFirstName("");
    setLastName("");
    setCareer("");
    setSuccessData(null);
    setError(null);
  };

  return (
    <RegistrationShell
      badge="Formulario 3 · Docentes UAM"
      title="Registro de Docentes UAM"
      subtitle="Completa tu nombre, apellido y selecciona la carrera a la que perteneces."
    >
      {successData ? (
        <div className="space-y-5 text-center text-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F17C30] text-white shadow-lg">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div>
            <span className="inline-block rounded-full bg-[#F17C30] px-3 py-1 text-xs font-bold text-white">
              DOCENTE UAM REGISTRADO
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-white">
              {successData.fullName}
            </h2>
            <p className="mt-1 text-sm font-semibold text-white/95">
              {successData.career}
            </p>
          </div>
          <div className="rounded-2xl border border-white/30 bg-white/15 p-4 text-sm font-medium text-white">
            ¡Bienvenido al Congreso FIA 2026! Su asistencia ha sido registrada.
          </div>
          <RegistrationPassQr
            categoryLabel="Docente UAM · FIA"
            fullName={successData.fullName}
            subtitle={successData.career}
            codeOrId="DOCENTE-FIA-2026"
            accentColor="#F17C30"
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="flex-1 rounded-xl border border-white/40 bg-white/15 px-4 py-3 text-sm font-bold text-white hover:bg-white/25"
            >
              Registrar otro docente
            </button>
            <Link
              href="/"
              className="flex-1 rounded-xl bg-[#F17C30] px-4 py-3 text-sm font-bold text-white shadow hover:opacity-95"
            >
              Volver al Portal
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 text-white">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="teacher-first"
                className="mb-1.5 block text-sm font-bold text-white"
              >
                Nombre
              </label>
              <input
                id="teacher-first"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full rounded-xl border border-white/40 bg-white/15 px-4 py-3 text-sm font-semibold text-white placeholder-white/60 outline-none transition focus:border-[#F17C30] focus:bg-white/25 focus:ring-2 focus:ring-[#F17C30]"
              />
            </div>

            <div>
              <label
                htmlFor="teacher-last"
                className="mb-1.5 block text-sm font-bold text-white"
              >
                Apellido
              </label>
              <input
                id="teacher-last"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Tu apellido"
                className="w-full rounded-xl border border-white/40 bg-white/15 px-4 py-3 text-sm font-semibold text-white placeholder-white/60 outline-none transition focus:border-[#F17C30] focus:bg-white/25 focus:ring-2 focus:ring-[#F17C30]"
              />
            </div>
          </div>

          <div>
            <span className="mb-2 block text-sm font-bold text-white">
              Carrera en la que es docente
            </span>
            <div className="grid gap-2.5">
              {FIA_CAREERS.map((c) => {
                const selected = career === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCareer(c)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-bold text-white transition ${
                      selected
                        ? "border-white bg-[#F17C30] shadow-md ring-2 ring-white/50"
                        : "border-white/35 bg-white/15 hover:bg-white/25"
                    }`}
                  >
                    <span>{c}</span>
                    <span
                      className={`h-4 w-4 rounded-full border-2 ${
                        selected
                          ? "border-white bg-white"
                          : "border-white/70 bg-transparent"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-white/40 bg-[#F17C30] p-3.5 text-sm font-semibold text-white">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F17C30] px-5 py-3.5 text-base font-bold text-white shadow-lg transition hover:opacity-95 disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Users className="h-5 w-5" />
            )}
            Enviar Registro
          </button>
        </form>
      )}
    </RegistrationShell>
  );
}
