import { NextRequest, NextResponse } from "next/server";
import { findStudentByCif } from "@/lib/db";

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

    const student = await findStudentByCif(cif);
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

