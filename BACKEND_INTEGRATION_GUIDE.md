# Backend Integration Guide

This guide explains how to integrate your FastAPI backend with the Academic Planner frontend.

## Quick Setup

### 1. Environment Configuration

Add to your `.env` file:
```env
FASTAPI_BACKEND_URL=http://localhost:8000
```

For production, set this in your Cloudflare Workers environment variables.

### 2. Update API Route

Edit `src/pages/api/generate-plan.ts`:

```typescript
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    
    // Get backend URL from environment
    const backendUrl = locals?.runtime?.env?.FASTAPI_BACKEND_URL 
      || import.meta.env.FASTAPI_BACKEND_URL 
      || 'http://localhost:8000';
    
    // Forward request to FastAPI backend
    const response = await fetch(`${backendUrl}/api/generate-plan`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Add any authentication headers if needed
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error generating plan:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate plan',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
```

## FastAPI Backend Example

Here's what your FastAPI backend should implement:

### Endpoint: POST /api/generate-plan

**Request Model**:
```python
from pydantic import BaseModel
from typing import List, Dict, Optional

class GeneratePlanRequest(BaseModel):
    major: str
    minor: Optional[str] = None
    desiredCareer: Optional[str] = None
    defaultCredits: int = 15
    semesterCredits: Dict[str, int] = {}
    includeSummer: bool = False
    completedCourses: List[str] = []
    mustTakeCourses: List[str] = []
    doNotTakeCourses: List[str] = []

class Course(BaseModel):
    id: str
    code: str
    title: str
    credits: int
    type: str  # 'required' | 'flexible' | 'locked'
    prerequisites: Optional[List[str]] = []
    times: Optional[str] = None
    professor: Optional[str] = None
    alternatives: Optional[List[str]] = []

class SemesterPlan(BaseModel):
    semester: str
    courses: List[Course]
    totalCredits: int

class GeneratePlanResponse(BaseModel):
    plan: List[SemesterPlan]
```

**FastAPI Route**:
```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4321"],  # Astro dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/generate-plan", response_model=GeneratePlanResponse)
async def generate_plan(request: GeneratePlanRequest):
    """
    Generate a multi-semester academic plan based on student profile
    """
    try:
        # Your AI logic here
        # 1. Fetch major requirements
        # 2. Check prerequisites
        # 3. Generate optimal schedule
        # 4. Consider constraints and preferences
        
        plan = your_ai_function(
            major=request.major,
            minor=request.minor,
            career=request.desiredCareer,
            completed=request.completedCourses,
            must_take=request.mustTakeCourses,
            avoid=request.doNotTakeCourses,
            credits_per_term=request.defaultCredits,
            include_summer=request.includeSummer
        )
        
        return GeneratePlanResponse(plan=plan)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## Additional Endpoints (Optional)

You might want to implement these additional endpoints:

### 1. Get Course Details
```python
@app.get("/api/courses/{course_code}")
async def get_course(course_code: str):
    """Get detailed information about a specific course"""
    # Return course data
    pass
```

### 2. Validate Prerequisites
```python
@app.post("/api/validate-prerequisites")
async def validate_prerequisites(
    course_code: str, 
    completed_courses: List[str]
):
    """Check if prerequisites are met for a course"""
    # Return validation result
    pass
```

### 3. Get Alternative Courses
```python
@app.get("/api/courses/{course_code}/alternatives")
async def get_alternatives(course_code: str):
    """Get alternative courses that fulfill the same requirement"""
    # Return list of alternative courses
    pass
```

### 4. Recalculate Plan
```python
@app.post("/api/recalculate-plan")
async def recalculate_plan(
    current_plan: List[SemesterPlan],
    changes: Dict
):
    """Recalculate plan based on user modifications"""
    # Return updated plan
    pass
```

## Frontend Client Updates

To add more API calls in the frontend:

### Create API Service File

`src/lib/api.ts`:
```typescript
import { baseUrl } from './base-url';

export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  type: 'required' | 'flexible' | 'locked';
  prerequisites?: string[];
  times?: string;
  professor?: string;
  alternatives?: string[];
}

export interface SemesterPlan {
  semester: string;
  courses: Course[];
  totalCredits: number;
}

