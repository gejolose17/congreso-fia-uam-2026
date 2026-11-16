"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Lock,
  UserCheck,
  XCircle,
} from "lucide-react";
import { RegistrationShell } from "@/components/RegistrationShell";

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

  // Automatic lookup when CIF has at least 4 characters (debounced for mobile convenience)
  useEffect(() => {
    const trimmed = cif.trim();
    if (trimmed.length < 4) {
      setStudent(null);
      setNotFound(false);
      setBlockedDuplicate(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      setLookupError(null);
      try {
        const res = await fetch(
          `/api/students/lookup?cif=${encodeURIComponent(trimmed)}`
        );
        const data = (await res.json()) as {
          found?: boolean;
          student?: StudentLookupData;
        };
        if (res.ok && data.found && data.student) {
          setStudent(data.student);
          setNotFound(false);
          setBlockedDuplicate(Boolean(data.student.checkedIn));
        } else {
          setStudent(null);
        }
      } catch {
        // silent on background typing lookup
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [cif]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = cif.trim();
    if (!trimmed) {
      setLookupError("Por favor ingresa tu número de CIF.");
      return;
    }

    setSubmitting(true);
    setLookupError(null);
    setNotFound(false);

    try {
      // Confirm check-in directly (API validates existence and duplicate status atomically)
      const res = await fetch("/api/students/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cif: trimmed }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        code?: string;
        error?: string;
        student?: StudentLookupData;
      };

      if (res.status === 404 || data.code === "NOT_FOUND") {
        setStudent(null);
        setNotFound(true);
        return;
      }

      if (res.status === 409 || data.code === "ALREADY_REGISTERED") {
        if (data.student) setStudent(data.student);
        setBlockedDuplicate(true);
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
      badge="Formulario 1 · Estudiantes UAM"
      title="Registro de ingreso"
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
            <h2 className="mt-2 text-xl font-extrabold text-white sm:text-2xl">
              {student.fullName}
            </h2>
            <p className="mt-1 text-sm font-medium text-white/95">
              CIF: <span className="font-mono font-bold">{student.cif}</span> ·{" "}
              {student.career}
            </p>
          </div>

          <div className="rounded-2xl border border-white/30 bg-white/15 p-4 text-sm font-medium text-white">
            Tu ingreso quedó registrado correctamente en el sistema del congreso. ¡Bienvenido!
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="w-full rounded-xl bg-[#F17C30] px-4 py-3.5 text-base font-bold text-white shadow-lg transition active:scale-[0.99] hover:opacity-95"
          >
            Nuevo registro
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 text-white">
          <div className="space-y-2">
            <label
              htmlFor="cif-input"
              className="block text-sm font-bold text-white sm:text-base"
            >
              Número de CIF (Estudiante)
            </label>
            <input
              id="cif-input"
              type="text"
              inputMode="numeric"
              value={cif}
              onChange={(e) => {
                setCif(e.target.value);
                setNotFound(false);
                setLookupError(null);
              }}
              placeholder=""
              className="w-full rounded-xl border-2 border-white bg-white px-4 py-3.5 font-mono text-base font-bold text-slate-900 shadow-inner outline-none transition focus:border-[#F17C30] focus:ring-2 focus:ring-[#F17C30]"
              autoFocus
            />
          </div>

          {lookupError && (
            <div className="flex items-start gap-3 rounded-2xl border border-white/40 bg-[#F17C30] p-4 text-sm font-semibold text-white">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-white" />
              <p>{lookupError}</p>
            </div>
          )}

          {notFound && (
            <div className="rounded-2xl border border-white/40 bg-[#F17C30] p-4 text-center text-white">
              <XCircle className="mx-auto h-9 w-9 text-white" />
              <h3 className="mt-1.5 text-base font-bold text-white">
                CIF no encontrado en la lista
              </h3>
              <p className="mt-1 text-xs text-white/95 sm:text-sm">
                El CIF <span className="font-mono font-bold">{cif}</span> no aparece registrado con pago confirmado. Acércate a la mesa de verificación.
              </p>
            </div>
          )}

          {student && blockedDuplicate && (
            <div className="rounded-2xl border border-white/40 bg-[#F17C30] p-4 text-white">
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
                  <p className="mt-1.5 text-xs text-white sm:text-sm">
                    Este estudiante ya marcó su asistencia anteriormente. No es posible enviar el registro dos veces.
                  </p>
                </div>
              </div>
            </div>
          )}

          {student && !blockedDuplicate && (
            <div className="rounded-2xl border border-white/40 bg-white/15 p-4 text-white">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F17C30] text-white shadow">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                    Estudiante Verificado
                  </span>
                  <h3 className="text-base font-extrabold text-white sm:text-lg">
                    {student.fullName}
                  </h3>
                  <p className="text-xs font-semibold text-white sm:text-sm">
                    Carrera: {student.career}
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || searching || blockedDuplicate}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F17C30] px-5 py-4 text-base font-extrabold text-white shadow-lg transition active:scale-[0.99] hover:opacity-95 disabled:opacity-60"
          >
            {submitting || searching ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <UserCheck className="h-5 w-5" />
            )}
            Confirmar registro
          </button>
        </form>
      )}
    </RegistrationShell>
  );
}
