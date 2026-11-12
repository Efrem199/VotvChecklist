import { cn } from "@/utils/cn";
import { UPGRADE_KEYS } from "@/data/locations";

export type Tone = "green" | "cyan" | "amber";

export function toneFor(key: string): Tone {
  if (key === "camera") return "cyan";
  if (UPGRADE_KEYS.includes(key)) return "amber";
  return "green";
}

const TONE_ON: Record<Tone, string> = {
  green: "border-phos-500/80 bg-phos-900/70 text-phos-300 shadow-[0_0_12px_rgba(108,255,92,0.28)]",
  cyan: "border-cam/70 bg-cyan-950/60 text-cam shadow-[0_0_12px_rgba(103,232,249,0.28)]",
  amber: "border-amber-glow/70 bg-amber-950/50 text-amber-glow shadow-[0_0_12px_rgba(255,180,84,0.28)]",
};

interface Props {
  label: string;
  checked: boolean;
  tone?: Tone;
  compact?: boolean;
  onToggle: () => void;
}

export default function TaskChip({ label, checked, tone = "green", compact, onToggle }: Props) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onToggle}
      className={cn(
        "group/chip inline-flex select-none items-center gap-1.5 border px-2 py-1 text-[11px] uppercase tracking-wider transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-phos-400",
        checked
          ? TONE_ON[tone]
          : "border-ink-600 bg-ink-950/40 text-phos-700 hover:border-phos-700 hover:text-phos-500",
        compact && "px-1.5 py-0.5 text-[10px]",
      )}
      title={checked ? `${label}: отмечено` : `${label}: не отмечено`}
    >
      <span className="font-bold tabular-nums">{checked ? "[■]" : "[ ]"}</span>
      <span>{label}</span>
    </button>
  );
}
