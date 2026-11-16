import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import {
  DEFAULT_COMPANIES,
  DEFAULT_SPREADSHEET_ID,
  DEFAULT_STUDENTS,
  FIA_CAREERS,
} from "./constants";
import type {
  ActivityItem,
  DashboardStats,
  RegistrationCategory,
  RegistrationRecord,
  StudentRecord,
  SyncStatus,
} from "./types";

function isSupabaseEnabled(): boolean {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function getStorageMode(): "supabase" | "sqlite" {
  return isSupabaseEnabled() ? "supabase" : "sqlite";
}

// ---------- SQLite (Local / Single-Node Zero-Config Engine) ----------

type SqliteDb = import("node:sqlite").DatabaseSync;

const globalForSqlite = globalThis as unknown as {
  __fiaSqliteDb?: SqliteDb;
};

function getSqliteDb(): SqliteDb {
  if (globalForSqlite.__fiaSqliteDb) {
    return globalForSqlite.__fiaSqliteDb;
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { DatabaseSync } = require("node:sqlite") as typeof import("node:sqlite");
  let dataDir = process.env.VERCEL
    ? path.join(os.tmpdir(), "congreso-fia-data")
    : path.join(process.cwd(), "data");
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  } catch {
    dataDir = path.join(os.tmpdir(), "congreso-fia-data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }
  const dbPath = path.join(dataDir, "congreso.db");
  const db = new DatabaseSync(dbPath);

  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    PRAGMA busy_timeout = 5000;

    CREATE TABLE IF NOT EXISTS students (
      cif TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      career TEXT NOT NULL,
      checked_in INTEGER NOT NULL DEFAULT 0,
      checked_in_at TEXT,
      sheet_row INTEGER,
      sync_status TEXT NOT NULL DEFAULT 'synced'
    );

    CREATE INDEX IF NOT EXISTS idx_students_checked_in ON students(checked_in);
    CREATE INDEX IF NOT EXISTS idx_students_sync_status ON students(sync_status);

    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL CHECK (category IN ('sponsor', 'teacher', 'guest')),
      company TEXT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      career TEXT,
      created_at TEXT NOT NULL,
      sync_status TEXT NOT NULL DEFAULT 'pending'
    );

    CREATE INDEX IF NOT EXISTS idx_reg_cat ON registrations(category);
    CREATE INDEX IF NOT EXISTS idx_reg_created ON registrations(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_reg_sync ON registrations(sync_status);

    CREATE TABLE IF NOT EXISTS app_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Automatically replace legacy dummy test data ('20210001' / 'Empresa Prueba 01') if present
  const hasLegacyStudent = db
    .prepare("SELECT 1 as found FROM students WHERE cif = '20210001' LIMIT 1")
    .get() as { found: number } | undefined;
  if (hasLegacyStudent) {
    db.exec("DELETE FROM students WHERE sync_status = 'synced'");
  }

  const hasLegacyCompany = db
    .prepare(
      "SELECT 1 as found FROM companies WHERE name LIKE 'Empresa Prueba%' LIMIT 1"
    )
    .get() as { found: number } | undefined;
  if (hasLegacyCompany) {
    db.exec("DELETE FROM companies");
  }

  // Synchronize base students from constants so new students and updated CIFs are always available immediately
  const upsertStudent = db.prepare(
    `INSERT INTO students (cif, full_name, career, checked_in, checked_in_at, sheet_row, sync_status)
     VALUES (?, ?, ?, ?, NULL, ?, 'synced')
     ON CONFLICT(cif) DO UPDATE SET
       full_name = excluded.full_name,
       career = excluded.career,
       sheet_row = excluded.sheet_row`
  );
  for (const s of DEFAULT_STUDENTS) {
    upsertStudent.run(s.cif, s.fullName, s.career, s.checkedIn ? 1 : 0, s.sheetRow);
  }

  // Clean up legacy placeholder SIN-CIF rows if any exist
  db.exec("DELETE FROM students WHERE cif LIKE 'SIN-CIF-%' AND sync_status != 'pending'");

  const companyCount = db
    .prepare("SELECT COUNT(*) as cnt FROM companies")
    .get() as { cnt: number };

  if (companyCount.cnt === 0) {
    const insertCompany = db.prepare(
      "INSERT OR IGNORE INTO companies (name, sort_order) VALUES (?, ?)"
    );
    DEFAULT_COMPANIES.forEach((name, idx) => {
      insertCompany.run(name, idx + 1);
    });
  }

  const spreadsheetCfg = db
    .prepare("SELECT value FROM app_config WHERE key = 'google_spreadsheet_id'")
    .get() as { value: string } | undefined;
  if (!spreadsheetCfg && DEFAULT_SPREADSHEET_ID) {
    db.prepare(
      "INSERT OR IGNORE INTO app_config (key, value, updated_at) VALUES (?, ?, ?)"
    ).run("google_spreadsheet_id", DEFAULT_SPREADSHEET_ID, new Date().toISOString());
  }

  globalForSqlite.__fiaSqliteDb = db;
  return db;
}

// ---------- Supabase REST Helper ----------

async function supabaseFetch<T>(
  endpoint: string,
  options: RequestInit & { prefer?: string } = {}
): Promise<T> {
  const baseUrl = process.env.SUPABASE_URL!.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const headers: Record<string, string> = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...(options.prefer ? { Prefer: options.prefer } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${baseUrl}/rest/v1/${endpoint}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase error (${res.status}): ${errText}`);
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

// ---------- App Config Helpers ----------

export async function getConfigValue(key: string): Promise<string | null> {
  if (isSupabaseEnabled()) {
    const rows = await supabaseFetch<Array<{ value: string }>>(
      `app_config?key=eq.${encodeURIComponent(key)}&select=value`
    );
    return rows[0]?.value ?? null;
  }
  const db = getSqliteDb();
  const row = db
    .prepare("SELECT value FROM app_config WHERE key = ?")
    .get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

export async function setConfigValue(key: string, value: string): Promise<void> {
  const now = new Date().toISOString();
  if (isSupabaseEnabled()) {
    await supabaseFetch("app_config", {
      method: "POST",
      prefer: "resolution=merge-duplicates",
      body: JSON.stringify([{ key, value, updated_at: now }]),
    });
    return;
  }
  const db = getSqliteDb();
  db.prepare(
    `INSERT INTO app_config (key, value, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  ).run(key, value, now);
}

export async function getMultipleConfigValues(
  keys: string[]
): Promise<Record<string, string | null>> {
  const result: Record<string, string | null> = {};
  for (const k of keys) result[k] = null;

  if (isSupabaseEnabled()) {
    const inList = keys.map((k) => `"${k}"`).join(",");
    const rows = await supabaseFetch<Array<{ key: string; value: string }>>(
      `app_config?key=in.(${encodeURIComponent(inList)})&select=key,value`
    );
    for (const r of rows) result[r.key] = r.value;
    return result;
  }

  const db = getSqliteDb();
  const placeholders = keys.map(() => "?").join(",");
  const rows = db
    .prepare(`SELECT key, value FROM app_config WHERE key IN (${placeholders})`)
    .all(...keys) as Array<{ key: string; value: string }>;
  for (const r of rows) result[r.key] = r.value;
  return result;
}

// ---------- Student Operations ----------

function mapStudentRow(r: {
  cif: string;
  full_name: string;
  career: string;
  checked_in: boolean | number;
  checked_in_at: string | null;
  sheet_row: number | null;
  sync_status: string;
}): StudentRecord {
  return {
    cif: r.cif,
    fullName: r.full_name,
    career: r.career,
    checkedIn: Boolean(r.checked_in),
    checkedInAt: r.checked_in_at,
    sheetRow: r.sheet_row,
    syncStatus: (r.sync_status as SyncStatus) || "synced",
  };
}

export async function findStudentByCif(
  rawCif: string
): Promise<StudentRecord | null> {
  const cif = rawCif.trim();
  if (!cif) return null;

  if (isSupabaseEnabled()) {
    const rows = await supabaseFetch<Array<{
      cif: string;
      full_name: string;
      career: string;
      checked_in: boolean;
      checked_in_at: string | null;
      sheet_row: number | null;
      sync_status: string;
    }>>(`students?cif=eq.${encodeURIComponent(cif)}&limit=1`);
    return rows[0] ? mapStudentRow(rows[0]) : null;
  }

  const db = getSqliteDb();
  const row = db
    .prepare("SELECT * FROM students WHERE LOWER(TRIM(cif)) = LOWER(?)")
    .get(cif) as
    | {
        cif: string;
        full_name: string;
        career: string;
        checked_in: number;
        checked_in_at: string | null;
        sheet_row: number | null;
        sync_status: string;
      }
    | undefined;
  return row ? mapStudentRow(row) : null;
}

export type CheckInResult =
  | { status: "ok"; student: StudentRecord }
  | { status: "already_checked_in"; student: StudentRecord }
  | { status: "not_found" };

export async function checkInStudentAtomic(
  rawCif: string
): Promise<CheckInResult> {
  const cif = rawCif.trim();
  const now = new Date().toISOString();

  if (isSupabaseEnabled()) {
    const updated = await supabaseFetch<Array<{
      cif: string;
      full_name: string;
      career: string;
      checked_in: boolean;
      checked_in_at: string | null;
      sheet_row: number | null;
      sync_status: string;
    }>>(
      `students?cif=eq.${encodeURIComponent(cif)}&checked_in=eq.false`,
      {
        method: "PATCH",
        prefer: "return=representation",
        body: JSON.stringify({
          checked_in: true,
          checked_in_at: now,
          sync_status: "pending",
        }),
      }
    );

    if (updated.length > 0) {
      return { status: "ok", student: mapStudentRow(updated[0]) };
    }

    const existing = await findStudentByCif(cif);
    if (!existing) return { status: "not_found" };
    return { status: "already_checked_in", student: existing };
  }

  const db = getSqliteDb();
  const existing = await findStudentByCif(cif);
  if (!existing) return { status: "not_found" };
  if (existing.checkedIn) {
    return { status: "already_checked_in", student: existing };
  }

  const info = db
    .prepare(
      `UPDATE students
       SET checked_in = 1, checked_in_at = ?, sync_status = 'pending'
       WHERE cif = ? AND checked_in = 0`
    )
    .run(now, existing.cif);

  if (info.changes === 0) {
    const refreshed = await findStudentByCif(existing.cif);
    return refreshed
      ? { status: "already_checked_in", student: refreshed }
      : { status: "not_found" };
  }

  const updated = (await findStudentByCif(existing.cif))!;
  return { status: "ok", student: updated };
}

export async function upsertStudentsFromSheet(
  items: Array<{
    cif: string;
    fullName: string;
    career: string;
    checkedIn: boolean;
    checkedInAt: string | null;
    sheetRow: number;
  }>
): Promise<number> {
  if (items.length === 0) return 0;

  if (isSupabaseEnabled()) {
    // Preserve only unsynced pending check-ins; otherwise Google Sheet is authoritative
    const existingRows = await supabaseFetch<
      Array<{ cif: string; checked_in: boolean; checked_in_at: string | null; sync_status: string }>
    >("students?select=cif,checked_in,checked_in_at,sync_status");
    const existingMap = new Map(existingRows.map((r) => [r.cif, r]));
    const sheetCifSet = new Set(items.map((s) => s.cif));

    const payload = items.map((s) => {
      const local = existingMap.get(s.cif);
      const keepLocalPending =
        local?.sync_status === "pending" && local.checked_in && !s.checkedIn;
      const checkedIn = keepLocalPending ? true : Boolean(s.checkedIn);
      const syncStatus = keepLocalPending ? "pending" : "synced";
      const checkedInAt = keepLocalPending
        ? local?.checked_in_at
        : s.checkedIn
          ? s.checkedInAt || local?.checked_in_at || new Date().toISOString()
          : null;
      return {
        cif: s.cif,
        full_name: s.fullName,
        career: s.career,
        checked_in: checkedIn,
        checked_in_at: checkedInAt,
        sheet_row: s.sheetRow,
        sync_status: syncStatus,
      };
    });

    await supabaseFetch("students?on_conflict=cif", {
      method: "POST",
      prefer: "resolution=merge-duplicates",
      body: JSON.stringify(payload),
    });

    // Remove students deleted from the Google Sheet (unless pending sync)
    for (const r of existingRows) {
      if (!sheetCifSet.has(r.cif) && r.sync_status !== "pending") {
        await supabaseFetch(`students?cif=eq.${encodeURIComponent(r.cif)}`, {
          method: "DELETE",
        });
      }
    }

    return payload.length;
  }

  const db = getSqliteDb();
  const stmt = db.prepare(`
    INSERT INTO students (cif, full_name, career, checked_in, checked_in_at, sheet_row, sync_status)
    VALUES (?, ?, ?, ?, ?, ?, 'synced')
    ON CONFLICT(cif) DO UPDATE SET
      full_name = excluded.full_name,
      career = excluded.career,
      sheet_row = excluded.sheet_row,
      checked_in = CASE
        WHEN students.sync_status = 'pending' AND students.checked_in = 1 THEN 1
        ELSE excluded.checked_in
      END,
      checked_in_at = CASE
        WHEN students.sync_status = 'pending' AND students.checked_in = 1 THEN students.checked_in_at
        WHEN excluded.checked_in = 1 THEN COALESCE(excluded.checked_in_at, students.checked_in_at, ?)
        ELSE NULL
      END,
      sync_status = CASE
        WHEN students.sync_status = 'pending' AND students.checked_in = 1 AND excluded.checked_in = 0 THEN 'pending'
        ELSE 'synced'
      END
  `);

  const nowIso = new Date().toISOString();
  const sheetCifs = new Set(items.map((s) => s.cif));
  const existingCifs = db
    .prepare("SELECT cif, sync_status FROM students")
    .all() as Array<{ cif: string; sync_status: string }>;
  const delStmt = db.prepare("DELETE FROM students WHERE cif = ?");

  db.exec("BEGIN");
  try {
    for (const s of items) {
      stmt.run(
        s.cif,
        s.fullName,
        s.career,
        s.checkedIn ? 1 : 0,
        s.checkedInAt,
        s.sheetRow,
        nowIso
      );
    }
    for (const row of existingCifs) {
      if (!sheetCifs.has(row.cif) && row.sync_status !== "pending") {
        delStmt.run(row.cif);
      }
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return items.length;
}

export async function reconcileRegistrationsFromSheet(
  sheetItems: Array<{
    id: string;
    category: RegistrationCategory;
    company?: string | null;
    firstName: string;
    lastName: string;
    career?: string | null;
    createdAt: string;
  }>
): Promise<number> {
  if (isSupabaseEnabled()) {
    await supabaseFetch("registrations?sync_status=eq.synced", {
      method: "DELETE",
    });
    if (sheetItems.length > 0) {
      await supabaseFetch("registrations?on_conflict=id", {
        method: "POST",
        prefer: "resolution=merge-duplicates",
        body: JSON.stringify(
          sheetItems.map((r) => ({
            id: r.id,
            category: r.category,
            company: r.company || null,
            first_name: r.firstName,
            last_name: r.lastName,
            career: r.career || null,
            created_at: r.createdAt,
            sync_status: "synced",
          }))
        ),
      });
    }
    return sheetItems.length;
  }

  const db = getSqliteDb();
  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO registrations (id, category, company, first_name, last_name, career, created_at, sync_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'synced')
  `);

  db.exec("BEGIN");
  try {
    db.exec("DELETE FROM registrations WHERE sync_status = 'synced'");
    for (const r of sheetItems) {
      insertStmt.run(
        r.id,
        r.category,
        r.company || null,
        r.firstName,
        r.lastName,
        r.career || null,
        r.createdAt
      );
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return sheetItems.length;
}

// ---------- Company Operations ----------

export async function getCompanies(): Promise<string[]> {
  if (isSupabaseEnabled()) {
    const rows = await supabaseFetch<Array<{ name: string }>>(
      "companies?select=name&order=sort_order.asc,name.asc"
    );
    if (rows.length > 0) return rows.map((r) => r.name);
    return [...DEFAULT_COMPANIES];
  }

  const db = getSqliteDb();
  const rows = db
    .prepare("SELECT name FROM companies ORDER BY sort_order ASC, name ASC")
    .all() as Array<{ name: string }>;
  return rows.map((r) => r.name);
}

export async function replaceCompaniesFromSheet(names: string[]): Promise<number> {
  const clean = Array.from(
    new Set(names.map((n) => n.trim()).filter((n) => n.length > 0))
  );
  if (clean.length === 0) return 0;

  if (isSupabaseEnabled()) {
    await supabaseFetch("companies?id=gt.0", { method: "DELETE" });
    await supabaseFetch("companies", {
      method: "POST",
      body: JSON.stringify(
        clean.map((name, idx) => ({ name, sort_order: idx + 1 }))
      ),
    });
    return clean.length;
  }

  const db = getSqliteDb();
  db.exec("BEGIN");
  try {
    db.exec("DELETE FROM companies");
    const stmt = db.prepare(
      "INSERT INTO companies (name, sort_order) VALUES (?, ?)"
    );
    clean.forEach((name, idx) => stmt.run(name, idx + 1));
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return clean.length;
}

// ---------- General Registrations (Sponsors, Teachers, Guests) ----------

export async function createRegistration(input: {
  category: RegistrationCategory;
  company?: string | null;
  firstName: string;
  lastName: string;
  career?: string | null;
}): Promise<RegistrationRecord> {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const company = input.company?.trim() || null;
  const career = input.career?.trim() || null;

  if (isSupabaseEnabled()) {
    await supabaseFetch("registrations", {
      method: "POST",
      body: JSON.stringify([
        {
          id,
          category: input.category,
          company,
          first_name: firstName,
          last_name: lastName,
          career,
          created_at: createdAt,
          sync_status: "pending",
        },
      ]),
    });
  } else {
    const db = getSqliteDb();
    db.prepare(
      `INSERT INTO registrations (id, category, company, first_name, last_name, career, created_at, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`
    ).run(id, input.category, company, firstName, lastName, career, createdAt);
  }

  return {
    id,
    category: input.category,
    company,
    firstName,
    lastName,
    career,
    createdAt,
    syncStatus: "pending",
  };
}

// ---------- Sync Queue Helpers ----------

export async function getPendingSyncItems() {
  if (isSupabaseEnabled()) {
    const [students, registrations] = await Promise.all([
      supabaseFetch<
        Array<{
          cif: string;
          full_name: string;
          career: string;
          checked_in: boolean;
          checked_in_at: string | null;
          sheet_row: number | null;
          sync_status: string;
        }>
      >("students?checked_in=eq.true&sync_status=in.(pending,error)&limit=100"),
      supabaseFetch<
        Array<{
          id: string;
          category: RegistrationCategory;
          company: string | null;
          first_name: string;
          last_name: string;
          career: string | null;
          created_at: string;
          sync_status: string;
        }>
      >("registrations?sync_status=in.(pending,error)&order=created_at.asc&limit=100"),
    ]);

    return {
      students: students.map(mapStudentRow),
      registrations: registrations.map((r) => ({
        id: r.id,
        category: r.category,
        company: r.company,
        firstName: r.first_name,
        lastName: r.last_name,
        career: r.career,
        createdAt: r.created_at,
        syncStatus: r.sync_status as SyncStatus,
      })),
    };
  }

  const db = getSqliteDb();
  const sRows = db
    .prepare(
      "SELECT * FROM students WHERE checked_in = 1 AND sync_status IN ('pending', 'error') LIMIT 100"
    )
    .all() as Array<{
    cif: string;
    full_name: string;
    career: string;
    checked_in: number;
    checked_in_at: string | null;
    sheet_row: number | null;
    sync_status: string;
  }>;

  const rRows = db
    .prepare(
      "SELECT * FROM registrations WHERE sync_status IN ('pending', 'error') ORDER BY created_at ASC LIMIT 100"
    )
    .all() as Array<{
    id: string;
    category: RegistrationCategory;
    company: string | null;
    first_name: string;
    last_name: string;
    career: string | null;
    created_at: string;
    sync_status: string;
  }>;

  return {
    students: sRows.map(mapStudentRow),
    registrations: rRows.map((r) => ({
      id: r.id,
      category: r.category,
      company: r.company,
      firstName: r.first_name,
      lastName: r.last_name,
      career: r.career,
      createdAt: r.created_at,
      syncStatus: r.sync_status as SyncStatus,
    })),
  };
}

export async function markStudentsSyncStatus(
  cifs: string[],
  status: SyncStatus,
  rowMap?: Map<string, number>
) {
  if (cifs.length === 0) return;

  if (isSupabaseEnabled()) {
    for (const cif of cifs) {
      const patch: Record<string, unknown> = { sync_status: status };
      const row = rowMap?.get(cif);
      if (row) patch.sheet_row = row;
      await supabaseFetch(`students?cif=eq.${encodeURIComponent(cif)}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
    }
    return;
  }

  const db = getSqliteDb();
  const stmtWithRow = db.prepare(
    "UPDATE students SET sync_status = ?, sheet_row = ? WHERE cif = ?"
  );
  const stmtNoRow = db.prepare(
    "UPDATE students SET sync_status = ? WHERE cif = ?"
  );

  db.exec("BEGIN");
  try {
    for (const cif of cifs) {
      const row = rowMap?.get(cif);
      if (row) {
        stmtWithRow.run(status, row, cif);
      } else {
        stmtNoRow.run(status, cif);
      }
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

export async function markRegistrationsSyncStatus(
  ids: string[],
  status: SyncStatus
) {
  if (ids.length === 0) return;

  if (isSupabaseEnabled()) {
    const inList = ids.map((id) => `"${id}"`).join(",");
    await supabaseFetch(
      `registrations?id=in.(${encodeURIComponent(inList)})`,
      {
        method: "PATCH",
        body: JSON.stringify({ sync_status: status }),
      }
    );
    return;
  }

  const db = getSqliteDb();
  const placeholders = ids.map(() => "?").join(",");
  db.prepare(
    `UPDATE registrations SET sync_status = ? WHERE id IN (${placeholders})`
  ).run(status, ...ids);
}

// ---------- Dashboard Stats & Export ----------

function formatManaguaTimeLabel(iso: string): string {
  try {
    const d = new Date(iso);
    const fmt = new Intl.DateTimeFormat("es-NI", {
      timeZone: "America/Managua",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);
    const [hh, mm] = fmt.split(":");
    const minuteBucket = Math.floor(Number(mm) / 15) * 15;
    return `${hh}:${String(minuteBucket).padStart(2, "0")}`;
  } catch {
    return "00:00";
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  let students: StudentRecord[] = [];
  let registrations: RegistrationRecord[] = [];

  if (isSupabaseEnabled()) {
    const [sRows, rRows] = await Promise.all([
      supabaseFetch<
        Array<{
          cif: string;
          full_name: string;
          career: string;
          checked_in: boolean;
          checked_in_at: string | null;
          sheet_row: number | null;
          sync_status: string;
        }>
      >("students?select=*"),
      supabaseFetch<
        Array<{
          id: string;
          category: RegistrationCategory;
          company: string | null;
          first_name: string;
          last_name: string;
          career: string | null;
          created_at: string;
          sync_status: string;
        }>
      >("registrations?select=*&order=created_at.desc"),
    ]);
    students = sRows.map(mapStudentRow);
    registrations = rRows.map((r) => ({
      id: r.id,
      category: r.category,
      company: r.company,
      firstName: r.first_name,
      lastName: r.last_name,
      career: r.career,
      createdAt: r.created_at,
      syncStatus: r.sync_status as SyncStatus,
    }));
  } else {
    const db = getSqliteDb();
    const sRows = db.prepare("SELECT * FROM students").all() as Array<{
      cif: string;
      full_name: string;
      career: string;
      checked_in: number;
      checked_in_at: string | null;
      sheet_row: number | null;
      sync_status: string;
    }>;
    const rRows = db
      .prepare("SELECT * FROM registrations ORDER BY created_at DESC")
      .all() as Array<{
      id: string;
      category: RegistrationCategory;
      company: string | null;
      first_name: string;
      last_name: string;
      career: string | null;
      created_at: string;
      sync_status: string;
    }>;
    students = sRows.map(mapStudentRow);
    registrations = rRows.map((r) => ({
      id: r.id,
      category: r.category,
      company: r.company,
      firstName: r.first_name,
      lastName: r.last_name,
      career: r.career,
      createdAt: r.created_at,
      syncStatus: r.sync_status as SyncStatus,
    }));
  }

  const cfg = await getMultipleConfigValues([
    "google_last_sync_at",
    "google_last_sync_error",
  ]);

  const studentByCareer: Record<string, { paid: number; checkedIn: number }> = {};
  for (const c of FIA_CAREERS) {
    studentByCareer[c] = { paid: 0, checkedIn: 0 };
  }

  let checkedInStudents = 0;
  let pendingStudents = 0;
  let errorStudents = 0;

  for (const s of students) {
    if (!studentByCareer[s.career]) {
      studentByCareer[s.career] = { paid: 0, checkedIn: 0 };
    }
    studentByCareer[s.career].paid += 1;
    if (s.checkedIn) {
      checkedInStudents += 1;
      studentByCareer[s.career].checkedIn += 1;
      if (s.syncStatus === "pending") pendingStudents += 1;
      if (s.syncStatus === "error") errorStudents += 1;
    }
  }

  const sponsorCompanyCounts = new Map<string, number>();
  const teacherByCareer: Record<string, number> = {};
  for (const c of FIA_CAREERS) teacherByCareer[c] = 0;

  let sponsorTotal = 0;
  let sponsorPending = 0;
  let teacherTotal = 0;
  let teacherPending = 0;
  let guestTotal = 0;
  let guestPending = 0;
  let errorRegs = 0;

  for (const r of registrations) {
    if (r.syncStatus === "error") errorRegs += 1;
    if (r.category === "sponsor") {
      sponsorTotal += 1;
      if (r.syncStatus !== "synced") sponsorPending += 1;
      const comp = r.company || "Sin empresa";
      sponsorCompanyCounts.set(comp, (sponsorCompanyCounts.get(comp) || 0) + 1);
    } else if (r.category === "teacher") {
      teacherTotal += 1;
      if (r.syncStatus !== "synced") teacherPending += 1;
      const car = r.career || "Otra";
      teacherByCareer[car] = (teacherByCareer[car] || 0) + 1;
    } else if (r.category === "guest") {
      guestTotal += 1;
      if (r.syncStatus !== "synced") guestPending += 1;
    }
  }

  const activity: ActivityItem[] = [
    ...students
      .filter((s) => s.checkedIn && s.checkedInAt)
      .map((s) => ({
        id: `stu-${s.cif}`,
        type: "student" as const,
        name: s.fullName,
        detail: `CIF ${s.cif} · ${s.career}`,
        timestamp: s.checkedInAt!,
        syncStatus: s.syncStatus,
      })),
    ...registrations.map((r) => ({
      id: r.id,
      type: r.category,
      name: `${r.firstName} ${r.lastName}`,
      detail:
        r.category === "sponsor"
          ? r.company || "Patrocinador"
          : r.category === "teacher"
            ? r.career || "Docente UAM"
            : "Invitado Especial",
      timestamp: r.createdAt,
      syncStatus: r.syncStatus,
    })),
  ]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 30);

  // Timeline buckets (15-min intervals of all checked-in arrivals)
  const bucketMap = new Map<string, number>();
  for (const item of [
    ...students
      .filter((s) => s.checkedIn && s.checkedInAt)
      .map((s) => s.checkedInAt!),
    ...registrations.map((r) => r.createdAt),
  ].sort()) {
    const label = formatManaguaTimeLabel(item);
    bucketMap.set(label, (bucketMap.get(label) || 0) + 1);
  }
  const timeline = Array.from(bucketMap.entries())
    .slice(-12)
    .map(([label, count]) => ({ label, count }));

  return {
    storageMode: getStorageMode(),
    totalCheckedIn: checkedInStudents + sponsorTotal + teacherTotal + guestTotal,
    students: {
      totalPaid: students.length,
      checkedIn: checkedInStudents,
      pendingSync: pendingStudents,
      byCareer: studentByCareer,
    },
    sponsors: {
      total: sponsorTotal,
      pendingSync: sponsorPending,
      byCompany: Array.from(sponsorCompanyCounts.entries())
        .map(([company, count]) => ({ company, count }))
        .sort((a, b) => b.count - a.count),
    },
    teachers: {
      total: teacherTotal,
      pendingSync: teacherPending,
      byCareer: teacherByCareer,
    },
    guests: {
      total: guestTotal,
      pendingSync: guestPending,
    },
    syncQueue: {
      pending: pendingStudents + sponsorPending + teacherPending + guestPending,
      errors: errorStudents + errorRegs,
      lastSyncAt: cfg.google_last_sync_at,
      lastSyncError: cfg.google_last_sync_error,
    },
    recentActivity: activity,
    timeline,
    generatedAt: new Date().toISOString(),
  };
}

export async function getAllExportData(): Promise<{
  students: StudentRecord[];
  registrations: RegistrationRecord[];
}> {
  if (isSupabaseEnabled()) {
    const [sRows, rRows] = await Promise.all([
      supabaseFetch<
        Array<{
          cif: string;
          full_name: string;
          career: string;
          checked_in: boolean;
          checked_in_at: string | null;
          sheet_row: number | null;
          sync_status: string;
        }>
      >("students?select=*&order=cif.asc"),
      supabaseFetch<
        Array<{
          id: string;
          category: RegistrationCategory;
          company: string | null;
          first_name: string;
          last_name: string;
          career: string | null;
          created_at: string;
          sync_status: string;
        }>
      >("registrations?select=*&order=created_at.asc"),
    ]);
    return {
      students: sRows.map(mapStudentRow),
      registrations: rRows.map((r) => ({
        id: r.id,
        category: r.category,
        company: r.company,
        firstName: r.first_name,
        lastName: r.last_name,
        career: r.career,
        createdAt: r.created_at,
        syncStatus: r.sync_status as SyncStatus,
      })),
    };
  }

  const db = getSqliteDb();
  const sRows = db
    .prepare("SELECT * FROM students ORDER BY cif ASC")
    .all() as Array<{
    cif: string;
    full_name: string;
    career: string;
    checked_in: number;
    checked_in_at: string | null;
    sheet_row: number | null;
    sync_status: string;
  }>;
  const rRows = db
    .prepare("SELECT * FROM registrations ORDER BY created_at ASC")
    .all() as Array<{
    id: string;
    category: RegistrationCategory;
    company: string | null;
    first_name: string;
    last_name: string;
    career: string | null;
    created_at: string;
    sync_status: string;
  }>;
  return {
    students: sRows.map(mapStudentRow),
    registrations: rRows.map((r) => ({
      id: r.id,
      category: r.category,
      company: r.company,
      firstName: r.first_name,
      lastName: r.last_name,
      career: r.career,
      createdAt: r.created_at,
      syncStatus: r.sync_status as SyncStatus,
    })),
  };
}

