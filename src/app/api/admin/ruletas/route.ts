import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAllExportData } from "@/lib/db";
import { ensureFreshSheetData } from "@/lib/google";
import {
  ROULETTE_CAREERS,
  type RouletteCareer,
  type RouletteCareerGroup,
  type RouletteStudent,
} from "@/lib/types";

export const dynamic = "force-dynamic";

function resolveRouletteCareer(raw: string): RouletteCareer | null {
  const norm = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  if (norm.includes("arquitectura")) return "Arquitectura";
  if (norm.includes("civil")) return "Ingeniería Civil";
  if (norm.includes("industrial")) return "Ingeniería Industrial";
  return null;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    await ensureFreshSheetData(3000);
    const { students } = await getAllExportData();

    const groups: Record<RouletteCareer, RouletteCareerGroup> = {
      Arquitectura: {
        career: "Arquitectura",
        totalPaid: 0,
        totalRegistered: 0,
        registered: [],
        allPaid: [],
      },
      "Ingeniería Civil": {
        career: "Ingeniería Civil",
        totalPaid: 0,
        totalRegistered: 0,
        registered: [],
        allPaid: [],
      },
      "Ingeniería Industrial": {
        career: "Ingeniería Industrial",
        totalPaid: 0,
        totalRegistered: 0,
        registered: [],
        allPaid: [],
      },
    };

    for (const s of students) {
      const targetCareer = resolveRouletteCareer(s.career);
      if (!targetCareer) continue;

      const item: RouletteStudent = {
        cif: s.cif,
        fullName: s.fullName,
        career: targetCareer,
        checkedIn: s.checkedIn,
        checkedInAt: s.checkedInAt,
      };

      groups[targetCareer].totalPaid += 1;
      groups[targetCareer].allPaid.push(item);

      if (s.checkedIn) {
        groups[targetCareer].totalRegistered += 1;
        groups[targetCareer].registered.push(item);
      }
    }

    for (const c of ROULETTE_CAREERS) {
      groups[c].registered.sort((a, b) =>
        a.fullName.localeCompare(b.fullName, "es")
      );
      groups[c].allPaid.sort((a, b) =>
        a.fullName.localeCompare(b.fullName, "es")
      );
    }

    return NextResponse.json({
      careers: ROULETTE_CAREERS.map((c) => groups[c]),
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Roulette data error:", err);
    return NextResponse.json(
      { error: "Error cargando datos de las ruletas." },
      { status: 500 }
    );
  }
}
