import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { notifyDashboardUpdate } from "@/lib/events";
import { pullFromGoogleSheets } from "@/lib/google";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const result = await pullFromGoogleSheets();
    notifyDashboardUpdate();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error importando desde Sheets." },
      { status: 400 }
    );
  }
}

