"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ExternalLink,
  Monitor,
  Play,
  QrCode,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Trophy,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import type {
  RouletteCareer,
  RouletteCareerGroup,
  RouletteStudent,
} from "@/lib/types";

export const CAREER_SCREENS: Array<{
  slug: string;
  screenNumber: number;
  career: RouletteCareer;
  title: string;
  subtitle: string;
}> = [
  {
    slug: "arquitectura",
    screenNumber: 1,
    career: "Arquitectura",
    title: "Pantalla 1 · Ruleta de Arquitectura",
    subtitle: "Sorteo exclusivo para estudiantes registrados de Arquitectura",
  },
  {
    slug: "ingenieria-civil",
    screenNumber: 2,
    career: "Ingeniería Civil",
    title: "Pantalla 2 · Ruleta de Ingeniería Civil",
    subtitle:
      "Sorteo exclusivo para estudiantes registrados de Ingeniería Civil",
  },
  {
    slug: "ingenieria-industrial",
    screenNumber: 3,
    career: "Ingeniería Industrial",
    title: "Pantalla 3 · Ruleta de Ingeniería Industrial",
    subtitle:
      "Sorteo exclusivo para estudiantes registrados de Ingeniería Industrial",
  },
];

interface RuletasClientProps {
  initialCareers: RouletteCareerGroup[];
  selectedCareer?: RouletteCareer | null;
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

interface DedicatedScreenWheelProps {
  group: RouletteCareerGroup;
  screenMeta: (typeof CAREER_SCREENS)[number];
  useSimulationPool: boolean;
  excludeWinners: boolean;
  winners: WinnerEntry[];
  soundEnabled: boolean;
  onToggleSimulation: (val: boolean) => void;
  onToggleExcludeWinners: (val: boolean) => void;
  onWinnerSelected: (student: RouletteStudent) => void;
  onResetCareerWinners: () => void;
}

function DedicatedScreenWheel({
  group,
  screenMeta,
  useSimulationPool,
  excludeWinners,
  winners,
  soundEnabled,
  onToggleSimulation,
  onToggleExcludeWinners,
  onWinnerSelected,
  onResetCareerWinners,
}: DedicatedScreenWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<RouletteStudent | null>(
    null
  );
  const [searchFilter, setSearchFilter] = useState("");
  const animRef = useRef<number | null>(null);
  const rotationRef = useRef(0);

  const rawPool = useSimulationPool ? group.allPaid : group.registered;
  const winnerCifs = new Set(winners.map((w) => w.cif));
  const participants = excludeWinners
    ? rawPool.filter((s) => !winnerCifs.has(s.cif))
    : rawPool;

  const drawWheel = useCallback(
    (angleRad: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const size = canvas.width;
      const center = size / 2;
      const radius = center - 18;

      ctx.clearRect(0, 0, size, size);

      // Outer border ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, radius + 10, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.lineWidth = 5;
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
        ctx.font = "bold 22px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Esperando estudiantes registrados", center, center - 16);
        ctx.font = "16px sans-serif";
        ctx.fillText(`Carrera: ${group.career}`, center, center + 18);
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
        ctx.lineWidth = total > 60 ? 0.7 : 1.8;
        ctx.strokeStyle = "rgba(255,255,255,0.75)";
        ctx.stroke();

        // Student label
        ctx.translate(center, center);
        ctx.rotate(startAngle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#FFFFFF";
        const fontSize =
          total > 80 ? 11 : total > 45 ? 13 : total > 20 ? 15 : 18;
        ctx.font = `bold ${fontSize}px sans-serif`;
        const label = shortStudentLabel(participants[i].fullName);
        ctx.fillText(label.slice(0, 24), radius - 18, fontSize / 3);
        ctx.restore();
      }

      // Studs around rim
      const studs = 32;
      for (let i = 0; i < studs; i++) {
        const a = (i * Math.PI * 2) / studs;
        const sx = center + (radius + 5) * Math.cos(a);
        const sy = center + (radius + 5) * Math.sin(a);
        ctx.beginPath();
        ctx.arc(sx, sy, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? "#F17C30" : "#0099A8";
        ctx.fill();
      }

      // Center cap
      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, 44, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#F17C30";
      ctx.stroke();

      ctx.fillStyle = "#0099A8";
      ctx.font = "900 16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("FIA UAM", center, center);
      ctx.restore();
    },
    [participants, group.career]
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

    const randBuf = new Uint32Array(1);
    window.crypto.getRandomValues(randBuf);
    const winnerIdx = randBuf[0] % total;
    const chosenWinner = participants[winnerIdx];

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
    const duration = 4600;
    const startTime = performance.now();
    let lastSliceTick = -1;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
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
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const filteredParticipants = participants.filter((p) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.trim().toLowerCase();
    return (
      p.fullName.toLowerCase().includes(q) || p.cif.toLowerCase().includes(q)
    );
  });

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Left / Main Stage: Giant Roulette Wheel */}
      <div className="flex flex-col items-center justify-between rounded-3xl border-2 border-white/40 bg-[#0099A8] p-6 text-white shadow-2xl lg:col-span-7">
        <div className="w-full text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F17C30] px-4 py-1 text-xs font-black uppercase tracking-wider text-white shadow">
            <Monitor className="h-3.5 w-3.5" />
            {screenMeta.title}
          </span>
          <h2 className="mt-2 text-2xl font-black text-white sm:text-4xl">
            {group.career}
          </h2>
          <p className="mt-1 text-xs text-white/90 sm:text-sm">
            {screenMeta.subtitle}
          </p>
        </div>

