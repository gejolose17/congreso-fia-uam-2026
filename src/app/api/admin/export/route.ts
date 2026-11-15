import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAllExportData } from "@/lib/db";

export const dynamic = "force-dynamic";

function csvEscape(val: string | number | boolean | null | undefined): string {
  const s = String(val ?? "");
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { students, registrations } = await getAllExportData();
  const lines: string[] = [
    "Tipo,Identificador/Empresa,Nombre,Carrera,Asistencia,FechaHora,EstadoSync",
  ];

  for (const s of students) {
    lines.push(
      [
        "Estudiante",
        s.cif,
        s.fullName,
        s.career,
        s.checkedIn ? "SI" : "NO",
        s.checkedInAt || "",
        s.syncStatus,
      ]
        .map(csvEscape)
        .join(",")
    );
  }

  for (const r of registrations) {
    const tipo =
      r.category === "sponsor"
        ? "Patrocinador"
        : r.category === "teacher"
          ? "Docente UAM"
          : "Invitado";
    lines.push(
      [
        tipo,
        r.company || "",
        `${r.firstName} ${r.lastName}`,
        r.career || "",
        "SI",
        r.createdAt,
        r.syncStatus,
      ]
        .map(csvEscape)
        .join(",")
    );
  }

  const bom = "\uFEFF";
  return new NextResponse(bom + lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="respaldo-congreso-fia-uam-2026.csv"`,
    },
  });
}

