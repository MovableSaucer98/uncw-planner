# Academic Planner - AI-Assisted University Schedule Planner

An intelligent course planning application that helps university students create optimized multi-semester schedules based on their major, completed courses, constraints, and career goals.

## Features

### 🎓 Smart Planning
- AI-powered schedule generation
- Multi-semester plan creation
- Prerequisite tracking and management
- Career-aligned course suggestions

### 📅 Flexible Scheduling
- Variable credit hours per term
- Summer term support
- Customizable constraints
- Easy course swapping and rescheduling

### 📚 Course Management
- Track completed courses
- Specify must-take courses
- Avoid specific courses
- View course details, prerequisites, and alternatives

### 🎨 User Interface
- **Left Panel (Controls)**: Profile inputs, constraints, and course lists
- **Middle Panel (Course Details)**: Detailed information about selected courses
- **Right Panel (Schedule)**: Week-view calendar with semester navigation

### 🌈 Visual Indicators
- **Green (Required)**: Mandatory courses for your degree
- **Blue (Flexible)**: Courses with alternative sections/times
- **Orange (Locked)**: No-flexibility courses with fixed schedules

## Pages

- **Home** (`/`): Landing page with features and benefits
- **Planner** (`/planner`): Main planning interface
- **About** (`/about`): Information about the application
- **FAQ** (`/faq`): Frequently asked questions

## Tech Stack

- **Framework**: Astro + React
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Cloudflare Workers

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Connecting to FastAPI Backend

The application includes a placeholder API endpoint at `src/pages/api/generate-plan.ts`. To connect to your FastAPI backend:

1. Set your backend URL in `.env`:
   ```
   FASTAPI_BACKEND_URL=http://localhost:8000
   ```

2. Update the API route to forward requests to your backend:
   ```typescript
   const backendUrl = import.meta.env.FASTAPI_BACKEND_URL;
   const response = await fetch(`${backendUrl}/api/generate-plan`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(body)
   });
   ```

## API Structure

### Generate Plan Endpoint

**Request** (`POST /api/generate-plan`):
```json
{
  "major": "Computer Science",
  "minor": "Mathematics",
  "desiredCareer": "Software Engineer",
  "defaultCredits": 15,
  "semesterCredits": {},
  "includeSummer": false,
  "completedCourses": ["CS 101", "MATH 141"],
  "mustTakeCourses": ["CS 301"],
  "doNotTakeCourses": ["CS 250"]
}
```

**Response**:
```json
{
  "plan": [
    {
      "semester": "Fall 2024",
      "courses": [
        {
          "id": "1",
          "code": "CS 201",
          "title": "Data Structures",
          "credits": 3,
          "type": "required",
          "prerequisites": ["CS 101"],
          "times": "MWF 10:00-11:00 AM",
          "professor": "Dr. Smith",
          "alternatives": ["CS 201A", "CS 201B"]
        }
      ],
      "totalCredits": 15
    }
  ]
}
```

## Customization

### Styling
- Edit `src/styles/global.css` for global styles
- Modify `generated/webflow.css` variables for theme colors
- Update shadcn/ui components in `src/components/ui/`

### Components
- Main planner: `src/components/Planner.tsx`
- Navigation: `src/components/Navigation.tsx`
- Footer: `src/components/Footer.tsx`

### Pages
- Home: `src/pages/index.astro`
- Planner: `src/pages/planner.astro`
- About: `src/pages/about.astro`
- FAQ: `src/pages/faq.astro`

## Future Enhancements

- [ ] User authentication and plan saving
- [ ] Export plans to PDF/CSV
- [ ] Print-friendly views
- [ ] Course search and filtering
- [ ] Degree progress tracking
- [ ] Integration with university course catalogs
- [ ] Collaborative planning features
- [ ] Mobile app

## License

This project is built for educational purposes.

## Support

For questions or issues, please refer to the FAQ page or contact support.
