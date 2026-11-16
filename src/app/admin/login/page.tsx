"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error || "PIN incorrecto.");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Error de red.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F17C30] via-[#e26e22] to-[#0099A8] px-4 text-white">
      <div className="w-full max-w-sm rounded-3xl border border-white/35 bg-[#0099A8] p-7 text-white shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/25"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Portal
          </Link>
          <div className="inline-flex items-center gap-2 rounded-xl bg-white px-2.5 py-1 shadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/image/FIA.png"
              alt="FIA UAM"
              className="h-6 w-auto object-contain"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/image/logo34.png"
              alt="34 Aniversario UAM"
              className="h-7 w-auto object-contain"
            />
          </div>
        </div>

        <div className="mt-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F17C30] text-white shadow-lg">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-xl font-extrabold text-white">
          Acceso Organizadores
        </h1>
        <p className="mt-1 text-sm text-white/95">
          Ingresa el PIN administrativo para ver el dashboard en tiempo real y configurar Google Sheets.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="admin-pin"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white"
            >
              PIN de Acceso
            </label>
            <input
              id="admin-pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              autoFocus
              className="w-full rounded-xl border border-white/40 bg-white/15 px-4 py-3 text-center font-mono text-lg font-bold tracking-widest text-white placeholder-white/60 outline-none focus:border-[#F17C30] focus:bg-white/25 focus:ring-2 focus:ring-[#F17C30]"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-[#F17C30] px-3 py-2 text-xs font-bold text-white">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F17C30] px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-95 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Ingresar al Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
