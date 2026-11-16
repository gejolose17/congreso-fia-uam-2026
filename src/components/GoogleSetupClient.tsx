"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CloudUpload,
  ExternalLink,
  FileSpreadsheet,
  KeyRound,
  Loader2,
  RefreshCw,
} from "lucide-react";
import type { GoogleSetupStatus } from "@/lib/types";

interface GoogleSetupClientProps {
  initialStatus: GoogleSetupStatus;
  connectedParam?: string;
  errorParam?: string;
}

const APPS_SCRIPT_SNIPPET = `function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sSheet = ss.getSheetByName('1_Estudiantes');
  var pSheet = ss.getSheetByName('2_Patrocinadores');
  var tSheet = ss.getSheetByName('3_Docentes');
  var gSheet = ss.getSheetByName('4_Invitados');

  var sData = sSheet.getLastRow() > 1 ? sSheet.getRange(2, 1, sSheet.getLastRow() - 1, 5).getValues() : [];
  var students = [];
  sData.forEach(function(r, idx) {
    var cif = String(r[0] || '').trim();
    var fullName = String(r[1] || '').trim();
    if (!cif && !fullName) return;
    students.push({
      cif: cif || ('SIN-CIF-' + (idx + 2)),
      fullName: fullName || ('Estudiante ' + cif),
      career: String(r[2] || 'Ingeniería Industrial').trim(),
      checkedIn: r[3] === true || String(r[3]).toUpperCase() === 'TRUE',
      checkedInAt: r[4] ? String(r[4]) : null,
      sheetRow: idx + 2
    });
  });

  var pData = pSheet.getLastRow() > 1 ? pSheet.getRange(2, 1, pSheet.getLastRow() - 1, 6).getValues() : [];
  var companies = pData.map(function(r){ return String(r[5] || '').trim(); }).filter(Boolean);

  var registrations = [];
  pData.forEach(function(r, idx) {
    if (r[0] && (r[1] || r[2])) {
      registrations.push({ id: 'sheet-sponsor-' + (idx + 2), category: 'sponsor', company: String(r[0]).trim(), firstName: String(r[1]).trim(), lastName: String(r[2]).trim(), career: null, createdAt: r[3] ? new Date(r[3]).toISOString() : new Date().toISOString() });
    }
  });

  var tData = tSheet && tSheet.getLastRow() > 1 ? tSheet.getRange(2, 1, tSheet.getLastRow() - 1, 4).getValues() : [];
  tData.forEach(function(r, idx) {
    if (r[0] || r[1]) {
      registrations.push({ id: 'sheet-teacher-' + (idx + 2), category: 'teacher', company: null, firstName: String(r[0]).trim(), lastName: String(r[1]).trim(), career: String(r[2] || '').trim(), createdAt: r[3] ? new Date(r[3]).toISOString() : new Date().toISOString() });
    }
  });

  var gData = gSheet && gSheet.getLastRow() > 1 ? gSheet.getRange(2, 1, gSheet.getLastRow() - 1, 3).getValues() : [];
  gData.forEach(function(r, idx) {
    if (r[0] || r[1]) {
      registrations.push({ id: 'sheet-guest-' + (idx + 2), category: 'guest', company: null, firstName: String(r[0]).trim(), lastName: String(r[1]).trim(), career: null, createdAt: r[2] ? new Date(r[2]).toISOString() : new Date().toISOString() });
    }
  });

  return ContentService.createTextOutput(JSON.stringify({ students: students, companies: companies, registrations: registrations })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var body = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (body.students && body.students.length) {
    var sSheet = ss.getSheetByName('1_Estudiantes');
    body.students.forEach(function(s) {
      if (s.sheetRow) {
        sSheet.getRange(s.sheetRow, 4, 1, 2).setValues([[true, s.checkedInAt]]);
      }
    });
  }
  if (body.registrations && body.registrations.length) {
    body.registrations.forEach(function(r) {
      if (r.category === 'sponsor') ss.getSheetByName('2_Patrocinadores').appendRow([r.company, r.firstName, r.lastName, r.createdAt]);
      if (r.category === 'teacher') ss.getSheetByName('3_Docentes').appendRow([r.firstName, r.lastName, r.career, r.createdAt]);
      if (r.category === 'guest') ss.getSheetByName('4_Invitados').appendRow([r.firstName, r.lastName, r.createdAt]);
    });
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}`;

