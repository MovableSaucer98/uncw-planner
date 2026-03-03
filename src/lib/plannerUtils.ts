import { PLAN_ENDPOINT } from './base-url';

export interface PlanRequest {
  major?: string;
  minor?: string;
  career?: string;
  completed?: string[];
  must_take?: string[];
  do_not_take?: string[];
  per_term_credit_caps?: Record<string, number>;
  summer_term?: boolean;
}

export interface PlanResponse {
  terms: Array<{
    name: string;
    sections: Array<{
      code: string;
      title: string;
      credits: number;
      days?: string;
      time?: string;
      required?: boolean;
      locked?: boolean;
    }>;
  }>;
  recommendations?: Record<string, any>;
}

export async function generatePlan(payload: PlanRequest): Promise<PlanResponse> {
  const res = await fetch(PLAN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Plan API ${res.status}: ${text}`);
  }
  return res.json();
}
