"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Lock,
  Search,
  UserCheck,
  XCircle,
} from "lucide-react";
import { RegistrationShell } from "@/components/RegistrationShell";
import { RegistrationPassQr } from "@/components/RegistrationPassQr";

interface StudentLookupData {
  cif: string;
  fullName: string;
  career: string;
  checkedIn: boolean;
  checkedInAt: string | null;
}

export default function EstudiantesPage() {
  const [cif, setCif] = useState("");
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [student, setStudent] = useState<StudentLookupData | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [blockedDuplicate, setBlockedDuplicate] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = cif.trim();
    if (!trimmed) {
      setLookupError("Por favor ingresa tu número de CIF.");
      return;
    }

    setSearching(true);
    setLookupError(null);
    setNotFound(false);
    setStudent(null);
    setConfirmed(false);
    setBlockedDuplicate(false);

    try {
      const res = await fetch(
        `/api/students/lookup?cif=${encodeURIComponent(trimmed)}`
      );
      const data = (await res.json()) as {
        found?: boolean;
        student?: StudentLookupData;
        error?: string;
      };

      if (!res.ok) {
        setLookupError(data.error || "Error al consultar el CIF.");
        return;
      }

      if (!data.found || !data.student) {
        setNotFound(true);
        return;
      }

      setStudent(data.student);
      if (data.student.checkedIn) {
        setBlockedDuplicate(true);
      }
    } catch {
      setLookupError("No hay conexión con el servidor. Intenta de nuevo.");
    } finally {
      setSearching(false);
    }
  };

  const handleConfirmCheckIn = async () => {
    if (!student || student.checkedIn) return;
    setSubmitting(true);
    setLookupError(null);

    try {
      const res = await fetch("/api/students/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cif: student.cif }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        code?: string;
        error?: string;
        student?: StudentLookupData;
      };

      if (res.status === 409 || data.code === "ALREADY_REGISTERED") {
        setBlockedDuplicate(true);
        if (data.student) setStudent(data.student);
        return;
      }

      if (!res.ok) {
        setLookupError(data.error || "No se pudo registrar tu ingreso.");
        return;
      }

      if (data.student) setStudent(data.student);
      setConfirmed(true);
    } catch {
      setLookupError("Error de red al confirmar. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setCif("");
    setStudent(null);
    setNotFound(false);
    setConfirmed(false);
    setBlockedDuplicate(false);
    setLookupError(null);
  };

  return (
    <RegistrationShell
      badge="Formulario 1 · Estudiantes"
      title="Registro de Estudiantes UAM"
      subtitle="Ingresa tu número de CIF para verificar tu inscripción pagada y confirmar asistencia."
    >
      {confirmed && student ? (
        <div className="space-y-5 text-center text-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F17C30] text-white shadow-lg">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div>
            <span className="inline-block rounded-full bg-[#F17C30] px-3 py-1 text-xs font-bold text-white">
              ASISTENCIA CONFIRMADA
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-white">
              {student.fullName}
            </h2>
            <p className="mt-1 text-sm font-medium text-white/90">
              CIF: <span className="font-mono font-bold">{student.cif}</span> ·{" "}
              {student.career}
            </p>
          </div>

          <div className="rounded-2xl border border-white/30 bg-white/15 p-4 text-sm font-medium text-white">
            Tu ingreso quedó registrado correctamente en el sistema del congreso. ¡Bienvenido!
          </div>

          <RegistrationPassQr
            categoryLabel="Estudiante UAM"
            fullName={student.fullName}
            subtitle={student.career}
            codeOrId={`CIF-${student.cif}`}
            accentColor="#F17C30"
          />

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 rounded-xl border border-white/40 bg-white/15 px-4 py-3 text-sm font-bold text-white hover:bg-white/25"
            >
              Registrar otro estudiante
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
        <div className="space-y-6 text-white">
          <form onSubmit={handleLookup} className="space-y-3">
            <label
              htmlFor="cif-input"
              className="block text-sm font-bold text-white"
            >
              Número de CIF (Estudiante)
            </label>
            <div className="flex gap-2">
              <input
                id="cif-input"
                type="text"
                inputMode="numeric"
                value={cif}
                onChange={(e) => {
                  setCif(e.target.value);
                  setNotFound(false);
                  setLookupError(null);
                  if (student) {
                    setStudent(null);
                    setBlockedDuplicate(false);
                  }
                }}
                placeholder="Ej. 20210001"
                className="flex-1 rounded-xl border border-white/40 bg-white/15 px-4 py-3 font-mono text-base font-bold text-white placeholder-white/60 outline-none transition focus:border-[#F17C30] focus:bg-white/25 focus:ring-2 focus:ring-[#F17C30]"
                autoFocus
              />
              <button
                type="submit"
                disabled={searching}
                className="inline-flex items-center gap-2 rounded-xl bg-[#F17C30] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-60"
              >
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Buscar
              </button>
            </div>
            <p className="text-xs text-white/90">
              Solo podrán registrarse estudiantes que figuren en la lista oficial de pagos confirmados.
            </p>
          </form>

          {lookupError && (
            <div className="flex items-start gap-3 rounded-2xl border border-white/40 bg-[#F17C30] p-4 text-sm font-semibold text-white">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-white" />
              <p>{lookupError}</p>
            </div>
          )}

          {notFound && (
            <div className="rounded-2xl border border-white/40 bg-[#F17C30] p-5 text-center text-white">
              <XCircle className="mx-auto h-10 w-10 text-white" />
              <h3 className="mt-2 text-base font-bold text-white">
                CIF no encontrado en la lista
              </h3>
              <p className="mt-1 text-sm text-white/95">
                El CIF <span className="font-mono font-bold">{cif}</span> no aparece registrado con pago confirmado. Por favor acércate a la mesa de verificación para ayudarte.
              </p>
            </div>
          )}

          {student && blockedDuplicate && (
            <div className="rounded-2xl border border-white/40 bg-[#F17C30] p-5 text-white">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/20 text-white">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                    Registro Bloqueado · Ingreso Duplicado
                  </span>
                  <h3 className="mt-0.5 text-base font-extrabold text-white">
                    {student.fullName}
                  </h3>
                  <p className="text-xs font-medium text-white/90">
                    {student.career} · CIF {student.cif}
                  </p>
                  <p className="mt-2 text-sm text-white">
                    Este estudiante ya marcó su asistencia anteriormente
                    {student.checkedInAt
                      ? ` (${new Date(student.checkedInAt).toLocaleTimeString("es-NI", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })})`
                      : ""}
                    . No es posible enviar el registro dos veces.
                  </p>
                </div>
              </div>
            </div>
          )}

          {student && !blockedDuplicate && (
            <div className="space-y-4 rounded-2xl border border-white/40 bg-white/15 p-5 text-white">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F17C30] text-white shadow">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                    Estudiante Verificado
                  </span>
                  <h3 className="text-lg font-extrabold text-white">
                    {student.fullName}
                  </h3>
                  <p className="text-sm font-semibold text-white">
                    Carrera: {student.career}
                  </p>
                  <p className="text-xs text-white/90">
                    CIF: <span className="font-mono font-bold">{student.cif}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmCheckIn}
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F17C30] px-5 py-3.5 text-base font-bold text-white shadow-lg transition hover:opacity-95 disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <UserCheck className="h-5 w-5" />
                )}
                Enviar y Confirmar Asistencia
              </button>
            </div>
          )}
        </div>
      )}
    </RegistrationShell>
  );
}
