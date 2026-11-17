"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Play,
  QrCode,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trophy,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import type {
  RouletteCareer,
  RouletteCareerGroup,
  RouletteStudent,
} from "@/app/api/admin/ruletas/route";

interface RuletasClientProps {
  initialCareers: RouletteCareerGroup[];
}

interface WinnerEntry {
  cif: string;
  fullName: string;
  career: RouletteCareer;
  wonAt: string;
}

const SLICE_COLORS = ["#F17C30", "#0099A8", "#d9641b", "#007b87"];

function playTickSound(enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(680, ctx.currentTime);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
    setTimeout(() => void ctx.close(), 80);
  } catch {
    // ignore audio restrictions
  }
}

function playWinFanfare(enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.11);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.11);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + i * 0.11 + 0.35
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.11);
      osc.stop(ctx.currentTime + i * 0.11 + 0.35);
    });
    setTimeout(() => void ctx.close(), 1000);
  } catch {
    // ignore audio restrictions
  }
}

function shortStudentLabel(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 2) return fullName;
  return `${parts[0]} ${parts[parts.length - 2] || parts[1]}`;
}

interface SingleWheelCardProps {
  group: RouletteCareerGroup;
  useSimulationPool: boolean;
  excludeWinners: boolean;
  winners: WinnerEntry[];
  soundEnabled: boolean;
  focused: boolean;
  externalSpinTrigger: number;
  onToggleFocus: () => void;
  onWinnerSelected: (student: RouletteStudent) => void;
  onResetCareerWinners: () => void;
}

