"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, QrCode, ShieldCheck } from "lucide-react";

interface RegistrationPassQrProps {
  categoryLabel: string;
  fullName: string;
  subtitle: string;
  codeOrId: string;
  accentColor?: string;
}

export function RegistrationPassQr({
  categoryLabel,
  fullName,
  subtitle,
  codeOrId,
  accentColor = "#003b71",
}: RegistrationPassQrProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    const payload = JSON.stringify({
      evento: "Congreso FIA UAM 2026",
      categoria: categoryLabel,
      nombre: fullName,
      detalle: subtitle,
      codigo: codeOrId,
      verificado: true,
      fecha: new Date().toISOString(),
    });

    QRCode.toDataURL(payload, {
      width: 512,
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [categoryLabel, fullName, subtitle, codeOrId]);

  const handleDownloadPass = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    const safeName = fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    a.download = `pase-qr-fia-${safeName}.png`;
    a.click();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-center shadow-inner">
      <div className="mb-2 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
        <QrCode className="h-4 w-4 text-[#003b71]" />
        <span>Pase QR de Acreditación Digital</span>
      </div>

      <div className="mx-auto my-3 flex h-44 w-44 items-center justify-center rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
        {qrDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrDataUrl}
            alt={`Pase QR de ${fullName}`}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="h-32 w-32 animate-pulse rounded-xl bg-slate-200" />
        )}
      </div>

      <div className="mb-3 flex items-center justify-center gap-1 text-[11px] font-semibold text-emerald-700">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>Código verificado · {codeOrId}</span>
      </div>

      <button
        type="button"
        onClick={handleDownloadPass}
        disabled={!qrDataUrl}
        style={{ backgroundColor: accentColor }}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
      >
        <Download className="h-3.5 w-3.5" />
        Descargar mi Pase QR
      </button>
    </div>
  );
}

