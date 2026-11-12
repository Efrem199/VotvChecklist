import { cn } from "@/utils/cn";
import type { LogEntry } from "@/lib/state";

function fmt(t: number) {
  const d = new Date(t);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function EventLog({ log }: { log: LogEntry[] }) {
  return (
    <div>
      <p className="panel-title mb-2">Журнал событий</p>
      {log.length === 0 ? (
        <p className="text-xs text-phos-700">
          Здесь появятся события после ваших отметок.
        </p>
      ) : (
        <ul className="space-y-1 text-[11px] leading-snug">
          {log.map((e, i) => (
            <li key={e.t + "-" + i} className={cn("flex gap-2", i === 0 ? "text-phos-300 animate-rise" : "text-phos-600")}>
              <span className="shrink-0 tabular-nums text-phos-700">
                [д.{String(e.day).padStart(2, "0")} {fmt(e.t)}]
              </span>
              <span className={cn("min-w-0 truncate", !e.ok && "text-phos-700 line-through decoration-phos-800")}>{e.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
