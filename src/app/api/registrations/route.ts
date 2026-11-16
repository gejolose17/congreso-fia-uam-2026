import { NextRequest, NextResponse } from "next/server";
import { FIA_CAREERS } from "@/lib/constants";
import { createRegistration } from "@/lib/db";
import { notifyDashboardUpdate } from "@/lib/events";
import { syncPendingToGoogleSheets } from "@/lib/google";
import type { RegistrationCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      category?: RegistrationCategory;
      company?: string;
      firstName?: string;
      lastName?: string;
      career?: string;
    };

    const category = body.category;
    const firstName = body.firstName?.trim() || "";
    const lastName = body.lastName?.trim() || "";
    const company = body.company?.trim() || "";
    const career = body.career?.trim() || "";

    if (!category || !["sponsor", "teacher", "guest"].includes(category)) {
      return NextResponse.json(
        { error: "Categoría de registro inválida." },
        { status: 400 }
      );
    }

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "Nombre y apellido son obligatorios." },
        { status: 400 }
      );
    }

    if (category === "sponsor" && !company) {
      return NextResponse.json(
        { error: "Debes seleccionar tu empresa patrocinadora." },
        { status: 400 }
      );
    }

    if (
      category === "teacher" &&
      !FIA_CAREERS.includes(career as (typeof FIA_CAREERS)[number])
    ) {
      return NextResponse.json(
        { error: "Debes seleccionar una de las 3 carreras de la FIA." },
        { status: 400 }
      );
    }

    const registration = await createRegistration({
      category,
      company: category === "sponsor" ? company : null,
      firstName,
      lastName,
      career: category === "teacher" ? career : null,
    });

    await syncPendingToGoogleSheets().catch(() => null);
    notifyDashboardUpdate();

    return NextResponse.json({ ok: true, registration }, { status: 201 });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "No se pudo guardar el registro. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
