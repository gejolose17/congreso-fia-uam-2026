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
    >
      {successName ? (
        <div className="space-y-5 text-center text-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F17C30] text-white shadow-lg">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div>
            <span className="inline-block rounded-full bg-[#F17C30] px-3 py-1 text-xs font-bold text-white">
              INVITADO REGISTRADO
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-white">
              {successName}
            </h2>
          </div>
          <div className="rounded-2xl border border-white/30 bg-white/15 p-4 text-sm font-medium text-white">
            ¡Bienvenido al Congreso de Ingeniería y Arquitectura UAM! Tu registro se guardó correctamente.
          </div>
          <RegistrationPassQr
            categoryLabel="Invitado Especial"
            fullName={successName}
            subtitle="Congreso FIA UAM 2026"
            codeOrId="INVITADO-FIA-2026"
            accentColor="#F17C30"
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="flex-1 rounded-xl border border-white/40 bg-white/15 px-4 py-3 text-sm font-bold text-white hover:bg-white/25"
            >
              Registrar otro invitado
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
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          <div>
            <label
              htmlFor="guest-first"
              className="mb-1.5 block text-sm font-bold text-white"
            >
              Nombre
            </label>
            <input
              id="guest-first"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full rounded-xl border border-white/40 bg-white/15 px-4 py-3 text-sm font-semibold text-white placeholder-white/60 outline-none transition focus:border-[#F17C30] focus:bg-white/25 focus:ring-2 focus:ring-[#F17C30]"
            />
          </div>

          <div>
            <label
              htmlFor="guest-last"
              className="mb-1.5 block text-sm font-bold text-white"
            >
              Apellido
            </label>
            <input
              id="guest-last"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Tu apellido"
              className="w-full rounded-xl border border-white/40 bg-white/15 px-4 py-3 text-sm font-semibold text-white placeholder-white/60 outline-none transition focus:border-[#F17C30] focus:bg-white/25 focus:ring-2 focus:ring-[#F17C30]"
            />
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
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F17C30] px-5 py-3.5 text-base font-bold text-white shadow-lg transition hover:opacity-95 disabled:opacity-60"
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
