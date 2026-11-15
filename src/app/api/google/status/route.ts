import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { setConfigValue } from "@/lib/db";
import { getGoogleSetupStatus } from "@/lib/google";

export const dynamic = "force-dynamic";

function extractSpreadsheetId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : trimmed;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const status = await getGoogleSetupStatus();
  return NextResponse.json(status);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as {
      spreadsheetId?: string;
      appsScriptUrl?: string;
    };

    if (typeof body.spreadsheetId === "string" && body.spreadsheetId.trim()) {
      const id = extractSpreadsheetId(body.spreadsheetId);
      await setConfigValue("google_spreadsheet_id", id);
    }
    if (typeof body.appsScriptUrl === "string") {
      await setConfigValue("google_apps_script_url", body.appsScriptUrl.trim());
    }

    const status = await getGoogleSetupStatus();
    return NextResponse.json({ ok: true, status });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error guardando configuración" },
      { status: 500 }
    );
  }
}

