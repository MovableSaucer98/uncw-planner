import { PLAN_ENDPOINT } from '../lib/base-url';
import { postPlan } from '../lib/planApi';
import { buildPlanRequest } from '../lib/payload';
import React, { useCallback, useMemo, useState } from "react";
import ControlsPanel from "./panels/ControlsPanel";
import DetailsPanel from "./panels/DetailsPanel";
import SchedulePanel from "./panels/SchedulePanel";

export type GridSection = {
  id: string;
  code: string;
  title: string;
  subject: string;
  days: string[];
  start: string; // 24h
  end: string;   // 24h
  credits?: number;
  meta?: any;
};

const ampmTo24 = (s: string) => {
  const m = s?.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return "00:00";
  let [_, hh, mm, ap] = m;
  let h = parseInt(hh, 10);
  ap = ap.toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${mm}`;
};

const splitDays = (s: string) => {
  const map: Record<string, string> = { M: "Mon", T: "Tue", W: "Wed", R: "Thu", F: "Fri" };
  return (s || "").split("").map((c) => map[c]).filter(Boolean);
};

export default function PlannerShell() {
  const [blocks, setBlocks] = useState<GridSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<GridSection | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelected(null);
    try {
      const payload = {
        major: "CSC",
        minor: null,
        must_take: [],
        do_not_take: [],
        summer_term: false,
        per_term_credit_caps: { default: 15 },
      };
      const res = await fetch(PLAN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Plan API ${res.status}`);
      const json = await res.json();

      const term0 = (json?.terms ?? [])[0];
      const rows: any[] = term0?.sections ?? [];

      const mapped: GridSection[] = rows.map((s, i) => ({
        id: `${s.subject}-${s.course_code}-${s.section ?? i}`,
        code: `${s.subject} ${s.course_code}`,
        title: s.title ?? "",
        subject: s.subject ?? "",
        days: splitDays(String(s.days ?? "")),
        start: ampmTo24(String(s.start_time ?? "08:00 AM")),
        end: ampmTo24(String(s.end_time ?? "09:00 AM")),
        credits: Number(s.credits ?? 0),
        meta: s,
      }));

      setBlocks(mapped);
    } catch (e: any) {
      setError(e?.message ?? "Request failed");
      setBlocks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRecalculate = useCallback(() => { fetchPlan(); }, [fetchPlan]);
  const onRevert = useCallback(() => { setBlocks([]); setSelected(null); setError(null); }, []);

  const colorsBySubject = useMemo(() => {
    const palette = ["#86efac","#93c5fd","#fca5a5","#fdba74","#c4b5fd","#67e8f9","#f9a8d4","#fde68a"];
    const seen: Record<string,string> = {};
    return (subject: string) => {
      if (!subject) return "#93c5fd";
      if (!seen[subject]) {
        const idx = Object.keys(seen).length % palette.length;
        seen[subject] = palette[idx];
      }
      return seen[subject];
    };
  }, []);

  return (
    <div className="grid grid-cols-12 gap-6 min-h-[80vh]">
      <aside className="col-span-12 lg:col-span-3 space-y-4">
        <ControlsPanel
          loading={loading}
          onGenerate={fetchPlan}
          onRecalculate={onRecalculate}
          onRevert={onRevert}
          error={error}
        />
      </aside>
      <section className="col-span-12 lg:col-span-4 space-y-4">
        <DetailsPanel selected={selected} />
      </section>
      <section className="col-span-12 lg:col-span-5 space-y-4">
        <SchedulePanel
          blocks={blocks}
          getColor={colorsBySubject}
          onSelect={(b) => setSelected(b)}
        />
      </section>
    </div>
  );
}

/** Auto-injected: Generate handler that builds payload and calls /plan */
async function onGenerateClick() {
  try {
    // Optional: attach to component state if present
    // @ts-ignore
    typeof setLoading === 'function' && setLoading(true);

    const payload = buildPlanRequest();
    const data = await postPlan(payload);

    // Expecting { terms[], recommendations?, explanations? }
    // Map to your existing state shape
    // @ts-ignore
    typeof setPlanData === 'function' && setPlanData(data);

    // @ts-ignore
    typeof setError === 'function' && setError(null);
  } catch (err) {
    console.error(err);
    // @ts-ignore
    typeof setError === 'function' && setError(String(err));
  } finally {
    // @ts-ignore
    typeof setLoading === 'function' && setLoading(false);
  }
}