export async function generatePlan(request: {
  major: string;
  minor?: string;
  desiredCareer?: string;
  defaultCredits: number;
  semesterCredits: Record<string, number>;
  includeSummer: boolean;
  completedCourses: string[];
  mustTakeCourses: string[];
  doNotTakeCourses: string[];
}): Promise<{ plan: SemesterPlan[] }> {
  const response = await fetch(`${baseUrl}/api/generate-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    throw new Error('Failed to generate plan');
  }
  
  return response.json();
}

export async function getCourseDetails(courseCode: string): Promise<Course> {
  const response = await fetch(`${baseUrl}/api/courses/${courseCode}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch course details');
  }
  
  return response.json();
}

export async function getAlternatives(courseCode: string): Promise<string[]> {
  const response = await fetch(`${baseUrl}/api/courses/${courseCode}/alternatives`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch alternatives');
  }
  
  return response.json();
}
```

### Use in Components

Update `src/components/Planner.tsx`:
```typescript
import { generatePlan, getCourseDetails } from '../lib/api';

// In your component:
const generateBasePlan = async () => {
  setIsGenerating(true);
  try {
    const result = await generatePlan({
      major,
      minor,
      desiredCareer,
      defaultCredits: parseInt(defaultCredits),
      semesterCredits,
      includeSummer,
      completedCourses,
      mustTakeCourses,
      doNotTakeCourses,
    });
    setSemesterPlans(result.plan);
    if (result.plan.length > 0) {
      setCurrentSemester(result.plan[0].semester);
    }
  } catch (error) {
    console.error('Error generating plan:', error);
    // Show error to user
  } finally {
    setIsGenerating(false);
  }
};
```

## Error Handling

Implement proper error handling on both sides:

### Frontend
```typescript
try {
  const result = await generatePlan(data);
  // Success
} catch (error) {
  if (error instanceof Error) {
    // Show user-friendly error message
    console.error(error.message);
  }
}
```

### Backend
```python
from fastapi import HTTPException

try:
    # Your logic
    pass
except ValueError as e:
    raise HTTPException(status_code=400, detail=str(e))
except Exception as e:
    raise HTTPException(status_code=500, detail="Internal server error")
```

## CORS Configuration

For production, update CORS settings:

```python
# In production
origins = [
    "https://your-domain.com",
    "https://your-app.workers.dev"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

## Authentication (Optional)

If you need authentication:

### Backend
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def verify_token(credentials: HTTPBearer = Depends(security)):
    token = credentials.credentials
    # Verify token
    if not is_valid_token(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    return token

@app.post("/api/generate-plan")
async def generate_plan(
    request: GeneratePlanRequest,
    token: str = Depends(verify_token)
):
    # Your logic
    pass
```

### Frontend
```typescript
const response = await fetch(`${baseUrl}/api/generate-plan`, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify(request),
});
```

## Testing

### Test Backend Locally
```bash
# Start FastAPI
uvicorn main:app --reload --port 8000

# Test endpoint
curl -X POST http://localhost:8000/api/generate-plan \
  -H "Content-Type: application/json" \
  -d '{
    "major": "Computer Science",
    "defaultCredits": 15,
    "includeSummer": false,
    "completedCourses": [],
    "mustTakeCourses": [],
    "doNotTakeCourses": []
  }'
```

### Test Frontend Integration
```bash
# Start Astro dev server
npm run dev

# Navigate to planner page
# Fill in form and click "Generate Base Plan"
# Check browser console for any errors
```

## Deployment

### Backend (FastAPI)
- Deploy to your preferred platform (AWS, GCP, Heroku, etc.)
- Note the production URL

### Frontend (Cloudflare Workers)
- Set environment variable: `FASTAPI_BACKEND_URL=https://your-api.com`
- Deploy with `npm run build` and Wrangler

## Troubleshooting

### CORS Errors
- Check backend CORS middleware is configured
- Verify origin is allowed
- Check browser console for specific error

### 500 Errors
- Check backend logs
- Verify request format matches expected schema
- Test backend endpoint directly with curl

### Timeout Issues
- Increase timeout in fetch call
- Optimize backend AI processing
- Consider adding loading states

---

**Next Steps:**
1. Set up your FastAPI backend with the models above
2. Update the Astro API route to forward to your backend
3. Test the integration locally
4. Deploy both services
5. Configure production environment variables
