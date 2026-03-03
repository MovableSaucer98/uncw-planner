import type { APIRoute } from 'astro';

// This is a placeholder API route
// Replace the logic below with actual calls to your FastAPI backend

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Example: Forward to your FastAPI backend
    // const backendUrl = import.meta.env.FASTAPI_BACKEND_URL || 'http://localhost:8000';
    // const response = await fetch(`${backendUrl}/api/generate-plan`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(body)
    // });
    // const data = await response.json();
    
    // Mock response for demonstration
    const mockPlan = generateMockPlan(body);
    
    return new Response(JSON.stringify({ plan: mockPlan }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to generate plan' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Mock plan generator for demonstration
function generateMockPlan(input: any) {
  const semesters = ['Fall 2024', 'Spring 2025', 'Fall 2025', 'Spring 2026'];
  const courses = [
    { id: '1', code: 'CS 101', title: 'Introduction to Computer Science', credits: 3, type: 'required', prerequisites: [], times: 'MWF 10:00-11:00 AM', professor: 'Dr. Smith' },
    { id: '2', code: 'MATH 141', title: 'Calculus I', credits: 4, type: 'required', prerequisites: [], times: 'TR 1:00-2:30 PM', professor: 'Dr. Johnson' },
    { id: '3', code: 'ENG 101', title: 'English Composition', credits: 3, type: 'required', prerequisites: [], times: 'MWF 9:00-10:00 AM', professor: 'Dr. Williams' },
    { id: '4', code: 'CS 201', title: 'Data Structures', credits: 3, type: 'required', prerequisites: ['CS 101'], times: 'MWF 11:00 AM-12:00 PM', professor: 'Dr. Brown', alternatives: ['CS 201A', 'CS 201B'] },
    { id: '5', code: 'CS 202', title: 'Algorithms', credits: 3, type: 'flexible', prerequisites: ['CS 201'], times: 'TR 10:00-11:30 AM', professor: 'Dr. Davis' },
    { id: '6', code: 'MATH 142', title: 'Calculus II', credits: 4, type: 'required', prerequisites: ['MATH 141'], times: 'TR 2:00-3:30 PM', professor: 'Dr. Miller' },
    { id: '7', code: 'CS 301', title: 'Database Systems', credits: 3, type: 'flexible', prerequisites: ['CS 201'], times: 'MWF 2:00-3:00 PM', professor: 'Dr. Wilson', alternatives: ['CS 301A'] },
    { id: '8', code: 'CS 302', title: 'Operating Systems', credits: 3, type: 'locked', prerequisites: ['CS 202'], times: 'TR 11:00 AM-12:30 PM', professor: 'Dr. Taylor' },
    { id: '9', code: 'CS 401', title: 'Software Engineering', credits: 3, type: 'required', prerequisites: ['CS 301'], times: 'MWF 1:00-2:00 PM', professor: 'Dr. Anderson' },
    { id: '10', code: 'CS 490', title: 'Senior Capstone', credits: 3, type: 'locked', prerequisites: ['CS 401'], times: 'TR 3:00-4:30 PM', professor: 'Dr. Thomas' },
  ];

  const plan = semesters.map((semester, index) => {
    const semesterCourses = courses.slice(index * 2, (index + 1) * 2 + 1);
    const totalCredits = semesterCourses.reduce((sum, course) => sum + course.credits, 0);
    
    return {
      semester,
      courses: semesterCourses,
      totalCredits
    };
  });

  return plan;
}
