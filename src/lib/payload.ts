// Lightweight helpers to read the left-panel values (fallbacks included)
export type PlanRequest = {
  major: string | null;
  minor: string | null;
  must_take: string[];
  do_not_take: string[];
  summer_term: boolean;
  per_term_credit_caps: { default: number };
};

function val(id: string): string | null {
  const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
  if (!el) return null;
  const v = (el as HTMLInputElement).value ?? null;
  return v && v.trim() ? v.trim() : null;
}

function csv(id: string): string[] {
  const el = document.getElementById(id) as HTMLInputElement | null;
  if (!el || !el.value) return [];
  return el.value.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
}

function bool(id: string): boolean {
  const el = document.getElementById(id) as HTMLInputElement | null;
  return !!(el && (el.checked || el.value === 'true'));
}

function intOr(def: number, v: string | null): number {
  const n = v ? parseInt(v, 10) : NaN;
  return Number.isFinite(n) ? n : def;
}

export function buildPlanRequest(): PlanRequest {
  return {
    major: val('major') || 'CSC',
    minor: val('minor'),
    must_take: csv('must_take'),
    do_not_take: csv('do_not_take'),
    summer_term: bool('summer_term'),
    per_term_credit_caps: { default: intOr(15, val('credit_cap')) }
  };
}