export function GoogleSetupClient({
  initialStatus,
  connectedParam,
  errorParam,
}: GoogleSetupClientProps) {
  const [status, setStatus] = useState<GoogleSetupStatus>(initialStatus);
  const [spreadsheetInput, setSpreadsheetInput] = useState(
    initialStatus.spreadsheetId || ""
  );
  const [appsScriptInput, setAppsScriptInput] = useState(
    initialStatus.appsScriptUrl || ""
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(
    connectedParam
      ? { type: "ok", text: "¡Cuenta de Google conectada correctamente!" }
      : errorParam
        ? { type: "err", text: `Error OAuth: ${errorParam}` }
        : null
  );

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy("save");
    setFeedback(null);
    try {
      const res = await fetch("/api/google/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spreadsheetId: spreadsheetInput,
          appsScriptUrl: appsScriptInput,
        }),
      });
      const data = (await res.json()) as {
        status?: GoogleSetupStatus;
        error?: string;
      };
      if (!res.ok) {
        setFeedback({ type: "err", text: data.error || "Error guardando." });
      } else if (data.status) {
        setStatus(data.status);
        setSpreadsheetInput(data.status.spreadsheetId || "");
        setFeedback({ type: "ok", text: "Configuración guardada." });
      }
    } finally {
      setBusy(null);
    }
  };

  const handleCreateSheet = async () => {
    setBusy("create");
    setFeedback(null);
    try {
      const res = await fetch("/api/google/create-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Congreso FIA UAM 2026 - Registro Oficial",
        }),
      });
      const data = (await res.json()) as {
        spreadsheetId?: string;
        error?: string;
      };
      if (!res.ok) {
        setFeedback({ type: "err", text: data.error || "Error creando Sheet." });
      } else if (data.spreadsheetId) {
        setSpreadsheetInput(data.spreadsheetId);
        setStatus((s) => ({ ...s, spreadsheetId: data.spreadsheetId! }));
        setFeedback({
          type: "ok",
          text: `¡Google Sheet creado con las 4 hojas! ID: ${data.spreadsheetId}`,
        });
      }
    } finally {
      setBusy(null);
    }
  };

  const handlePull = async () => {
    setBusy("pull");
    setFeedback(null);
    try {
      const res = await fetch("/api/google/pull", { method: "POST" });
      const data = (await res.json()) as {
        studentsImported?: number;
        companiesImported?: number;
        error?: string;
      };
      if (!res.ok) {
        setFeedback({ type: "err", text: data.error || "Error importando." });
      } else {
        setFeedback({
          type: "ok",
          text: `Importados ${data.studentsImported || 0} estudiantes y ${
            data.companiesImported || 0
          } empresas desde tu Google Sheet.`,
        });
      }
    } finally {
      setBusy(null);
    }
  };

  const handleSync = async () => {
    setBusy("sync");
    setFeedback(null);
    try {
      const res = await fetch("/api/google/sync", { method: "POST" });
      const data = (await res.json()) as {
        syncedStudents?: number;
        syncedRegistrations?: number;
        skippedReason?: string;
        error?: string;
      };
      if (!res.ok || data.skippedReason) {
        setFeedback({
          type: "err",
          text: data.error || data.skippedReason || "No se pudo sincronizar.",
        });
      } else {
        setFeedback({
          type: "ok",
          text: `Sincronizado: ${data.syncedStudents || 0} checks de estudiantes y ${
            data.syncedRegistrations || 0
          } registros nuevos.`,
        });
      }
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003b71] hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver al Dashboard
            </Link>
            <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
              Conexión con Cuenta Google y Hoja de Cálculo
            </h1>
            <p className="text-sm text-slate-600">
              Administra los permisos OAuth (`/api/auth/google`), crea o vincula tu Google Sheet de 4 pestañas y sincroniza los registros.
            </p>
          </div>
        </div>

        {feedback && (
          <div
            className={`rounded-2xl border p-4 text-sm font-medium ${
              feedback.type === "ok"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Section 1: OAuth 2.0 Direct Route */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#003b71] text-white">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  1. Permiso directo de Google (OAuth 2.0)
                </h2>
                <p className="text-xs text-slate-500">
                  {status.hasRefreshToken
                    ? `Conectado como ${status.connectedEmail || "Cuenta Google"}`
                    : status.oauthConfigured
                      ? "Credenciales OAuth listas. Haz clic para autorizar tu cuenta."
                      : "Falta definir GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en .env.local (o usa el Puente Apps Script abajo)."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href="/api/auth/google"
                className="inline-flex items-center gap-2 rounded-xl bg-[#003b71] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#002a52]"
              >
                {status.hasRefreshToken
                  ? "Reconectar Cuenta Google"
                  : "Dar permiso a Google"}
              </a>
              {status.hasRefreshToken && (
                <button
                  type="button"
                  onClick={handleCreateSheet}
                  disabled={busy === "create"}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {busy === "create" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="h-4 w-4" />
                  )}
                  Crear Nuevo Sheet (4 Hojas)
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            URI de redirección autorizada para Google Cloud Console:{" "}
            <code className="font-mono font-bold text-slate-800">
              {typeof window !== "undefined"
                ? `${window.location.origin}/api/auth/google/callback`
                : "/api/auth/google/callback"}
            </code>
          </div>
        </section>

        {/* Section 2: Linked Spreadsheet & Actions */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900">
            2. Hoja de Cálculo Vinculada (4 Hojas: Estudiantes, Patrocinadores, Docentes, Invitados)
          </h2>

          <form onSubmit={handleSaveConfig} className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                ID o URL del Google Sheet
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={spreadsheetInput}
                  onChange={(e) => setSpreadsheetInput(e.target.value)}
                  placeholder="1LIg8NUKe-Iznb_tVulvpQywh0sUzIWc49jhkRIg-K-E"
                  className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-mono text-xs text-slate-800 outline-none focus:border-[#003b71]"
                />
                {status.spreadsheetId && (
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${status.spreadsheetId}/edit`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Abrir Sheet
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Alternativa Cero-OAuth: URL de Google Apps Script (Opcional)
              </label>
              <input
                type="url"
                value={appsScriptInput}
                onChange={(e) => setAppsScriptInput(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-mono text-xs text-slate-800 outline-none focus:border-[#003b71]"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="submit"
                disabled={busy === "save"}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
              >
                <CheckCircle2 className="h-4 w-4" />
                Guardar Vínculo
              </button>

              <button
                type="button"
                onClick={handlePull}
                disabled={busy === "pull"}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${busy === "pull" ? "animate-spin" : ""}`}
                />
                Importar Estudiantes y Empresas
              </button>

              <button
                type="button"
                onClick={handleSync}
                disabled={busy === "sync"}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#008b9a] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#007380]"
              >
                <CloudUpload className="h-4 w-4" />
                Sincronizar Pendientes Ahora
              </button>
            </div>
          </form>
        </section>

        {/* Section 3: Apps Script Quick Bridge Guide */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900">
            Opción Rápida sin Google Cloud Console (Google Apps Script)
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Si no quieres configurar un proyecto en Google Cloud para OAuth, abre tu Google Sheet &rarr; <strong>Extensiones &rarr; Apps Script</strong>, pega este código, impleméntalo como <em>Aplicación Web</em> (Acceso: Cualquier usuario) y pega la URL arriba:
          </p>
          <pre className="mt-3 max-h-60 overflow-auto rounded-xl bg-slate-900 p-4 font-mono text-[11px] leading-relaxed text-slate-100">
            {APPS_SCRIPT_SNIPPET}
          </pre>
        </section>
      </div>
    </div>
  );
}

