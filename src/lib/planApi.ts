import { PLAN_ENDPOINT } from './base-url';
import type { PlanRequest } from './payload';

export async function postPlan(payload: PlanRequest) {
  const res = await fetch(PLAN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'omit',
    mode: 'cors',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Plan API ${res.status} ${res.statusText} ${text && '- ' + text}`);
  }
  return res.json();
}
