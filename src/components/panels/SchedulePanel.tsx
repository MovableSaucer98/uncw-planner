import React, { useMemo } from "react";
import type { GridSection } from "../PlannerShell";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const START_HOUR = 8;
const END_HOUR = 18;

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

type Props = {
  blocks: GridSection[];
  getColor: (subject: string) => string;
  onSelect: (b: GridSection) => void;
};

export default function SchedulePanel({ blocks, getColor, onSelect }: Props) {
  const hours = useMemo(() => {
    const arr: string[] = [];
    for (let h = START_HOUR; h <= END_HOUR; h++) arr.push(`${h}:00`);
    return arr;
  }, []);

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Schedule</h2>

      <div className="grid grid-cols-6 gap-2">
        <div>
          <div className="h-8" />
          {hours.map((h) => (
            <div key={h} className="h-12 text-xs text-gray-500 border-t">{h}</div>
          ))}
        </div>

        {DAYS.map((d) => (
          <div key={d} className="relative">
            <div className="h-8 text-center font-medium">{d}</div>
            {hours.map((h) => (
              <div key={h} className="h-12 border-t border-gray-200" />
            ))}

            {blocks
              .filter((b) => b.days.includes(d))
              .map((b, i) => {
                const top = (toMinutes(b.start) - START_HOUR * 60) * 0.8;
                const height = Math.max(28, (toMinutes(b.end) - toMinutes(b.start)) * 0.8);
                const bg = getColor(b.subject);

                return (
                  <button
                    key={`${b.id}-${i}`}
                    onClick={() => onSelect(b)}
                    title={`${b.code} ${b.title} (${b.start}–${b.end})`}
                    className="absolute left-1 right-1 rounded border text-xs text-gray-900 shadow transition hover:opacity-90 focus:outline-none"
                    style={{ top, height, background: bg, borderColor: "rgba(0,0,0,0.05)" }}
                  >
                    <div className="px-2 py-1 text-left leading-tight">
                      <div className="font-semibold truncate">{b.code}</div>
                      <div className="truncate">{b.title}</div>
                      <div className="opacity-75">{b.start}–{b.end}</div>
                    </div>
                  </button>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
