import { NextRequest, NextResponse } from "next/server";
import { checkInStudentAtomic } from "@/lib/db";
import { notifyDashboardUpdate } from "@/lib/events";
import { scheduleBackgroundSync } from "@/lib/google";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { cif?: string };
    const cif = body.cif?.trim() || "";
    if (!cif) {
      return NextResponse.json(
        { error: "El número de CIF es obligatorio." },
        { status: 400 }
      );
    }

    const result = await checkInStudentAtomic(cif);

    if (result.status === "not_found") {
      return NextResponse.json(
        {
          code: "NOT_FOUND",
          error:
            "Este CIF no aparece en la lista de estudiantes con pago confirmado. Acércate a mesa de verificación.",
        },
        { status: 404 }
      );
    }

    if (result.status === "already_checked_in") {
      return NextResponse.json(
        {
          code: "ALREADY_REGISTERED",
          error: "Este CIF ya completó su registro anteriormente.",
          student: {
            cif: result.student.cif,
            fullName: result.student.fullName,
            career: result.student.career,
            checkedInAt: result.student.checkedInAt,
          },
        },
        { status: 409 }
      );
    }

    notifyDashboardUpdate();
    scheduleBackgroundSync();

    return NextResponse.json({
      ok: true,
      student: {
        cif: result.student.cif,
        fullName: result.student.fullName,
        career: result.student.career,
        checkedIn: result.student.checkedIn,
        checkedInAt: result.student.checkedInAt,
      },
    });
  } catch (err) {
    console.error("Student check-in error:", err);
    return NextResponse.json(
      { error: "No se pudo completar el registro. Intenta nuevamente." },
      { status: 500 }
    );
  }
}

