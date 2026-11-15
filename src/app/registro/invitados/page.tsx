"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Loader2, UserCheck } from "lucide-react";
import { RegistrationShell } from "@/components/RegistrationShell";
import { RegistrationPassQr } from "@/components/RegistrationPassQr";

export default function InvitadosPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successName, setSuccessName] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!firstName.trim() || !lastName.trim()) {
      setError("Ingresa tu nombre y apellido.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "guest",
          firstName,
          lastName,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error || "No se pudo completar el registro.");
        return;
      }
      setSuccessName(`${firstName.trim()} ${lastName.trim()}`);
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setFirstName("");
    setLastName("");
    setSuccessName(null);
    setError(null);
  };

  return (
    <RegistrationShell
      badge="Formulario 4 · Invitados"
      title="Registro de Invitados"
      subtitle="Ingresa tu nombre y apellido para confirmar tu asistencia al Congreso FIA 2026."
      accentClass="bg-[#b45309]"
      accentHex="#b45309"
    >
      {successName ? (
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div>
            <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
              INVITADO REGISTRADO
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
              {successName}
            </h2>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-900">
            ¡Bienvenido al Congreso de Ingeniería y Arquitectura UAM! Tu registro se guardó correctamente.
          </div>
          <RegistrationPassQr
            categoryLabel="Invitado Especial"
            fullName={successName}
            subtitle="Congreso FIA UAM 2026"
            codeOrId="INVITADO-FIA-2026"
            accentColor="#b45309"
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Registrar otro invitado
            </button>
            <Link
              href="/"
              className="flex-1 rounded-xl bg-[#b45309] px-4 py-3 text-sm font-semibold text-white hover:bg-[#92400e]"
            >
              Volver al Portal
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="guest-first"
              className="mb-1.5 block text-sm font-bold text-slate-700"
            >
              Nombre
            </label>
            <input
              id="guest-first"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-[#b45309] focus:bg-white focus:ring-2 focus:ring-[#b45309]/20"
            />
          </div>

          <div>
            <label
              htmlFor="guest-last"
              className="mb-1.5 block text-sm font-bold text-slate-700"
            >
              Apellido
            </label>
            <input
              id="guest-last"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Tu apellido"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-[#b45309] focus:bg-white focus:ring-2 focus:ring-[#b45309]/20"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#b45309] px-5 py-3.5 text-base font-bold text-white shadow-md shadow-amber-700/20 transition hover:bg-[#92400e] disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <UserCheck className="h-5 w-5" />
            )}
            Enviar Registro
          </button>
        </form>
      )}
    </RegistrationShell>
  );
}