function SingleWheelCard({
  group,
  useSimulationPool,
  excludeWinners,
  winners,
  soundEnabled,
  focused,
  externalSpinTrigger,
  onToggleFocus,
  onWinnerSelected,
  onResetCareerWinners,
}: SingleWheelCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<RouletteStudent | null>(
    null
  );
  const [showList, setShowList] = useState(false);
  const animRef = useRef<number | null>(null);
  const rotationRef = useRef(0);
  const lastTriggerRef = useRef(externalSpinTrigger);

  const rawPool = useSimulationPool ? group.allPaid : group.registered;
  const winnerCifs = new Set(winners.map((w) => w.cif));
  const participants = excludeWinners
    ? rawPool.filter((s) => !winnerCifs.has(s.cif))
    : rawPool;

  // Draw the wheel on canvas
  const drawWheel = useCallback(
    (angleRad: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const size = canvas.width;
      const center = size / 2;
      const radius = center - 16;

      ctx.clearRect(0, 0, size, size);

      // Outer glowing ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, radius + 8, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#F17C30";
      ctx.stroke();
      ctx.restore();

      const total = participants.length;

      if (total === 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#007b87";
        ctx.fill();
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 18px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Esperando estudiantes", center, center - 12);
        ctx.font = "14px sans-serif";
        ctx.fillText("registrados en esta carrera", center, center + 14);
        ctx.restore();
        return;
      }

      const arc = (Math.PI * 2) / total;

      for (let i = 0; i < total; i++) {
        const startAngle = angleRad + i * arc;
        const endAngle = startAngle + arc;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = SLICE_COLORS[i % SLICE_COLORS.length];
        ctx.fill();
        ctx.lineWidth = total > 60 ? 0.5 : 1.5;
        ctx.strokeStyle = "rgba(255,255,255,0.65)";
        ctx.stroke();

        // Draw label
        ctx.translate(center, center);
        ctx.rotate(startAngle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#FFFFFF";
        const fontSize =
          total > 80 ? 9 : total > 45 ? 11 : total > 20 ? 13 : 15;
        ctx.font = `bold ${fontSize}px sans-serif`;
        const label = shortStudentLabel(participants[i].fullName);
        ctx.fillText(label.slice(0, 22), radius - 14, fontSize / 3);
        ctx.restore();
      }

      // Outer decorative studs
      const studs = 24;
      for (let i = 0; i < studs; i++) {
        const a = (i * Math.PI * 2) / studs;
        const sx = center + (radius + 4) * Math.cos(a);
        const sy = center + (radius + 4) * Math.sin(a);
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? "#F17C30" : "#0099A8";
        ctx.fill();
      }

      // Center hub
      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, 34, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#F17C30";
      ctx.stroke();

      ctx.fillStyle = "#0099A8";
      ctx.font = "900 13px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("FIA UAM", center, center);
      ctx.restore();
    },
    [participants]
  );

  useEffect(() => {
    drawWheel(rotation);
  }, [drawWheel, rotation]);

  const spinWheel = useCallback(() => {
    if (spinning || participants.length === 0) return;

    setSpinning(true);
    setCurrentWinner(null);

    const total = participants.length;
    const arc = (Math.PI * 2) / total;

    // Pick a random winner index with crypto randomness if available
    const randBuf = new Uint32Array(1);
    window.crypto.getRandomValues(randBuf);
    const winnerIdx = randBuf[0] % total;
    const chosenWinner = participants[winnerIdx];

    // Pointer is at the top (-Math.PI / 2 or 3 * Math.PI / 2)
    const pointerAngle = -Math.PI / 2;
    const sliceCenterOffset = winnerIdx * arc + arc / 2;
    const extraSpins = (6 + (randBuf[0] % 4)) * Math.PI * 2;

    const currentMod =
      ((rotationRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    let targetBase = pointerAngle - sliceCenterOffset;
    targetBase = ((targetBase % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

    let delta = targetBase - currentMod;
    if (delta <= 0) delta += Math.PI * 2;

    const startRot = rotationRef.current;
    const finalRot = startRot + extraSpins + delta;
    const duration = 4500;
    const startTime = performance.now();
    let lastSliceTick = -1;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - t, 3.6);
      const currentAngle = startRot + (finalRot - startRot) * eased;

      rotationRef.current = currentAngle;
      setRotation(currentAngle);

      const currentSlice = Math.floor((currentAngle / arc) % total);
      if (currentSlice !== lastSliceTick && t < 0.96) {
        lastSliceTick = currentSlice;
        playTickSound(soundEnabled);
      }

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        setCurrentWinner(chosenWinner);
        playWinFanfare(soundEnabled);
        onWinnerSelected(chosenWinner);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [spinning, participants, soundEnabled, onWinnerSelected]);

  useEffect(() => {
    if (externalSpinTrigger > lastTriggerRef.current) {
      lastTriggerRef.current = externalSpinTrigger;
      spinWheel();
    }
  }, [externalSpinTrigger, spinWheel]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      className={`flex flex-col justify-between rounded-3xl border-2 border-white/40 bg-[#0099A8] p-5 text-white shadow-2xl transition-all ${
        focused ? "lg:col-span-3" : ""
      }`}
    >
      {/* Card Header */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F17C30] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow">
              <Award className="h-3.5 w-3.5" />
              Ruleta Oficial FIA
            </span>
            <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">
              {group.career}
            </h2>
          </div>

          <button
            type="button"
            onClick={onToggleFocus}
            className="rounded-xl border border-white/35 bg-white/15 p-2 text-white hover:bg-white/25"
            title={focused ? "Ver las 3 ruletas" : "Ampliar esta ruleta"}
          >
            {focused ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Counters */}
        <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl border border-white/25 bg-black/15 p-2.5 text-center text-xs">
          <div>
            <p className="font-bold text-white/85">Registrados</p>
            <p className="text-lg font-black text-white">
              {group.totalRegistered}
            </p>
          </div>
          <div className="border-x border-white/20">
            <p className="font-bold text-white/85">En Ruleta</p>
            <p className="text-lg font-black text-white">
              {participants.length}
            </p>
          </div>
          <div>
            <p className="font-bold text-white/85">Premiados</p>
            <p className="text-lg font-black text-white">{winners.length}</p>
          </div>
        </div>
      </div>

      {/* Wheel Canvas Container */}
      <div className="relative my-5 flex flex-col items-center justify-center">
        {/* Top Pointer Triangle */}
        <div className="z-10 -mb-3 flex flex-col items-center">
          <div className="h-0 w-0 border-x-[14px] border-t-[24px] border-x-transparent border-t-[#F17C30] drop-shadow-lg" />
        </div>

        <canvas
          ref={canvasRef}
          width={focused ? 460 : 340}
          height={focused ? 460 : 340}
          className={`max-w-full rounded-full shadow-2xl transition-transform ${
            focused ? "h-[360px] w-[360px] sm:h-[440px] sm:w-[440px]" : "h-[280px] w-[280px] sm:h-[310px] sm:w-[310px]"
          }`}
        />
      </div>

      {/* Winner Banner if selected */}
      {currentWinner && (
        <div className="mb-4 animate-bounce rounded-2xl border-2 border-white bg-[#F17C30] p-4 text-center text-white shadow-xl">
          <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-white">
            <Trophy className="h-4 w-4" />
            ¡Estudiante Ganador!
          </div>
          <p className="mt-1 text-lg font-black leading-tight text-white">
            {currentWinner.fullName}
          </p>
          <p className="mt-0.5 font-mono text-xs font-bold text-white/95">
            CIF: {currentWinner.cif} · {currentWinner.career}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={spinWheel}
          disabled={spinning || participants.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F17C30] px-5 py-3.5 text-base font-black uppercase tracking-wide text-white shadow-xl transition hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play className="h-5 w-5 fill-current" />
          {spinning
            ? "Girando Ruleta..."
            : participants.length === 0
              ? "Sin estudiantes en ruleta"
              : "Girar Ruleta"}
        </button>

        <div className="flex items-center justify-between gap-2 text-xs">
          <button
            type="button"
            onClick={() => setShowList((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/15 px-3 py-1.5 font-bold text-white hover:bg-white/25"
          >
            <Users className="h-3.5 w-3.5" />
            {showList
              ? "Ocultar participantes"
              : `Ver participantes (${participants.length})`}
          </button>

          {winners.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setCurrentWinner(null);
                onResetCareerWinners();
              }}
              className="inline-flex items-center gap-1 rounded-xl border border-white/30 bg-black/20 px-3 py-1.5 font-bold text-white hover:bg-black/30"
              title="Restaurar ganadores de esta carrera"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reiniciar ({winners.length})
            </button>
          )}
        </div>

        {/* Winners History for this career */}
        {winners.length > 0 && (
          <div className="rounded-2xl border border-white/25 bg-black/15 p-3 text-xs">
            <p className="mb-1.5 font-extrabold uppercase tracking-wider text-white">
              Ganadores de {group.career}:
            </p>
            <div className="max-h-28 space-y-1.5 overflow-y-auto pr-1">
              {winners.map((w, idx) => (
                <div
                  key={`${w.cif}-${w.wonAt}`}
                  className="flex items-center justify-between rounded-xl bg-white/15 px-2.5 py-1.5 font-semibold text-white"
                >
                  <span className="truncate">
                    #{idx + 1} {w.fullName}
                  </span>
                  <span className="ml-2 shrink-0 font-mono text-[11px] font-bold">
                    {w.cif}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expandable Participant List */}
        {showList && (
          <div className="rounded-2xl border border-white/25 bg-black/20 p-3 text-xs">
            <p className="mb-1.5 font-extrabold uppercase tracking-wider text-white">
              Estudiantes en esta ruleta ({participants.length}):
            </p>
            {participants.length === 0 ? (
              <p className="text-white/85">
                No hay estudiantes registrados disponibles en este momento.
              </p>
            ) : (
              <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
                {participants.map((p) => (
                  <div
                    key={p.cif}
                    className="flex items-center justify-between rounded-lg bg-white/10 px-2.5 py-1 text-white"
                  >
                    <span className="truncate font-medium">{p.fullName}</span>
                    <span className="ml-2 shrink-0 font-mono text-[11px] font-bold">
                      {p.cif}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function RuletasClient({ initialCareers }: RuletasClientProps) {
  const [careers, setCareers] = useState<RouletteCareerGroup[]>(initialCareers);
  const [loading, setLoading] = useState(false);
  const [useSimulationPool, setUseSimulationPool] = useState(false);
  const [excludeWinners, setExcludeWinners] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [focusedCareer, setFocusedCareer] = useState<RouletteCareer | null>(
    null
  );
  const [spinAllTrigger, setSpinAllTrigger] = useState(0);
  const [winnersByCareer, setWinnersByCareer] = useState<
    Record<RouletteCareer, WinnerEntry[]>
  >({
    Arquitectura: [],
    "Ingeniería Civil": [],
    "Ingeniería Industrial": [],
  });

  // Restore saved winners from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fia26_roulette_winners");
      if (saved) {
        const parsed = JSON.parse(saved) as Record<
          RouletteCareer,
          WinnerEntry[]
        >;
        if (parsed && typeof parsed === "object") {
          setWinnersByCareer((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const saveWinners = useCallback(
    (next: Record<RouletteCareer, WinnerEntry[]>) => {
      setWinnersByCareer(next);
      try {
        localStorage.setItem("fia26_roulette_winners", JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
    },
    []
  );

  const fetchRouletteData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ruletas", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { careers?: RouletteCareerGroup[] };
        if (data.careers) setCareers(data.careers);
      }
    } catch {
      // silent background error
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll every 6 seconds + listen to SSE stream for live check-ins
  useEffect(() => {
    const interval = setInterval(() => {
      void fetchRouletteData();
    }, 6000);

    const es = new EventSource("/api/admin/stream");
    es.addEventListener("stats", () => {
      void fetchRouletteData();
    });

    return () => {
      clearInterval(interval);
      es.close();
    };
  }, [fetchRouletteData]);

  const handleWinnerSelected = useCallback(
    (student: RouletteStudent) => {
      setWinnersByCareer((prev) => {
        const currentList = prev[student.career] || [];
        const updated: Record<RouletteCareer, WinnerEntry[]> = {
          ...prev,
          [student.career]: [
            {
              cif: student.cif,
              fullName: student.fullName,
              career: student.career,
              wonAt: new Date().toISOString(),
            },
            ...currentList,
          ],
        };
        try {
          localStorage.setItem(
            "fia26_roulette_winners",
            JSON.stringify(updated)
          );
        } catch {
          // ignore
        }
        return updated;
      });
    },
    []
  );

  const totalRegistered3Careers = careers.reduce(
    (acc, c) => acc + c.totalRegistered,
    0
  );

  const visibleCareers = focusedCareer
    ? careers.filter((c) => c.career === focusedCareer)
    : careers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F17C30] via-[#e26e22] to-[#0099A8] pb-14 text-white">
      {/* Top Institutional Header */}
      <header className="sticky top-0 z-20 border-b border-white/30 bg-[#0099A8]/95 text-white shadow-lg backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F17C30] text-white shadow hover:opacity-95"
              title="Volver al Dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-1.5 shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/FIA.png"
                alt="FIA UAM"
                className="h-8 w-auto object-contain sm:h-9"
              />
              <div className="h-7 w-px bg-slate-200" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/logo34.png"
                alt="34 Aniversario UAM"
                className="h-9 w-auto object-contain sm:h-10"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white sm:text-lg">
                  Panel de 3 Ruletas Digitales · FIA UAM 2026
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F17C30] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
                  <CheckCircle2 className="h-3 w-3" />
                  {useSimulationPool
                    ? "Modo Prueba (Inscritos)"
                    : `${totalRegistered3Careers} Registrados en Vivo`}
                </span>
              </div>
              <p className="text-xs text-white/90">
                Sorteo oficial por carrera: Arquitectura, Ingeniería Civil e
                Ingeniería Industrial
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void fetchRouletteData()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/40 bg-white/15 px-3 py-2 text-xs font-bold text-white hover:bg-white/25 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              />
              Actualizar Registrados
            </button>

            <button
              type="button"
              onClick={() => setSoundEnabled((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/40 bg-white/15 px-3 py-2 text-xs font-bold text-white hover:bg-white/25"
              title="Activar/Desactivar sonido"
            >
              {soundEnabled ? (
                <Volume2 className="h-3.5 w-3.5" />
              ) : (
                <VolumeX className="h-3.5 w-3.5" />
              )}
              {soundEnabled ? "Sonido" : "Silencio"}
            </button>

            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/40 bg-white/15 px-3 py-2 text-xs font-bold text-white hover:bg-white/25"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/qr"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/40 bg-white/15 px-3 py-2 text-xs font-bold text-white hover:bg-white/25"
            >
              <QrCode className="h-3.5 w-3.5" />
              QRs
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 pt-6 sm:px-6">
        {/* Control Bar */}
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/35 bg-[#0099A8] p-4 shadow-xl sm:px-6">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-white sm:text-sm">
              <input
                type="checkbox"
                checked={excludeWinners}
                onChange={(e) => setExcludeWinners(e.target.checked)}
                className="h-4 w-4 accent-[#F17C30]"
              />
              Excluir ganadores ya premiados de próximos giros
            </label>

            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/30 bg-black/15 px-3 py-1.5 text-xs font-bold text-white">
              <input
                type="checkbox"
                checked={useSimulationPool}
                onChange={(e) => setUseSimulationPool(e.target.checked)}
                className="h-4 w-4 accent-[#F17C30]"
              />
              Modo Prueba (incluir inscritos aún no acreditados)
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSpinAllTrigger((n) => n + 1)}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#F17C30] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg transition hover:opacity-95 active:scale-[0.99] sm:text-sm"
            >
              <Sparkles className="h-4 w-4" />
              ¡Girar las 3 Ruletas a la vez!
            </button>
          </div>
        </section>

        {/* 3 Digital Roulettes Grid */}
        <section className="grid gap-6 lg:grid-cols-3">
          {visibleCareers.map((group) => (
            <SingleWheelCard
              key={group.career}
              group={group}
              useSimulationPool={useSimulationPool}
              excludeWinners={excludeWinners}
              winners={winnersByCareer[group.career] || []}
              soundEnabled={soundEnabled}
              focused={focusedCareer === group.career}
              externalSpinTrigger={spinAllTrigger}
              onToggleFocus={() =>
                setFocusedCareer((prev) =>
                  prev === group.career ? null : group.career
                )
              }
              onWinnerSelected={handleWinnerSelected}
              onResetCareerWinners={() =>
                saveWinners({
                  ...winnersByCareer,
                  [group.career]: [],
                })
              }
            />
          ))}
        </section>
      </main>
    </div>
  );
}
