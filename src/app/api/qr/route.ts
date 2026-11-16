import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

const FORM_ROUTES: Record<
  string,
  { path: string; title: string; slug: string; darkColor: string }
> = {
  portal: {
    path: "/",
    title: "Portal General · Congreso FIA UAM 2026",
    slug: "qr-portal-general-fia-2026",
    darkColor: "#0099A8",
  },
  estudiantes: {
    path: "/registro/estudiantes",
    title: "Formulario 1 · Estudiantes UAM",
    slug: "qr-formulario-1-estudiantes-uam",
    darkColor: "#0099A8",
  },
  patrocinadores: {
    path: "/registro/patrocinadores",
    title: "Formulario 2 · Patrocinadores",
    slug: "qr-formulario-2-patrocinadores",
    darkColor: "#0099A8",
  },
  docentes: {
    path: "/registro/docentes",
    title: "Formulario 3 · Docentes UAM",
    slug: "qr-formulario-3-docentes-uam",
    darkColor: "#0099A8",
  },
  invitados: {
    path: "/registro/invitados",
    title: "Formulario 4 · Invitados Especiales",
    slug: "qr-formulario-4-invitados",
    darkColor: "#0099A8",
  },
};

function resolvePublicOrigin(req: NextRequest): string {
  const customOrigin = req.nextUrl.searchParams.get("origin")?.trim();
  if (customOrigin && /^https?:\/\//i.test(customOrigin)) {
    return customOrigin.replace(/\/$/, "");
  }

  const forwardedHost =
    req.headers.get("x-forwarded-host") || req.headers.get("host");
  const forwardedProto =
    req.headers.get("x-forwarded-proto") ||
    (forwardedHost?.includes("localhost") ? "http" : "https");

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`.replace(/\/$/, "");
  }

  if (
    process.env.NEXT_PUBLIC_APP_URL &&
    !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
  ) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  return req.nextUrl.origin.replace(/\/$/, "");
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const formKey = (searchParams.get("form") || "portal").toLowerCase();
    const customPath = searchParams.get("path");
    const customText = searchParams.get("text");
    const format = (searchParams.get("format") || "png").toLowerCase();
    const download = searchParams.get("download") === "1";

    const origin = resolvePublicOrigin(req);
    const meta = FORM_ROUTES[formKey] || FORM_ROUTES.portal;

    const targetPath = customPath
      ? customPath.startsWith("/")
        ? customPath
        : `/${customPath}`
      : meta.path;

    const qrContent = customText || `${origin}${targetPath}`;

    if (format === "json") {
      const dataUrl = await QRCode.toDataURL(qrContent, {
        width: 800,
        margin: 2,
        errorCorrectionLevel: "H",
        color: {
          dark: "#0099A8",
          light: "#ffffff",
        },
      });

      return NextResponse.json({
        ok: true,
        form: formKey,
        title: meta.title,
        url: qrContent,
        dataUrl,
      });
    }

    if (format === "svg") {
      const svg = await QRCode.toString(qrContent, {
        type: "svg",
        width: 800,
        margin: 2,
        errorCorrectionLevel: "H",
        color: {
          dark: "#0099A8",
          light: "#ffffff",
        },
      });

      return new NextResponse(svg, {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Cache-Control": "public, max-age=300",
          ...(download
            ? {
                "Content-Disposition": `attachment; filename="${meta.slug}.svg"`,
              }
            : {}),
        },
      });
    }

    const pngBuffer = await QRCode.toBuffer(qrContent, {
      type: "png",
      width: 1024,
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    });

    return new NextResponse(new Uint8Array(pngBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=300",
        ...(download
          ? {
              "Content-Disposition": `attachment; filename="${meta.slug}.png"`,
            }
          : {}),
      },
    });
  } catch (err) {
    console.error("QR generation error:", err);
    return NextResponse.json(
      { error: "No se pudo generar el código QR." },
      { status: 500 }
    );
  }
}

