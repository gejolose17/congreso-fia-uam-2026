"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Clock,
  CloudUpload,
  Download,
  GraduationCap,
  LogOut,
  QrCode,
  RefreshCw,
  Search,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";
import type { DashboardStats } from "@/lib/types";

interface DashboardClientProps {
  initialStats: DashboardStats;
}

export function DashboardClient({ initialStats }: DashboardClientProps) {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [streamConnected, setStreamConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [bannerMsg, setBannerMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  // Help desk CIF quick check
  const [helpCif, setHelpCif] = useState("");
  const [helpResult, setHelpResult] = useState<string | null>(null);

  useEffect(() => {
    const es = new EventSource("/api/admin/stream");

    es.onopen = () => setStreamConnected(true);
    es.addEventListener("stats", (ev) => {
      try {
        const parsed = JSON.parse((ev as MessageEvent).data) as DashboardStats;
        setStats(parsed);
        setStreamConnected(true);
      } catch {
        // ignore malformed frame
      }
    });
    es.onerror = () => {
      setStreamConnected(false);
    };

    return () => {
      es.close();
    };
  }, []);

  const refreshNow = async () => {
    const res = await fetch("/api/admin/stats");
    if (res.ok) {
      setStats((await res.json()) as DashboardStats);
    }
  };

  const handleSyncSheets = async () => {
    setSyncing(true);
    setBannerMsg(null);
    try {
      const res = await fetch("/api/google/sync", { method: "POST" });
      const data = (await res.json()) as {
        ok?: boolean;
        syncedStudents?: number;
        syncedRegistrations?: number;
        skippedReason?: string;
        error?: string;
      };
      if (!res.ok) {
        setBannerMsg({ type: "err", text: data.error || "Error sincronizando." });
      } else if (data.skippedReason) {
        setBannerMsg({ type: "err", text: data.skippedReason });
      } else {
        setBannerMsg({
          type: "ok",
          text: `Sincronización completada: ${data.syncedStudents || 0} estudiantes y ${
            data.syncedRegistrations || 0
          } registros enviados a Google Sheets.`,
        });
      }
      await refreshNow();
    } catch {
      setBannerMsg({ type: "err", text: "Error de red al sincronizar." });
    } finally {
      setSyncing(false);
    }
  };

  const handlePullSheets = async () => {
    setPulling(true);
    setBannerMsg(null);
    try {
      const res = await fetch("/api/google/pull", { method: "POST" });
      const data = (await res.json()) as {
        studentsImported?: number;
        companiesImported?: number;
        error?: string;
      };
      if (!res.ok) {
        setBannerMsg({
          type: "err",
          text: data.error || "No se pudo importar desde Google Sheets.",
        });
      } else {
        setBannerMsg({
          type: "ok",
          text: `Listas actualizadas desde Sheets: ${data.studentsImported || 0} estudiantes y ${
            data.companiesImported || 0
          } empresas.`,
        });
      }
      await refreshNow();
    } catch {
      setBannerMsg({ type: "err", text: "Error de red al importar." });
    } finally {
      setPulling(false);
    }
  };

  const handleHelpLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpCif.trim()) return;
    setHelpResult("Buscando...");
    try {
      const res = await fetch(
        `/api/students/lookup?cif=${encodeURIComponent(helpCif.trim())}`
      );
      const d = (await res.json()) as {
        found?: boolean;
        student?: {
          cif: string;
          fullName: string;
          career: string;
          checkedIn: boolean;
          checkedInAt: string | null;
        };
      };
      if (!d.found || !d.student) {
        setHelpResult(`CIF ${helpCif.trim()}: NO encontrado en lista de pagos.`);
      } else {
        setHelpResult(
          `${d.student.fullName} (${d.student.career}) — ${
            d.student.checkedIn ? "YA REGISTRADO" : "PAGADO · PENDIENTE DE INGRESO"
          }`
        );
      }
    } catch {
      setHelpResult("Error consultando CIF.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const studentPct =
    stats.students.totalPaid > 0
      ? Math.round((stats.students.checkedIn / stats.students.totalPaid) * 100)
      : 0;

  const maxTimeline = Math.max(
    1,
    ...stats.timeline.map((t) => t.count)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F17C30] via-[#e26e22] to-[#0099A8] pb-12 text-white">
      {/* Top Navbar with FIA.png and logo34.png */}
      <header className="sticky top-0 z-20 border-b border-white/30 bg-[#0099A8]/95 text-white shadow-lg backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F17C30] text-white shadow hover:opacity-95"
              title="Portal Público"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-1.5 shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/FIA.png"
                alt="FIA UAM"
                className="h-8 w-auto object-contain sm:h-9"
              />
              <div className="h-7 w-px bg-slate-200" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/logo34.png"
                alt="34 Aniversario UAM"
                className="h-9 w-auto object-contain sm:h-10"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white sm:text-lg">
                  Dashboard en Tiempo Real · FIA UAM
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F17C30] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
                  <span
                    className={`h-1.5 w-1.5 rounded-full bg-white ${
                      streamConnected ? "animate-pulse" : ""
                    }`}
                  />
                  {streamConnected ? "En Vivo" : "Reconectando"}
                </span>
              </div>
              <p className="text-xs text-white/90">
                Motor activo:{" "}
                <span className="font-bold uppercase">
                  {stats.storageMode}
                </span>{" "}
                · Cola pendiente a Sheets:{" "}
                <span className="font-bold text-white">
                  {stats.syncQueue.pending}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePullSheets}
              disabled={pulling}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/40 bg-white/15 px-3 py-2 text-xs font-bold text-white hover:bg-white/25 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${pulling ? "animate-spin" : ""}`}
              />
              Importar Listas
            </button>

            <button
              type="button"
              onClick={handleSyncSheets}
              disabled={syncing}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#F17C30] px-3.5 py-2 text-xs font-bold text-white shadow hover:opacity-95 disabled:opacity-50"
            >
              <CloudUpload className="h-3.5 w-3.5" />
              {syncing
                ? "Sincronizando..."
                : `Sincronizar Sheets (${stats.syncQueue.pending})`}
            </button>

            <a
              href="/api/admin/export"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/40 bg-white/15 px-3 py-2 text-xs font-bold text-white hover:bg-white/25"
            >
              <Download className="h-3.5 w-3.5" />
              CSV
            </a>

            <Link
              href="/admin/qr"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/40 bg-white/15 px-3 py-2 text-xs font-bold text-white hover:bg-white/25"
            >
              <QrCode className="h-3.5 w-3.5" />
              QRs
            </Link>

            <Link
              href="/admin/google-setup"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/40 bg-white/15 px-3 py-2 text-xs font-bold text-white hover:bg-white/25"
            >
              <Settings className="h-3.5 w-3.5" />
              Google Sheets
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1 rounded-xl bg-black/25 px-3 py-2 text-xs font-bold text-white hover:bg-black/40"
              title="Cerrar sesión"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 pt-6 sm:px-6">
        {bannerMsg && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-white/40 bg-[#0099A8] px-4 py-3 text-sm font-bold text-white shadow-lg">
            {bannerMsg.type === "ok" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-white" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-white" />
            )}
            <span>{bannerMsg.text}</span>
          </div>
        )}

        {/* 5 KPI Cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-white/35 bg-[#F17C30] p-5 text-white shadow-xl">
            <div className="flex items-center justify-between text-white">
              <span className="text-xs font-bold uppercase tracking-wider">
                Total Acreditados
              </span>
              <Activity className="h-4 w-4" />
            </div>
            <p className="mt-2 text-4xl font-black text-white">
              {stats.totalCheckedIn}
            </p>
            <p className="mt-1 text-xs text-white/95">
              Asistentes totales en evento
            </p>
          </div>

          <div className="rounded-2xl border border-white/35 bg-[#0099A8] p-5 text-white shadow-lg">
            <div className="flex items-center justify-between text-white">
              <span className="text-xs font-bold uppercase tracking-wider">
                Estudiantes UAM
              </span>
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <p className="mt-2 text-3xl font-black text-white">
              {stats.students.checkedIn}
              <span className="text-base font-semibold text-white/80">
                {" "}
                / {stats.students.totalPaid}
              </span>
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-black/20">
              <div
                className="h-full rounded-full bg-[#F17C30] transition-all"
                style={{ width: `${studentPct}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-white/90">
              {studentPct}% de pagos registrados
            </p>
          </div>

          <div className="rounded-2xl border border-white/35 bg-[#0099A8] p-5 text-white shadow-lg">
            <div className="flex items-center justify-between text-white">
              <span className="text-xs font-bold uppercase tracking-wider">
                Patrocinadores
              </span>
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <p className="mt-2 text-3xl font-black text-white">
              {stats.sponsors.total}
            </p>
            <p className="mt-1 text-xs text-white/90">
              {stats.sponsors.byCompany.length} empresas presentes
            </p>
          </div>

          <div className="rounded-2xl border border-white/35 bg-[#0099A8] p-5 text-white shadow-lg">
            <div className="flex items-center justify-between text-white">
              <span className="text-xs font-bold uppercase tracking-wider">
                Docentes UAM
              </span>
              <Users className="h-4 w-4 text-white" />
            </div>
            <p className="mt-2 text-3xl font-black text-white">
              {stats.teachers.total}
            </p>
            <p className="mt-1 text-xs text-white/90">3 carreras FIA</p>
          </div>

          <div className="rounded-2xl border border-white/35 bg-[#0099A8] p-5 text-white shadow-lg">
            <div className="flex items-center justify-between text-white">
              <span className="text-xs font-bold uppercase tracking-wider">
                Invitados
              </span>
              <UserCheck className="h-4 w-4 text-white" />
            </div>
            <p className="mt-2 text-3xl font-black text-white">
              {stats.guests.total}
            </p>
            <p className="mt-1 text-xs text-white/90">Invitados especiales</p>
          </div>
        </section>

        {/* Middle Grid: Career Breakdown + Timeline + Quick Help Desk */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Breakdown by Career */}
          <div className="rounded-2xl border border-white/35 bg-[#0099A8] p-5 text-white shadow-lg">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Asistencia por Carrera (FIA)
            </h2>
            <div className="mt-4 space-y-4">
              {Object.entries(stats.students.byCareer).map(([career, vals]) => {
                const pct =
                  vals.paid > 0
                    ? Math.round((vals.checkedIn / vals.paid) * 100)
                    : 0;
                const teacherCount = stats.teachers.byCareer[career] || 0;
                return (
                  <div key={career} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm text-white">
                      <span className="font-bold text-white">{career}</span>
                      <span className="text-xs font-semibold text-white/90">
                        {vals.checkedIn}/{vals.paid} est. · {teacherCount} doc.
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/20">
                      <div
                        className="h-full rounded-full bg-[#F17C30] transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Arrival Rhythm */}
          <div className="rounded-2xl border border-white/35 bg-[#0099A8] p-5 text-white shadow-lg">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Ritmo de Llegadas (15 min)
            </h2>
            {stats.timeline.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-xs text-white/85">
                Aún no hay registros de ingreso hoy.
              </div>
            ) : (
              <div className="mt-5 flex h-40 items-end gap-2">
                {stats.timeline.map((b) => {
                  const hPct = Math.max(10, Math.round((b.count / maxTimeline) * 100));
                  return (
                    <div
                      key={b.label}
                      className="flex flex-1 flex-col items-center gap-1"
                    >
                      <span className="text-[11px] font-bold text-white">
                        {b.count}
                      </span>
                      <div className="flex h-28 w-full items-end">
                        <div
                          className="w-full rounded-t-lg bg-[#F17C30] transition-all"
                          style={{ height: `${hPct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-white/90">
                        {b.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Help Desk + Sync Status */}
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/35 bg-[#0099A8] p-5 text-white shadow-lg">
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                Mesa de Ayuda · Consulta CIF
              </h2>
              <form onSubmit={handleHelpLookup} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={helpCif}
                  onChange={(e) => setHelpCif(e.target.value)}
                  placeholder="Buscar CIF..."
                  className="flex-1 rounded-xl border border-white/40 bg-white/15 px-3 py-2 font-mono text-sm font-bold text-white placeholder-white/60 outline-none focus:border-[#F17C30]"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#F17C30] px-3.5 py-2 text-xs font-bold text-white shadow hover:opacity-95"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
              {helpResult && (
                <p className="mt-2.5 rounded-xl bg-black/20 p-2.5 text-xs font-bold text-white">
                  {helpResult}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-white/25 bg-black/15 p-3 text-xs text-white">
              <div className="flex items-center justify-between font-bold text-white">
                <span>Última sincronización Sheets</span>
                <Clock className="h-3.5 w-3.5" />
              </div>
              <p className="mt-1 text-white/90">
                {stats.syncQueue.lastSyncAt
                  ? new Date(stats.syncQueue.lastSyncAt).toLocaleString("es-NI")
                  : "Pendiente de primera sincronización"}
              </p>
              {stats.syncQueue.lastSyncError && (
                <p className="mt-1 font-semibold text-white">
                  Nota: {stats.syncQueue.lastSyncError}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Bottom Grid: Live Activity Feed & Sponsor Companies */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/35 bg-[#0099A8] p-5 text-white shadow-lg lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                Últimos Ingresos en Tiempo Real
              </h2>
              <span className="text-xs text-white/85">
                Mostrando últimos {stats.recentActivity.length}
              </span>
            </div>

            {stats.recentActivity.length === 0 ? (
              <p className="py-10 text-center text-sm text-white/85">
                Esperando registros desde los formularios o códigos QR...
              </p>
            ) : (
              <div className="divide-y divide-white/20">
                {stats.recentActivity.map((item) => {
                  const labelMap = {
                    student: "Estudiante",
                    sponsor: "Patrocinador",
                    teacher: "Docente",
                    guest: "Invitado",
                  };

                  return (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-2 py-3 text-white"
                    >
                      <div className="flex items-center gap-3">
                        <span className="rounded-lg bg-[#F17C30] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                          {labelMap[item.type]}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-white">
                            {item.name}
                          </p>
                          <p className="text-xs text-white/90">{item.detail}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-right">
                        <span className="rounded-full bg-black/20 px-2.5 py-0.5 text-[10px] font-bold text-white">
                          {item.syncStatus === "synced"
                            ? "En Sheet"
                            : item.syncStatus === "error"
                              ? "Reintentar"
                              : "En cola"}
                        </span>
                        <span className="font-mono text-xs text-white/90">
                          {new Date(item.timestamp).toLocaleTimeString("es-NI", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/35 bg-[#0099A8] p-5 text-white shadow-lg">
            <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wider text-white">
              Patrocinadores por Empresa
            </h2>
            {stats.sponsors.byCompany.length === 0 ? (
              <p className="py-10 text-center text-xs text-white/85">
                Sin representantes de patrocinadores aún.
              </p>
            ) : (
              <div className="space-y-2.5">
                {stats.sponsors.byCompany.map((c) => (
                  <div
                    key={c.company}
                    className="flex items-center justify-between rounded-xl bg-black/15 px-3 py-2 text-xs text-white"
                  >
                    <span className="truncate font-semibold text-white">
                      {c.company}
                    </span>
                    <span className="ml-2 rounded-lg bg-[#F17C30] px-2 py-0.5 font-bold text-white">
                      {c.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
