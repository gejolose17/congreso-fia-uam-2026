import { NextResponse } from "next/server";
import { getCompanies } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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

