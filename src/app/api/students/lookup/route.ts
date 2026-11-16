import { NextRequest, NextResponse } from "next/server";
import { findStudentByCif } from "@/lib/db";
import { ensureFreshSheetData } from "@/lib/google";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cif = req.nextUrl.searchParams.get("cif")?.trim() || "";
    if (!cif) {
      return NextResponse.json(
        { error: "Ingresa tu número de CIF." },
        { status: 400 }
      );
    }

    await ensureFreshSheetData(5000);
    let student = await findStudentByCif(cif);

    // If not found in cache, force an immediate pull in case the student was just added to the Sheet
    if (!student) {
      await ensureFreshSheetData(0);
      student = await findStudentByCif(cif);
    }

    if (!student) {
      return NextResponse.json({ found: false }, { status: 200 });
    }

    return NextResponse.json({
      found: true,
      student: {
        cif: student.cif,
        fullName: student.fullName,
        career: student.career,
        checkedIn: student.checkedIn,
        checkedInAt: student.checkedInAt,
      },
    });
  } catch (err) {
    console.error("Student lookup error:", err);
    return NextResponse.json(
      { error: "Error consultando el CIF. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
