import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDashboardStats } from "@/lib/db";
import { ensureFreshSheetData } from "@/lib/google";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    await ensureFreshSheetData(5000);
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return NextResponse.json(
      { error: "Error obteniendo estadísticas." },
      { status: 500 }
    );
  }
}
