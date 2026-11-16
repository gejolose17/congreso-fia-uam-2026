"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Briefcase, CheckCircle2, Loader2 } from "lucide-react";
import { RegistrationShell } from "@/components/RegistrationShell";
import { RegistrationPassQr } from "@/components/RegistrationPassQr";

export default function PatrocinadoresPage() {
  const [companies, setCompanies] = useState<string[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [company, setCompany] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    company: string;
    fullName: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then((d: { companies?: string[] }) => {
        if (d.companies) setCompanies(d.companies);
      })
      .catch(() => setError("No se pudo cargar la lista de empresas."))
      .finally(() => setLoadingCompanies(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!company) {
      setError("Selecciona tu empresa patrocinadora.");
      return;
    }
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
          category: "sponsor",
          company,
          firstName,
          lastName,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error || "No se pudo completar el registro.");
        return;
      }
      setSuccessData({
        company,
        fullName: `${firstName.trim()} ${lastName.trim()}`,
      });
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setCompany("");
    setFirstName("");
    setLastName("");
    setSuccessData(null);
    setError(null);
  };

  return (
    <RegistrationShell
      badge="Formulario 2 · Patrocinadores"
      title="Registro de Patrocinadores"
      subtitle="Selecciona tu empresa aliada e ingresa tus datos para acreditar tu asistencia."
    >
      {successData ? (
        <div className="space-y-5 text-center text-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F17C30] text-white shadow-lg">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div>
            <span className="inline-block rounded-full bg-[#F17C30] px-3 py-1 text-xs font-bold text-white">
              PATROCINADOR ACREDITADO
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-white">
              {successData.fullName}
            </h2>
            <p className="mt-1 text-sm font-semibold text-white/95">
              {successData.company}
            </p>
          </div>
          <div className="rounded-2xl border border-white/30 bg-white/15 p-4 text-sm font-medium text-white">
            Gracias por apoyar el Congreso FIA UAM 2026. Tu registro ha sido guardado.
          </div>
          <RegistrationPassQr
            categoryLabel="Patrocinador Oficial"
            fullName={successData.fullName}
            subtitle={successData.company}
            codeOrId={`PAT-${successData.company.slice(0, 8).toUpperCase()}`}
            accentColor="#F17C30"
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="flex-1 rounded-xl border border-white/40 bg-white/15 px-4 py-3 text-sm font-bold text-white hover:bg-white/25"
            >
              Registrar otra persona
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
              htmlFor="company-select"
              className="mb-1.5 block text-sm font-bold text-white"
            >
              Empresa Patrocinadora
            </label>
            <select
              id="company-select"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              disabled={loadingCompanies}
              className="w-full rounded-xl border border-white/40 bg-[#007d8a] px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-[#F17C30] focus:ring-2 focus:ring-[#F17C30]"
            >
              <option value="" className="bg-[#0099A8] text-white">
                {loadingCompanies
                  ? "Cargando lista de empresas..."
                  : "— Selecciona una empresa —"}
              </option>
              {companies.map((c) => (
                <option key={c} value={c} className="bg-[#0099A8] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="first-name"
                className="mb-1.5 block text-sm font-bold text-white"
              >
                Nombre
              </label>
              <input
                id="first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full rounded-xl border border-white/40 bg-white/15 px-4 py-3 text-sm font-semibold text-white placeholder-white/60 outline-none transition focus:border-[#F17C30] focus:bg-white/25 focus:ring-2 focus:ring-[#F17C30]"
              />
            </div>

            <div>
              <label
                htmlFor="last-name"
                className="mb-1.5 block text-sm font-bold text-white"
              >
                Apellido
              </label>
              <input
                id="last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Tu apellido"
                className="w-full rounded-xl border border-white/40 bg-white/15 px-4 py-3 text-sm font-semibold text-white placeholder-white/60 outline-none transition focus:border-[#F17C30] focus:bg-white/25 focus:ring-2 focus:ring-[#F17C30]"
              />
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
            disabled={submitting || loadingCompanies}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F17C30] px-5 py-3.5 text-base font-bold text-white shadow-lg transition hover:opacity-95 disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Briefcase className="h-5 w-5" />
            )}
            Enviar Registro
          </button>
        </form>
      )}
    </RegistrationShell>
  );
}
