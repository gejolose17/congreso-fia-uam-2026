"use client";

import { useEffect, useState } from "react";
import { Download, QrCode, ShieldCheck } from "lucide-react";
import { generateUamQrDataUrl } from "@/lib/qr-client";

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

    generateUamQrDataUrl(payload, 600)
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
    <div className="rounded-2xl border border-white/30 bg-[#0099A8] p-4 text-center text-white shadow-lg">
      <div className="mb-2 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
        <QrCode className="h-4 w-4 text-white" />
        <span>Pase QR de Acreditación Digital</span>
      </div>

      <div className="mx-auto my-3 flex h-44 w-44 items-center justify-center rounded-2xl border-2 border-white bg-white p-2.5 shadow-md">
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

      <div className="mb-3 flex items-center justify-center gap-1 text-[11px] font-bold text-white">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>Código verificado · {codeOrId}</span>
      </div>

      <button
        type="button"
        onClick={handleDownloadPass}
        disabled={!qrDataUrl}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#F17C30] px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-50"
      >
        <Download className="h-3.5 w-3.5" />
        Descargar mi Pase QR
      </button>
    </div>
  );
}
