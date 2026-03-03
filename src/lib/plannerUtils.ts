// Utility functions for the Academic Planner

export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  prerequisites?: string[];
  times?: string;
  professor?: string;
  alternatives?: string[];
  type: 'required' | 'flexible' | 'locked';
}

export interface SemesterPlan {
  semester: string;
  courses: Course[];
  totalCredits: number;
}

/**
 * Validates if prerequisites are met for a course
 */
export function checkPrerequisites(
  course: Course,
  completedCourses: string[]
): { met: boolean; missing: string[] } {
  if (!course.prerequisites || course.prerequisites.length === 0) {
    return { met: true, missing: [] };
  }

  const missing = course.prerequisites.filter(
    (prereq) => !completedCourses.includes(prereq)
  );

  return {
    met: missing.length === 0,
    missing,
  };
}

/**
 * Calculates total credits for a semester
 */
export function calculateSemesterCredits(courses: Course[]): number {
  return courses.reduce((total, course) => total + course.credits, 0);
}

/**
 * Generates semester labels (Fall 2024, Spring 2025, etc.)
 */
export function generateSemesterLabels(
  startYear: number,
  startSeason: 'Fall' | 'Spring',
  numberOfSemesters: number,
  includeSummer: boolean = false
): string[] {
  const semesters: string[] = [];
  let year = startYear;
  let seasonIndex = startSeason === 'Fall' ? 0 : 1;
  
  const seasons = includeSummer 
    ? ['Spring', 'Summer', 'Fall'] 
    : ['Spring', 'Fall'];

  for (let i = 0; i < numberOfSemesters; i++) {
    semesters.push(`${seasons[seasonIndex]} ${year}`);
    seasonIndex = (seasonIndex + 1) % seasons.length;
    if (seasonIndex === 0) {
      year++;
    }
  }

  return semesters;
}

/**
 * Checks for time conflicts between courses
 */
export function checkTimeConflict(
  course1: Course,
  course2: Course
): boolean {
  // This is a simplified version - you'd need to parse actual time strings
  // For now, we'll just check if the times strings are identical
  if (!course1.times || !course2.times) {
    return false;
  }
  
  return course1.times === course2.times;
}

/**
 * Sorts courses by prerequisites (courses with no prereqs first)
 */
export function sortCoursesByPrerequisites(courses: Course[]): Course[] {
  return [...courses].sort((a, b) => {
    const aPrereqs = a.prerequisites?.length || 0;
    const bPrereqs = b.prerequisites?.length || 0;
    return aPrereqs - bPrereqs;
  });
}

/**
 * Formats course time for display
 */
export function formatCourseTime(timeString?: string): string {
  if (!timeString) return 'TBA';
  return timeString;
}

/**
 * Determines the color class for a course type
 */
export function getCourseTypeColor(type: Course['type']): string {
  switch (type) {
    case 'required':
      return 'bg-green-500';
    case 'flexible':
      return 'bg-blue-500';
    case 'locked':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
}

/**
 * Parses time string to extract day and time information
 */
export function parseTimeString(timeString?: string): {
  days: string[];
  startTime: string;
  endTime: string;
} | null {
  if (!timeString) return null;

  // Example format: "MWF 10:00-11:00 AM"
  const match = timeString.match(/([MTWRF]+)\s+(\d{1,2}:\d{2})-(\d{1,2}:\d{2})\s*(AM|PM)?/);
  
  if (!match) return null;

  const [, daysString, startTime, endTime, period] = match;
  const days = daysString.split('').map(d => {
    const dayMap: Record<string, string> = {
      'M': 'Monday',
      'T': 'Tuesday',
      'W': 'Wednesday',
      'R': 'Thursday',
      'F': 'Friday'
    };
    return dayMap[d] || d;
  });

  return {
    days,
    startTime: startTime + (period ? ` ${period}` : ''),
    endTime: endTime + (period ? ` ${period}` : '')
  };
}

/**
 * Validates a semester plan against constraints
 */
export function validateSemesterPlan(
  plan: SemesterPlan,
  maxCredits: number,
  minCredits: number = 0
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Check credit limits
  if (plan.totalCredits > maxCredits) {
    warnings.push(`Semester exceeds maximum credit hours (${plan.totalCredits}/${maxCredits})`);
  }

  if (plan.totalCredits < minCredits) {
    warnings.push(`Semester below minimum credit hours (${plan.totalCredits}/${minCredits})`);
  }

  // Check for time conflicts
  for (let i = 0; i < plan.courses.length; i++) {
    for (let j = i + 1; j < plan.courses.length; j++) {
      if (checkTimeConflict(plan.courses[i], plan.courses[j])) {
        warnings.push(`Time conflict between ${plan.courses[i].code} and ${plan.courses[j].code}`);
      }
    }
  }

  return {
    valid: warnings.length === 0,
    warnings
  };
}

/**
 * Exports plan to a simple text format
 */
export function exportPlanToText(plans: SemesterPlan[]): string {
  let output = 'Academic Plan\n';
  output += '='.repeat(50) + '\n\n';

  plans.forEach(plan => {
    output += `${plan.semester} (${plan.totalCredits} credits)\n`;
    output += '-'.repeat(50) + '\n';
    
    plan.courses.forEach(course => {
      output += `${course.code} - ${course.title} (${course.credits} cr)\n`;
      if (course.times) {
        output += `  Time: ${course.times}\n`;
      }
      if (course.professor) {
        output += `  Professor: ${course.professor}\n`;
      }
    });
    
    output += '\n';
  });

  return output;
}

// --- Backend integration (add this at the very end of the file) ---
import { PLAN_ENDPOINT } from './base-url';

export interface PlanRequest {
  major?: string | null;
  minor?: string | null;
  career?: string | null;
  incoming_credits: string[];     // completed classes (codes)
  must_take: string[];            // course codes user insists on
  do_not_take: string[];          // course codes to avoid
  summer_term: boolean;
  per_term_credit_caps: Record<string, number>; // e.g., { fall: 15, spring: 15, summer: 6 }
}

export interface PlanSection {
  code: string;
  title: string;
  credits: number;
  days?: string;
  time?: string;
  required?: boolean;
  locked?: boolean;
}

export interface PlanTerm {
  term: string; // e.g., "Fall 2026"
  sections: PlanSection[];
}

export interface PlanResponse {
  terms: PlanTerm[];
  recommendations?: Record<string, unknown>;
}

/**
 * Calls the FastAPI backend to generate a multi‑semester plan.
 * Usage (in your React component): const data = await generatePlan(payload);
 */
export async function generatePlan(payload: PlanRequest): Promise<PlanResponse> {
  const res = await fetch(PLAN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Planner API error ${res.status}: ${text || res.statusText}`);
  }

  return res.json() as Promise<PlanResponse>;
}
