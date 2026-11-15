import {
  DEFAULT_COMPANIES,
  DEFAULT_SPREADSHEET_ID,
  SHEET_NAMES,
} from "./constants";
import {
  getConfigValue,
  getMultipleConfigValues,
  getPendingSyncItems,
  markRegistrationsSyncStatus,
  markStudentsSyncStatus,
  replaceCompaniesFromSheet,
  setConfigValue,
  upsertStudentsFromSheet,
} from "./db";
import type { GoogleSetupStatus } from "./types";

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/userinfo.email",
].join(" ");

function formatManaguaTimestamp(iso: string | null): string {
  const d = iso ? new Date(iso) : new Date();
  return new Intl.DateTimeFormat("es-NI", {
    timeZone: "America/Managua",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d);
}

export function isOAuthConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );
}

export function getGoogleAuthUrl(origin: string, state: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("Falta configurar GOOGLE_CLIENT_ID en las variables de entorno.");
  }
  const redirectUri = `${origin}/api/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GOOGLE_SCOPES,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeCodeForTokens(
  code: string,
  origin: string
): Promise<{ email: string | null }> {
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const redirectUri = `${origin}/api/auth/google/callback`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`Error al intercambiar código OAuth: ${err}`);
  }

  const tokens = (await tokenRes.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };

  const expiresAt = Date.now() + (tokens.expires_in - 60) * 1000;
  await setConfigValue("google_access_token", tokens.access_token);
  await setConfigValue("google_token_expires_at", String(expiresAt));
  if (tokens.refresh_token) {
    await setConfigValue("google_refresh_token", tokens.refresh_token);
  }

  let email: string | null = null;
  try {
    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );
    if (userRes.ok) {
      const user = (await userRes.json()) as { email?: string };
      if (user.email) {
        email = user.email;
        await setConfigValue("google_email", email);
      }
    }
  } catch {
    // non-fatal
  }

  return { email };
}

async function getValidAccessToken(): Promise<string | null> {
  const cfg = await getMultipleConfigValues([
    "google_access_token",
    "google_refresh_token",
    "google_token_expires_at",
  ]);

  const now = Date.now();
  const expiresAt = Number(cfg.google_token_expires_at || "0");
  if (cfg.google_access_token && expiresAt > now) {
    return cfg.google_access_token;
  }

  if (!cfg.google_refresh_token || !isOAuthConfigured()) {
    return null;
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: cfg.google_refresh_token,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Error renovando token de Google: ${txt}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  await setConfigValue("google_access_token", data.access_token);
  await setConfigValue(
    "google_token_expires_at",
    String(Date.now() + (data.expires_in - 60) * 1000)
  );
  return data.access_token;
}

export async function getGoogleSetupStatus(): Promise<GoogleSetupStatus> {
  const cfg = await getMultipleConfigValues([
    "google_email",
    "google_refresh_token",
    "google_spreadsheet_id",
    "google_apps_script_url",
    "google_last_pull_at",
    "google_last_sync_at",
    "google_last_sync_error",
  ]);

  return {
    oauthConfigured: isOAuthConfigured(),
    connectedEmail: cfg.google_email,
    hasRefreshToken: Boolean(cfg.google_refresh_token),
    spreadsheetId: cfg.google_spreadsheet_id || DEFAULT_SPREADSHEET_ID || null,
    appsScriptUrl:
      cfg.google_apps_script_url || process.env.GOOGLE_APPS_SCRIPT_URL || null,
    lastPullAt: cfg.google_last_pull_at,
    lastSyncAt: cfg.google_last_sync_at,
    lastSyncError: cfg.google_last_sync_error,
  };
}

export async function createCongressSpreadsheet(title?: string): Promise<{
  spreadsheetId: string;
  spreadsheetUrl: string;
}> {
  const token = await getValidAccessToken();
  if (!token) {
    throw new Error(
      "Primero debes conectar tu cuenta de Google en la ruta /api/auth/google."
    );
  }

  const docTitle =
    title?.trim() || "Congreso FIA UAM 2026 - Registro Oficial";

  const createRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        title: docTitle,
        timeZone: "America/Managua",
      },
      sheets: [
        { properties: { sheetId: 0, title: SHEET_NAMES.students, gridProperties: { frozenRowCount: 1 } } },
        { properties: { sheetId: 1, title: SHEET_NAMES.sponsors, gridProperties: { frozenRowCount: 1 } } },
        { properties: { sheetId: 2, title: SHEET_NAMES.teachers, gridProperties: { frozenRowCount: 1 } } },
        { properties: { sheetId: 3, title: SHEET_NAMES.guests, gridProperties: { frozenRowCount: 1 } } },
      ],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`No se pudo crear el Google Sheet: ${err}`);
  }

  const created = (await createRes.json()) as {
    spreadsheetId: string;
    spreadsheetUrl: string;
  };

  // Populate headers + 23 sample companies in Sheet 2 column F + checkboxes on Sheet 1
  const sponsorsRows: string[][] = [
    ["Empresa", "Nombre", "Apellido", "Fecha/Hora Registro", "", "Lista_Empresas (23 de prueba - Editar aquí)"],
    ...DEFAULT_COMPANIES.map((c) => ["", "", "", "", "", c]),
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${created.spreadsheetId}/values:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        valueInputOption: "USER_ENTERED",
        data: [
          {
            range: `${SHEET_NAMES.students}!A1:E1`,
            values: [["CIF", "Nombre Completo", "Carrera", "Check", "Fecha/Hora Registro"]],
          },
          {
            range: `${SHEET_NAMES.sponsors}!A1:F${sponsorsRows.length}`,
            values: sponsorsRows,
          },
          {
            range: `${SHEET_NAMES.teachers}!A1:D1`,
            values: [["Nombre", "Apellido", "Carrera", "Fecha/Hora Registro"]],
          },
          {
            range: `${SHEET_NAMES.guests}!A1:C1`,
            values: [["Nombre", "Apellido", "Fecha/Hora Registro"]],
          },
        ],
      }),
    }
  );

  // Apply UAM header colors & boolean checkboxes
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${created.spreadsheetId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          ...[0, 1, 2, 3].map((sheetId) => ({
            repeatCell: {
              range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 6 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0, green: 0.23, blue: 0.44 },
                  textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true },
                  horizontalAlignment: "CENTER",
                },
              },
              fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
            },
          })),
          {
            setDataValidation: {
              range: { sheetId: 0, startRowIndex: 1, endRowIndex: 600, startColumnIndex: 3, endColumnIndex: 4 },
              rule: { condition: { type: "BOOLEAN" }, showCustomUi: true, strict: true },
            },
          },
        ],
      }),
    }
  );

  await setConfigValue("google_spreadsheet_id", created.spreadsheetId);
  return {
    spreadsheetId: created.spreadsheetId,
    spreadsheetUrl: created.spreadsheetUrl,
  };
}

// ---------- Pull Students & Companies from Google Sheets ----------

export async function pullFromGoogleSheets(): Promise<{
  studentsImported: number;
  companiesImported: number;
}> {
  const status = await getGoogleSetupStatus();
  const spreadsheetId = status.spreadsheetId;

  // Option 1: Apps Script Bridge
  if (status.appsScriptUrl && !status.hasRefreshToken) {
    const res = await fetch(`${status.appsScriptUrl}?action=pull`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Error Apps Script pull (${res.status})`);
    }
    const data = (await res.json()) as {
      students?: Array<{
        cif: string;
        fullName: string;
        career: string;
        checkedIn: boolean;
        checkedInAt?: string | null;
        sheetRow: number;
      }>;
      companies?: string[];
    };
    const sCount = data.students
      ? await upsertStudentsFromSheet(
          data.students.map((s) => ({
            ...s,
            checkedInAt: s.checkedInAt || null,
          }))
        )
      : 0;
    const cCount = data.companies
      ? await replaceCompaniesFromSheet(data.companies)
      : 0;
    await setConfigValue("google_last_pull_at", new Date().toISOString());
    return { studentsImported: sCount, companiesImported: cCount };
  }

  // Option 2: Direct Google Sheets OAuth API
  const token = await getValidAccessToken();
  if (!token || !spreadsheetId) {
    throw new Error(
      "No hay conexión activa con Google Sheets. Conecta tu cuenta OAuth o configura la URL de Apps Script."
    );
  }

  const ranges = [
    `${SHEET_NAMES.students}!A2:E`,
    `${SHEET_NAMES.sponsors}!F2:F`,
  ]
    .map((r) => `ranges=${encodeURIComponent(r)}`)
    .join("&");

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?${ranges}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Error leyendo Google Sheets: ${err}`);
  }

  const body = (await res.json()) as {
    valueRanges: Array<{ values?: string[][] }>;
  };

  const studentRows = body.valueRanges[0]?.values || [];
  const companyRows = body.valueRanges[1]?.values || [];

  const parsedStudents = studentRows
    .map((row, idx) => {
      const cif = String(row[0] || "").trim();
      const fullName = String(row[1] || "").trim();
      const career = String(row[2] || "").trim();
      const rawCheck = String(row[3] || "").trim().toUpperCase();
      const checkedIn = rawCheck === "TRUE" || rawCheck === "1" || rawCheck === "SI" || rawCheck === "✓";
      const checkedInAt = row[4] ? String(row[4]).trim() : null;
      return {
        cif,
        fullName,
        career: career || "Ingeniería Industrial",
        checkedIn,
        checkedInAt,
        sheetRow: idx + 2,
      };
    })
    .filter((s) => s.cif.length > 0 && s.fullName.length > 0);

  const parsedCompanies = companyRows
    .map((row) => String(row[0] || "").trim())
    .filter((name) => name.length > 0);

  const studentsImported = await upsertStudentsFromSheet(parsedStudents);
  const companiesImported =
    parsedCompanies.length > 0
      ? await replaceCompaniesFromSheet(parsedCompanies)
      : 0;

  await setConfigValue("google_last_pull_at", new Date().toISOString());
  return { studentsImported, companiesImported };
}

// ---------- Batch Sync Queue to Google Sheets (Rate-Limit Safe) ----------

const globalSyncLock = globalThis as unknown as {
  __fiaSyncInFlight?: Promise<SyncResult> | null;
  __fiaSyncTimer?: NodeJS.Timeout | null;
};

export interface SyncResult {
  syncedStudents: number;
  syncedRegistrations: number;
  skippedReason?: string;
}

export async function syncPendingToGoogleSheets(): Promise<SyncResult> {
  if (globalSyncLock.__fiaSyncInFlight) {
    return globalSyncLock.__fiaSyncInFlight;
  }

  const run = async (): Promise<SyncResult> => {
    const pending = await getPendingSyncItems();
    if (
      pending.students.length === 0 &&
      pending.registrations.length === 0
    ) {
      return { syncedStudents: 0, syncedRegistrations: 0 };
    }

    const status = await getGoogleSetupStatus();

    // Path A: Apps Script Bridge
    if (status.appsScriptUrl && !status.hasRefreshToken) {
      try {
        const res = await fetch(status.appsScriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "sync",
            students: pending.students.map((s) => ({
              cif: s.cif,
              checkedInAt: formatManaguaTimestamp(s.checkedInAt),
              sheetRow: s.sheetRow,
            })),
            registrations: pending.registrations.map((r) => ({
              id: r.id,
              category: r.category,
              company: r.company,
              firstName: r.firstName,
              lastName: r.lastName,
              career: r.career,
              createdAt: formatManaguaTimestamp(r.createdAt),
            })),
          }),
        });
        if (!res.ok) throw new Error(`Apps Script HTTP ${res.status}`);

        await markStudentsSyncStatus(
          pending.students.map((s) => s.cif),
          "synced"
        );
        await markRegistrationsSyncStatus(
          pending.registrations.map((r) => r.id),
          "synced"
        );
        await setConfigValue("google_last_sync_at", new Date().toISOString());
        await setConfigValue("google_last_sync_error", "");
        return {
          syncedStudents: pending.students.length,
          syncedRegistrations: pending.registrations.length,
        };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error Apps Script";
        await setConfigValue("google_last_sync_error", msg);
        return {
          syncedStudents: 0,
          syncedRegistrations: 0,
          skippedReason: msg,
        };
      }
    }

    // Path B: Direct OAuth 2.0 Sheets API
    const token = await getValidAccessToken().catch((err) => {
      void setConfigValue(
        "google_last_sync_error",
        err instanceof Error ? err.message : "Error de token Google"
      );
      return null;
    });

    if (!token || !status.spreadsheetId) {
      return {
        syncedStudents: 0,
        syncedRegistrations: 0,
        skippedReason: "Google Sheets OAuth no conectado aún (datos guardados en BD local/nube).",
      };
    }

    const spreadsheetId = status.spreadsheetId;
    let syncedStudents = 0;
    let syncedRegistrations = 0;

    try {
      // 1. Batch-update student checkboxes in 1 single API call
      if (pending.students.length > 0) {
        const missingRowStudents = pending.students.filter((s) => !s.sheetRow);
        const resolvedRows = new Map<string, number>();

        if (missingRowStudents.length > 0) {
          const cifColRes = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
              `${SHEET_NAMES.students}!A2:A`
            )}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (cifColRes.ok) {
            const colData = (await cifColRes.json()) as { values?: string[][] };
            const rows = colData.values || [];
            rows.forEach((r, idx) => {
              const val = String(r[0] || "").trim();
              if (val) resolvedRows.set(val, idx + 2);
            });
          }
        }

        const batchData: Array<{ range: string; values: unknown[][] }> = [];
        const syncedCifs: string[] = [];

        for (const s of pending.students) {
          const rowNum = s.sheetRow || resolvedRows.get(s.cif);
          if (rowNum) {
            batchData.push({
              range: `${SHEET_NAMES.students}!D${rowNum}:E${rowNum}`,
              values: [[true, formatManaguaTimestamp(s.checkedInAt)]],
            });
            syncedCifs.push(s.cif);
          }
        }

        if (batchData.length > 0) {
          const batchRes = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                valueInputOption: "USER_ENTERED",
                data: batchData,
              }),
            }
          );

          if (!batchRes.ok) {
            throw new Error(`Sheets batchUpdate error: ${await batchRes.text()}`);
          }

          await markStudentsSyncStatus(syncedCifs, "synced", resolvedRows);
          syncedStudents = syncedCifs.length;
        }
      }

      // 2. Append sponsors, teachers, guests (1 API call per sheet)
      const sponsors = pending.registrations.filter((r) => r.category === "sponsor");
      const teachers = pending.registrations.filter((r) => r.category === "teacher");
      const guests = pending.registrations.filter((r) => r.category === "guest");

      const appendGroup = async (
        sheetName: string,
        rangeCols: string,
        rows: unknown[][],
        ids: string[]
      ) => {
        if (rows.length === 0) return 0;
        const appendRes = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
            `${sheetName}!${rangeCols}`
          )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ values: rows }),
          }
        );
        if (!appendRes.ok) {
          throw new Error(
            `Sheets append (${sheetName}) error: ${await appendRes.text()}`
          );
        }
        await markRegistrationsSyncStatus(ids, "synced");
        return ids.length;
      };

      syncedRegistrations += await appendGroup(
        SHEET_NAMES.sponsors,
        "A:D",
        sponsors.map((r) => [
          r.company || "",
          r.firstName,
          r.lastName,
          formatManaguaTimestamp(r.createdAt),
        ]),
        sponsors.map((r) => r.id)
      );

      syncedRegistrations += await appendGroup(
        SHEET_NAMES.teachers,
        "A:D",
        teachers.map((r) => [
          r.firstName,
          r.lastName,
          r.career || "",
          formatManaguaTimestamp(r.createdAt),
        ]),
        teachers.map((r) => r.id)
      );

      syncedRegistrations += await appendGroup(
        SHEET_NAMES.guests,
        "A:C",
        guests.map((r) => [
          r.firstName,
          r.lastName,
          formatManaguaTimestamp(r.createdAt),
        ]),
        guests.map((r) => r.id)
      );

      await setConfigValue("google_last_sync_at", new Date().toISOString());
      await setConfigValue("google_last_sync_error", "");
      return { syncedStudents, syncedRegistrations };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error sincronizando Sheets";
      await setConfigValue("google_last_sync_error", msg);
      return {
        syncedStudents,
        syncedRegistrations,
        skippedReason: msg,
      };
    }
  };

  globalSyncLock.__fiaSyncInFlight = run().finally(() => {
    globalSyncLock.__fiaSyncInFlight = null;
  });
  return globalSyncLock.__fiaSyncInFlight;
}

/**
 * Debounced background sync: coalesces bursts of up to 400 concurrent writes
 * into a single batched Sheets API flush every ~2 seconds.
 */
export function scheduleBackgroundSync() {
  if (globalSyncLock.__fiaSyncTimer) return;
  globalSyncLock.__fiaSyncTimer = setTimeout(() => {
    globalSyncLock.__fiaSyncTimer = null;
    void syncPendingToGoogleSheets();
  }, 1500);
}

// Keep unused import check happy if needed
export { getConfigValue };