        {/* Giant Canvas Wheel */}
        <div className="relative my-6 flex flex-col items-center justify-center">
          <div className="z-10 -mb-4 flex flex-col items-center">
            <div className="h-0 w-0 border-x-[18px] border-t-[30px] border-x-transparent border-t-[#F17C30] drop-shadow-xl" />
          </div>

          <canvas
            ref={canvasRef}
            width={520}
            height={520}
            className="h-[320px] w-[320px] max-w-full rounded-full shadow-2xl sm:h-[460px] sm:w-[460px]"
          />
        </div>

        <button
          type="button"
          onClick={spinWheel}
          disabled={spinning || participants.length === 0}
          className="flex w-full max-w-md items-center justify-center gap-2.5 rounded-2xl bg-[#F17C30] px-6 py-4 text-lg font-black uppercase tracking-wider text-white shadow-2xl ring-2 ring-white/40 transition hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play className="h-6 w-6 fill-current" />
          {spinning
            ? "Girando Ruleta..."
            : participants.length === 0
              ? "Sin estudiantes en ruleta"
              : `¡Girar Ruleta de ${group.career}!`}
        </button>
      </div>

      {/* Right Column: Winner Showcase, Controls, History & Registered List */}
      <div className="flex flex-col gap-5 lg:col-span-5">
        {/* KPI Counters */}
        <div className="grid grid-cols-3 gap-3 rounded-3xl border-2 border-white/40 bg-[#0099A8] p-4 text-center text-white shadow-xl">
          <div className="rounded-2xl bg-black/15 p-3">
            <p className="text-xs font-bold uppercase text-white/85">
              Registrados
            </p>
            <p className="mt-1 text-2xl font-black text-white sm:text-3xl">
              {group.totalRegistered}
            </p>
            <p className="text-[11px] text-white/80">
              de {group.totalPaid} inscritos
            </p>
          </div>
          <div className="rounded-2xl bg-[#F17C30] p-3 shadow">
            <p className="text-xs font-bold uppercase text-white">En Ruleta</p>
            <p className="mt-1 text-2xl font-black text-white sm:text-3xl">
              {participants.length}
            </p>
            <p className="text-[11px] text-white/95">participando</p>
          </div>
          <div className="rounded-2xl bg-black/15 p-3">
            <p className="text-xs font-bold uppercase text-white/85">
              Ganadores
            </p>
            <p className="mt-1 text-2xl font-black text-white sm:text-3xl">
              {winners.length}
            </p>
            <p className="text-[11px] text-white/80">premiados</p>
          </div>
        </div>

