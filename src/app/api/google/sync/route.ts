import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { notifyDashboardUpdate } from "@/lib/events";
import { syncPendingToGoogleSheets } from "@/lib/google";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const result = await syncPendingToGoogleSheets();
    notifyDashboardUpdate();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error sincronizando con Sheets." },
      { status: 500 }
    );
  }
}

