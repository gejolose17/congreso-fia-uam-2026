import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  getAllExportData,
  restoreFromVault,
  saveMasterBackupSnapshot,
} from "@/lib/db";
import { syncPendingToGoogleSheets } from "@/lib/google";
import type { RegistrationCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    await saveMasterBackupSnapshot();
    const { students, registrations } = await getAllExportData();
    const checkedStudents = students.filter((s) => s.checkedIn);

    const payload = {
      generatedAt: new Date().toISOString(),
      totalCheckedStudents: checkedStudents.length,
      totalRegistrations: registrations.length,
      checkedStudents,
      registrations,
    };

    if (req.nextUrl.searchParams.get("download") === "1") {
      return new NextResponse(JSON.stringify(payload, null, 2), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="resguardo-congreso-fia-uam-2026.json"`,
        },
      });
    }

    return NextResponse.json(payload);
  } catch (err) {
    console.error("Backup GET error:", err);
    return NextResponse.json(
      { error: "Error generando resguardo." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      students?: Array<{
        cif: string;
        fullName?: string;
        career?: string;
        checkedInAt?: string | null;
      }>;
      registrations?: Array<{
        id: string;
        category: RegistrationCategory;
        company?: string | null;
        firstName: string;
        lastName: string;
        career?: string | null;
        createdAt: string;
      }>;
    };

    const result = await restoreFromVault(body);
    if (result.restoredStudents > 0 || result.restoredRegistrations > 0) {
      await syncPendingToGoogleSheets().catch(() => null);
    }

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (err) {
    console.error("Backup POST error:", err);
    return NextResponse.json(
      { error: "Error sincronizando resguardo." },
      { status: 500 }
    );
  }
}
