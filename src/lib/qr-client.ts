"use client";

import QRCode from "qrcode";

export const QR_PRIMARY_COLOR = "#0099A8";
export const THEME_PRIMARY_ORANGE = "#F17C30";
export const THEME_SECONDARY_TEAL = "#0099A8";

let cachedUamLogoPromise: Promise<HTMLImageElement | null> | null = null;

function loadUamLogo(): Promise<HTMLImageElement | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (cachedUamLogoPromise) return cachedUamLogoPromise;

  cachedUamLogoPromise = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = "/image/UAM.png";
  });

  return cachedUamLogoPromise;
}

/**
 * Generates a high-resolution QR code in #0099A8 with the UAM.png logo
 * centered inside a white rounded badge (using High error correction 'H').
 */
export async function generateUamQrDataUrl(
  content: string,
  size = 720
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  await QRCode.toCanvas(canvas, content, {
    width: size,
    margin: 2,
    errorCorrectionLevel: "H",
    color: {
      dark: QR_PRIMARY_COLOR,
      light: "#ffffff",
    },
  });

  const ctx = canvas.getContext("2d");
  const logo = await loadUamLogo();

  if (ctx && logo) {
    // UAM.png is wide (~1.7:1). A centered pill/rounded rect takes < 4.5% of total area,
    // well within the 30% Reed-Solomon 'H' error correction budget.
    const boxW = Math.round(size * 0.28);
    const boxH = Math.round(size * 0.16);
    const boxX = Math.round((size - boxW) / 2);
    const boxY = Math.round((size - boxH) / 2);
    const radius = Math.round(size * 0.025);

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, radius);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = Math.max(2, Math.round(size * 0.004));
    ctx.strokeStyle = QR_PRIMARY_COLOR;
    ctx.stroke();
    ctx.restore();

    const padX = Math.round(boxW * 0.1);
    const padY = Math.round(boxH * 0.14);
    const innerW = boxW - padX * 2;
    const innerH = boxH - padY * 2;

    const imgRatio = logo.width / Math.max(1, logo.height);
    let drawW = innerW;
    let drawH = drawW / imgRatio;
    if (drawH > innerH) {
      drawH = innerH;
      drawW = drawH * imgRatio;
    }

    const drawX = Math.round(boxX + (boxW - drawW) / 2);
    const drawY = Math.round(boxY + (boxH - drawH) / 2);

    ctx.drawImage(logo, drawX, drawY, drawW, drawH);
  }

  return canvas.toDataURL("image/png");
}

