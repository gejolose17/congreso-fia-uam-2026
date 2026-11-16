"use client";

interface RegistrationShellProps {
  badge: string;
  title?: string;
  subtitle?: string;
  accentClass?: string;
  accentHex?: string;
  children: React.ReactNode;
}

export function RegistrationShell({
  badge,
  title = "Registro de ingreso",
  children,
}: RegistrationShellProps) {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#F17C30] via-[#e06d22] to-[#0099A8] px-3 py-4 text-white sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-md sm:max-w-lg">
        {/* Top Institutional Header Ribbon: FIA.png on the left, logo34.png on the right, larger & mobile-responsive */}
        <header className="mb-4 rounded-2xl border border-white/40 bg-white px-4 py-3 shadow-xl sm:mb-6 sm:rounded-3xl sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/image/FIA.png"
              alt="Facultad de Ingeniería y Arquitectura UAM"
              className="h-11 w-auto max-w-[58%] object-contain sm:h-14 md:h-16"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/image/logo34.png"
              alt="34 Aniversario UAM"
              className="h-14 w-auto shrink-0 object-contain sm:h-16 md:h-20"
            />
          </div>
        </header>

        {/* Main Form Card */}
        <div className="overflow-hidden rounded-2xl border border-white/35 bg-[#0099A8] text-white shadow-2xl sm:rounded-3xl">
          {/* Card Header in Primary #F17C30 - Only badge & "Registro de ingreso", no QR and no subtitle */}
          <div className="bg-[#F17C30] px-5 py-4 text-white sm:px-6 sm:py-5">
            <span className="inline-block rounded-full bg-[#0099A8] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
              {badge}
            </span>
            <h1 className="mt-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              {title}
            </h1>
          </div>

          {/* Form Body */}
          <div className="p-5 text-white sm:p-7">{children}</div>
        </div>

        <p className="mt-5 text-center text-xs font-semibold text-white/90">
          Congreso de Ingeniería y Arquitectura · Universidad Americana (UAM)
        </p>
      </div>
    </div>
  );
}
