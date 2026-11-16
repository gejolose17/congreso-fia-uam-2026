import { NextResponse } from "next/server";
import { getCompanies } from "@/lib/db";
import { ensureFreshSheetData } from "@/lib/google";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureFreshSheetData(5000);
    const companies = await getCompanies();
    return NextResponse.json({ companies });
  } catch (err) {
    console.error("Companies fetch error:", err);
    return NextResponse.json(
      { error: "Error cargando la lista de empresas." },
      { status: 500 }
    );
  }
}
