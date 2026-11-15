import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Congreso FIA UAM 2026 | Registro Oficial",
  description:
    "Sistema de registro y acreditación en tiempo real para el Congreso de Ingeniería y Arquitectura de la Universidad Americana (UAM), Nicaragua.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#f4f7fb] text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}