        {/* Winner Showcase Card */}
        {currentWinner ? (
          <div className="rounded-3xl border-2 border-white bg-[#F17C30] p-6 text-center text-white shadow-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/20 px-4 py-1 text-xs font-black uppercase tracking-wider text-white">
              <Trophy className="h-4 w-4" />
              ¡Ganador Seleccionado · {group.career}!
            </div>
            <h3 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">
              {currentWinner.fullName}
            </h3>
            <p className="mt-2 font-mono text-sm font-extrabold text-white/95 sm:text-base">
              CIF: {currentWinner.cif}
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/35 bg-[#0099A8] p-5 text-center text-white shadow-lg">
            <Award className="mx-auto h-8 w-8 text-white/90" />
            <p className="mt-2 text-sm font-extrabold text-white">
              Listo para sortear en {group.career}
            </p>
            <p className="mt-0.5 text-xs text-white/85">
              Presiona el botón naranja para girar la ruleta y elegir un ganador
              al azar.
            </p>
          </div>
        )}

        {/* Controls Card */}
        <div className="space-y-3 rounded-3xl border border-white/35 bg-[#0099A8] p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-white">
              Opciones de esta Pantalla
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-0.5 text-[11px] font-bold text-white">
              <ShieldCheck className="h-3.5 w-3.5 text-[#F17C30]" />
              Datos Resguardados
            </span>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-xs font-bold text-white sm:text-sm">
            <input
              type="checkbox"
              checked={excludeWinners}
              onChange={(e) => onToggleExcludeWinners(e.target.checked)}
              className="h-4 w-4 accent-[#F17C30]"
            />
            Excluir ganadores ya premiados de próximos giros
          </label>

          <label className="flex cursor-pointer items-center gap-2.5 text-xs font-bold text-white sm:text-sm">
            <input
              type="checkbox"
              checked={useSimulationPool}
              onChange={(e) => onToggleSimulation(e.target.checked)}
              className="h-4 w-4 accent-[#F17C30]"
            />
            Modo Prueba (incluir los {group.totalPaid} inscritos de{" "}
            {group.career})
          </label>
        </div>

        {/* Winners History */}
        <div className="rounded-3xl border border-white/35 bg-[#0099A8] p-5 text-white shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Historial de Ganadores · {group.career} ({winners.length})
            </h3>
            {winners.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setCurrentWinner(null);
                  onResetCareerWinners();
                }}
                className="inline-flex items-center gap-1 rounded-xl bg-black/25 px-2.5 py-1 text-xs font-bold text-white hover:bg-black/40"
              >
                <RotateCcw className="h-3 w-3" />
                Reiniciar lista
              </button>
            )}
          </div>

          {winners.length === 0 ? (
            <p className="py-3 text-center text-xs text-white/85">
              Aún no se han sorteado ganadores en {group.career}.
            </p>
          ) : (
            <div className="max-h-36 space-y-1.5 overflow-y-auto pr-1">
              {winners.map((w, idx) => (
                <div
                  key={`${w.cif}-${w.wonAt}`}
                  className="flex items-center justify-between rounded-xl bg-[#F17C30] px-3 py-2 text-xs font-bold text-white shadow-sm"
                >
                  <span className="truncate">
                    #{winners.length - idx} · {w.fullName}
                  </span>
                  <span className="ml-2 shrink-0 font-mono">{w.cif}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Registered Participants List */}
        <div className="rounded-3xl border border-white/35 bg-[#0099A8] p-5 text-white shadow-lg">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-white">
              <Users className="h-4 w-4" />
              Estudiantes en Ruleta ({participants.length})
            </h3>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar nombre o CIF..."
              className="rounded-xl border border-white/35 bg-white/15 px-2.5 py-1 text-xs font-semibold text-white placeholder-white/65 outline-none focus:border-[#F17C30]"
            />
          </div>

          {filteredParticipants.length === 0 ? (
            <p className="py-4 text-center text-xs text-white/85">
              No hay estudiantes registrados disponibles con ese filtro.
            </p>
          ) : (
            <div className="max-h-44 space-y-1.5 overflow-y-auto pr-1 text-xs">
              {filteredParticipants.map((p) => (
                <div
                  key={p.cif}
                  className="flex items-center justify-between rounded-xl bg-black/15 px-3 py-1.5 text-white"
                >
                  <span className="truncate font-semibold">{p.fullName}</span>
                  <span className="ml-2 shrink-0 font-mono text-[11px] font-bold">
                    {p.cif}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function RuletasClient({
  initialCareers,
  selectedCareer = null,
}: RuletasClientProps) {
  const [careers, setCareers] = useState<RouletteCareerGroup[]>(initialCareers);
  const [loading, setLoading] = useState(false);
  const [useSimulationPool, setUseSimulationPool] = useState(false);
  const [excludeWinners, setExcludeWinners] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [winnersByCareer, setWinnersByCareer] = useState<
    Record<RouletteCareer, WinnerEntry[]>
  >({
    Arquitectura: [],
    "Ingeniería Civil": [],
    "Ingeniería Industrial": [],
  });

  // Load saved winners & sync local vault backup
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

  // Automatic local vault protection for registered students
  useEffect(() => {
    try {
      const allReg = careers.flatMap((c) => c.registered);
      if (allReg.length > 0) {
        const existingRaw = localStorage.getItem("fia26_students_vault");
        const existingMap = new Map<string, RouletteStudent>();
        if (existingRaw) {
          const parsed = JSON.parse(existingRaw) as RouletteStudent[];
          if (Array.isArray(parsed)) {
            parsed.forEach((s) => existingMap.set(s.cif, s));
          }
        }
        allReg.forEach((s) => existingMap.set(s.cif, s));
        localStorage.setItem(
          "fia26_students_vault",
          JSON.stringify(Array.from(existingMap.values()))
        );
      }
    } catch {
      // ignore
    }
  }, [careers]);

  const fetchRouletteData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ruletas", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { careers?: RouletteCareerGroup[] };
        if (data.careers) {
          setCareers(data.careers);
          // If local vault has any student that the server missed, auto-restore it
          try {
            const vaultRaw = localStorage.getItem("fia26_students_vault");
            if (vaultRaw) {
              const vaultList = JSON.parse(vaultRaw) as RouletteStudent[];
              const serverCifs = new Set(
                data.careers.flatMap((c) => c.registered.map((r) => r.cif))
              );
              const missingOnServer = vaultList.filter(
                (v) => v.cif && !serverCifs.has(v.cif)
              );
              if (missingOnServer.length > 0) {
                await fetch("/api/admin/backup", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ students: missingOnServer }),
                });
              }
            }
          } catch {
            // ignore
          }
        }
      }
    } catch {
      // silent background error
    } finally {
      setLoading(false);
    }
  }, []);

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

  const handleWinnerSelected = useCallback((student: RouletteStudent) => {
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
        localStorage.setItem("fia26_roulette_winners", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const activeScreenMeta = selectedCareer
    ? CAREER_SCREENS.find((s) => s.career === selectedCareer) ||
      CAREER_SCREENS[0]
    : null;

  const activeGroup = selectedCareer
    ? careers.find((c) => c.career === selectedCareer) || careers[0]
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F17C30] via-[#e26e22] to-[#0099A8] pb-14 text-white">
      {/* Top Institutional Header */}
      <header className="sticky top-0 z-20 border-b border-white/30 bg-[#0099A8]/95 text-white shadow-lg backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={selectedCareer ? "/admin/ruletas" : "/admin/dashboard"}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F17C30] text-white shadow hover:opacity-95"
              title={
                selectedCareer
                  ? "Volver a las 3 Pantallas de Ruletas"
                  : "Volver al Dashboard"
              }
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
                  {activeScreenMeta
                    ? activeScreenMeta.title
                    : "Centro de 3 Pantallas de Ruletas · FIA UAM 2026"}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F17C30] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
                  <CheckCircle2 className="h-3 w-3" />
                  Resguardo en Nube Activo
                </span>
              </div>
              <p className="text-xs text-white/90">
                3 pantallas independientes para Arquitectura, Ingeniería Civil e
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
              Actualizar
            </button>

            <button
              type="button"
              onClick={() => setSoundEnabled((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/40 bg-white/15 px-3 py-2 text-xs font-bold text-white hover:bg-white/25"
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

        {/* Navigation Bar Between the 3 Separate Screens */}
        <div className="border-t border-white/20 bg-black/15">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2.5 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin/ruletas"
                className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition ${
                  !selectedCareer
                    ? "bg-[#F17C30] text-white shadow"
                    : "bg-white/15 text-white hover:bg-white/25"
                }`}
              >
                Menú de Pantallas
              </Link>

              {CAREER_SCREENS.map((scr) => {
                const grp = careers.find((c) => c.career === scr.career);
                const isActive = selectedCareer === scr.career;
                return (
                  <Link
                    key={scr.slug}
                    href={`/admin/ruletas/${scr.slug}`}
                    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition ${
                      isActive
                        ? "bg-[#F17C30] text-white shadow-md ring-2 ring-white"
                        : "bg-white/15 text-white hover:bg-white/25"
                    }`}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                    Pantalla {scr.screenNumber}: {scr.career} (
                    {grp?.totalRegistered ?? 0})
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 pt-6 sm:px-6">
        {selectedCareer && activeGroup && activeScreenMeta ? (
          <DedicatedScreenWheel
            group={activeGroup}
            screenMeta={activeScreenMeta}
            useSimulationPool={useSimulationPool}
            excludeWinners={excludeWinners}
            winners={winnersByCareer[activeGroup.career] || []}
            soundEnabled={soundEnabled}
            onToggleSimulation={setUseSimulationPool}
            onToggleExcludeWinners={setExcludeWinners}
            onWinnerSelected={handleWinnerSelected}
            onResetCareerWinners={() =>
              saveWinners({
                ...winnersByCareer,
                [activeGroup.career]: [],
              })
            }
          />
        ) : (
          /* 3 Separate Screens Hub Selector */
          <div className="space-y-6">
            <div className="rounded-3xl border-2 border-white/40 bg-[#0099A8] p-6 text-center text-white shadow-xl">
              <h2 className="text-2xl font-black text-white sm:text-3xl">
                Selecciona la Pantalla de Ruleta por Carrera
              </h2>
              <p className="mt-1.5 text-sm text-white/95">
                Cada carrera cuenta con su propia pantalla independiente para
                proyectar en monitores separados o pestañas independientes.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {CAREER_SCREENS.map((scr) => {
                const grp = careers.find((c) => c.career === scr.career);
                const regCount = grp?.totalRegistered ?? 0;
                const paidCount = grp?.totalPaid ?? 0;
                const winCount = (winnersByCareer[scr.career] || []).length;

                return (
                  <div
                    key={scr.slug}
                    className="flex flex-col justify-between rounded-3xl border-2 border-white/40 bg-[#0099A8] p-6 text-white shadow-2xl"
                  >
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F17C30] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow">
                        <Monitor className="h-3.5 w-3.5" />
                        Pantalla {scr.screenNumber} Independiente
                      </span>
                      <h3 className="mt-3 text-2xl font-black text-white">
                        {scr.career}
                      </h3>
                      <p className="mt-1 text-xs text-white/90">
                        {scr.subtitle}
                      </p>

                      <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-white/25 bg-black/15 p-3 text-center text-xs">
                        <div>
                          <p className="font-bold text-white/85">Registrados</p>
                          <p className="mt-0.5 text-xl font-black text-white">
                            {regCount}
                          </p>
                        </div>
                        <div className="border-x border-white/20">
                          <p className="font-bold text-white/85">Inscritos</p>
                          <p className="mt-0.5 text-xl font-black text-white">
                            {paidCount}
                          </p>
                        </div>
                        <div>
                          <p className="font-bold text-white/85">Premiados</p>
                          <p className="mt-0.5 text-xl font-black text-white">
                            {winCount}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2.5">
                      <Link
                        href={`/admin/ruletas/${scr.slug}`}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F17C30] px-5 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-xl transition hover:opacity-95"
                      >
                        <Play className="h-4 w-4 fill-current" />
                        Entrar a Pantalla {scr.screenNumber}
                      </Link>

                      <a
                        href={`/admin/ruletas/${scr.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/35 bg-white/15 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/25"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Abrir en Nueva Pestaña / Monitor {scr.screenNumber}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
