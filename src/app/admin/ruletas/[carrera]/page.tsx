import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAllExportData } from "@/lib/db";
import { ensureFreshSheetData } from "@/lib/google";
import { RuletasClient } from "@/components/RuletasClient";
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

function slugToCareer(slug: string): RouletteCareer | null {
  const clean = decodeURIComponent(slug)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  if (clean.includes("arquitectura")) return "Arquitectura";
  if (clean.includes("civil")) return "Ingeniería Civil";
  if (clean.includes("industrial")) return "Ingeniería Industrial";
  return null;
}

export default async function SingleCareerRuletaPage({
  params,
}: {
  params: Promise<{ carrera: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { carrera } = await params;
  const targetCareer = slugToCareer(carrera);
  if (!targetCareer) {
    redirect("/admin/ruletas");
  }

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
    const c = resolveRouletteCareer(s.career);
    if (!c) continue;

    const item: RouletteStudent = {
      cif: s.cif,
      fullName: s.fullName,
      career: c,
      checkedIn: s.checkedIn,
      checkedInAt: s.checkedInAt,
    };

    groups[c].totalPaid += 1;
    groups[c].allPaid.push(item);

    if (s.checkedIn) {
      groups[c].totalRegistered += 1;
      groups[c].registered.push(item);
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

  const initialCareers = ROULETTE_CAREERS.map((c) => groups[c]);

  return (
    <RuletasClient
      initialCareers={initialCareers}
      selectedCareer={targetCareer}
    />
  );
}
