import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Plus, X, Calendar, BookOpen, AlertCircle } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

import { generatePlan, type PlanRequest } from '../lib/plannerUtils';

interface Course {
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

interface SemesterPlan {
  semester: string;
  courses: Course[];
  totalCredits: number;
}

interface GeneratePlanResponse {
  plan?: SemesterPlan[];
}

export default function Planner() {
  // Profile state
  const [major, setMajor] = useState('');
  const [minor, setMinor] = useState('');
  const [desiredCareer, setDesiredCareer] = useState('');

  // Constraints state
  const [defaultCredits, setDefaultCredits] = useState('15');
  const [semesterCredits, setSemesterCredits] = useState<Record<string, string>>({});
  const [includeSummer, setIncludeSummer] = useState(false);

  // Courses state
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [mustTakeCourses, setMustTakeCourses] = useState<string[]>([]);
  const [doNotTakeCourses, setDoNotTakeCourses] = useState<string[]>([]);
  const [newCourse, setNewCourse] = useState('');

  // Plan state
  const [semesterPlans, setSemesterPlans] = useState<SemesterPlan[]>([]);
  const [currentSemester, setCurrentSemester] = useState('Fall 2024');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const addCourse = (list: string[], setList: (courses: string[]) => void) => {
    if (newCourse.trim()) {
      setList([...list, newCourse.trim()]);
      setNewCourse('');
    }
  };

  const removeCourse = (list: string[], setList: (courses: string[]) => void, course: string) => {
    setList(list.filter(c => c !== course));
  };

  const generateBasePlan = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`${baseUrl}/api/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          major,
          minor,
          desiredCareer,
          defaultCredits: parseInt(defaultCredits),
          semesterCredits,
          includeSummer,
          completedCourses,
          mustTakeCourses,
          doNotTakeCourses,
        }),
      });
      const data = await response.json() as GeneratePlanResponse;
      setSemesterPlans(data.plan || []);
      if (data.plan && data.plan.length > 0) {
        setCurrentSemester(data.plan[0].semester);
      }
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const recalculatePlan = async () => {
    // Similar to generateBasePlan but with current state
    await generateBasePlan();
  };

  const revertChanges = () => {
    if (confirm('Are you sure you want to revert all changes?')) {
      setSemesterPlans([]);
      setSelectedCourse(null);
    }
  };

  const currentPlan = semesterPlans.find(plan => plan.semester === currentSemester);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)] p-6">
      {/* Left Panel - Controls */}
      <Card className="w-full lg:w-[40%] relative flex flex-col overflow-hidden h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Planning Controls</CardTitle>
          <CardDescription>Configure your academic plan</CardDescription>
        </CardHeader>
        <ScrollArea className="flex-1 min-h-0 overflow-auto">
          <CardContent className="space-y-6 pb-24">
            {/* Profile Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Profile
              </h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="major">Major *</Label>
                  <Input
                    id="major"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="e.g., Computer Science"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="minor">Minor</Label>
                  <Input
                    id="minor"
                    value={minor}
                    onChange={(e) => setMinor(e.target.value)}
                    placeholder="e.g., Mathematics"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="career">Desired Career</Label>
                  <Input
                    id="career"
                    value={desiredCareer}
                    onChange={(e) => setDesiredCareer(e.target.value)}
                    placeholder="e.g., Software Engineer"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Constraints Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Constraints
              </h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="defaultCredits">Default Credit Hours/Term</Label>
                  <Input
                    id="defaultCredits"
                    type="number"
                    value={defaultCredits}
                    onChange={(e) => setDefaultCredits(e.target.value)}
                    placeholder="15"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="summer"
                    checked={includeSummer}
                    onCheckedChange={(checked) => setIncludeSummer(checked as boolean)}
                  />
                  <Label htmlFor="summer" className="cursor-pointer">
                    Include Summer Terms
                  </Label>
                </div>
              </div>
            </div>

            <Separator />

            {/* Course Lists Section */}
            <Tabs defaultValue="completed" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="must">Must-Take</TabsTrigger>
                <TabsTrigger value="avoid">Avoid</TabsTrigger>
              </TabsList>

              <TabsContent value="completed" className="space-y-3 mt-4">
                <div className="flex gap-2">
                  <Input
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    placeholder="Course code"
                    onKeyPress={(e) => e.key === 'Enter' && addCourse(completedCourses, setCompletedCourses)}
                  />
                  <Button
                    size="icon"
                    onClick={() => addCourse(completedCourses, setCompletedCourses)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {completedCourses.map((course) => (
                    <div key={course} className="flex items-center justify-between bg-muted p-2 rounded">
                      <span className="text-sm">{course}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCourse(completedCourses, setCompletedCourses, course)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="must" className="space-y-3 mt-4">
                <div className="flex gap-2">
                  <Input
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    placeholder="Course code"
                    onKeyPress={(e) => e.key === 'Enter' && addCourse(mustTakeCourses, setMustTakeCourses)}
                  />
                  <Button
                    size="icon"
                    onClick={() => addCourse(mustTakeCourses, setMustTakeCourses)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {mustTakeCourses.map((course) => (
                    <div key={course} className="flex items-center justify-between bg-muted p-2 rounded">
                      <span className="text-sm">{course}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCourse(mustTakeCourses, setMustTakeCourses, course)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="avoid" className="space-y-3 mt-4">
                <div className="flex gap-2">
                  <Input
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    placeholder="Course code"
                    onKeyPress={(e) => e.key === 'Enter' && addCourse(doNotTakeCourses, setDoNotTakeCourses)}
                  />
                  <Button
                    size="icon"
                    onClick={() => addCourse(doNotTakeCourses, setDoNotTakeCourses)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {doNotTakeCourses.map((course) => (
                    <div key={course} className="flex items-center justify-between bg-muted p-2 rounded">
                      <span className="text-sm">{course}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCourse(doNotTakeCourses, setDoNotTakeCourses, course)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </ScrollArea>
        
        {/* Action Buttons - Sticky Footer */}
        <div className="mt-auto p-4 border-t bg-background sticky bottom-0 z-10 shadow-sm">
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={generateBasePlan}
              disabled={isGenerating || !major}
            >
              {isGenerating ? 'Generating...' : 'Generate Base Plan'}
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={recalculatePlan}
              disabled={semesterPlans.length === 0}
            >
              Recalculate
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={revertChanges}
              disabled={semesterPlans.length === 0}
            >
              Revert Changes
            </Button>
          </div>
        </div>
      </Card>

      {/* Middle Panel - Course Details */}
      <Card className="w-full lg:w-[30%] overflow-hidden flex flex-col min-h-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Course Details</CardTitle>
          <CardDescription>
            {selectedCourse ? 'View course information' : 'Select a course to view details'}
          </CardDescription>
        </CardHeader>
        <ScrollArea className="flex-1">
          <CardContent>
            {selectedCourse ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-2xl font-bold">{selectedCourse.code}</h3>
                      <p className="text-lg text-muted-foreground">{selectedCourse.title}</p>
                    </div>
                    <Badge
                      variant={
                        selectedCourse.type === 'required'
                          ? 'default'
                          : selectedCourse.type === 'flexible'
                          ? 'secondary'
                          : 'destructive'
                      }
                      className={
                        selectedCourse.type === 'required'
                          ? 'bg-green-500 hover:bg-green-600'
                          : selectedCourse.type === 'flexible'
                          ? 'bg-blue-500 hover:bg-blue-600'
                          : 'bg-orange-500 hover:bg-orange-600'
                      }
                    >
                      {selectedCourse.type === 'required'
                        ? 'Required'
                        : selectedCourse.type === 'flexible'
                        ? 'Flexible'
                        : 'Locked'}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4">
                  <div>
                    <Label className="text-sm font-semibold">Credits</Label>
                    <p className="text-base mt-1">{selectedCourse.credits} credit hours</p>
                  </div>

                  {selectedCourse.times && (
                    <div>
                      <Label className="text-sm font-semibold">Schedule</Label>
                      <p className="text-base mt-1">{selectedCourse.times}</p>
                    </div>
                  )}

                  {selectedCourse.professor && (
                    <div>
                      <Label className="text-sm font-semibold">Professor</Label>
                      <p className="text-base mt-1">{selectedCourse.professor}</p>
                    </div>
                  )}

                  {selectedCourse.prerequisites && selectedCourse.prerequisites.length > 0 && (
                    <div>
                      <Label className="text-sm font-semibold">Prerequisites</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedCourse.prerequisites.map((prereq) => (
                          <Badge key={prereq} variant="outline">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCourse.alternatives && selectedCourse.alternatives.length > 0 && (
                    <div>
                      <Label className="text-sm font-semibold">Alternative Courses</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedCourse.alternatives.map((alt) => (
                          <Badge key={alt} variant="secondary">
                            {alt}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    Move to Different Semester
                  </Button>
                  <Button className="w-full" variant="outline">
                    Swap with Another Course
                  </Button>
                  <Button className="w-full" variant="destructive">
                    Remove from Plan
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Click on a course in the schedule to view its details
                </p>
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>

      {/* Right Panel - Schedule */}
      <Card className="w-full lg:w-[30%] overflow-hidden flex flex-col min-h-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Schedule View</CardTitle>
              <CardDescription>Week-by-week course calendar</CardDescription>
            </div>
            <Select value={currentSemester} onValueChange={setCurrentSemester}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {semesterPlans.map((plan) => (
                  <SelectItem key={plan.semester} value={plan.semester}>
                    {plan.semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          <CardContent>
            {/* Color Legend */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500" />
                <span className="text-sm">Required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500" />
                <span className="text-sm">Flexible section/time</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-500" />
                <span className="text-sm">Locked/No flexibility</span>
              </div>
            </div>

            {currentPlan ? (
              <div className="space-y-4">
                {/* Total Credits Display */}
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Credits:</span>
                    <span className="text-2xl font-bold">{currentPlan.totalCredits}</span>
                  </div>
                </div>

                {/* Weekly Calendar Grid */}
                <div className="border rounded-lg overflow-hidden">
                  {/* Time slots header */}
                  <div className="grid grid-cols-6 bg-muted">
                    <div className="p-3 border-r border-b font-semibold text-sm">Time</div>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                      <div key={day} className="p-3 border-r border-b font-semibold text-sm text-center">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Time slots (8 AM - 8 PM) */}
                  {Array.from({ length: 12 }, (_, i) => {
                    const hour = i + 8;
                    const timeLabel = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
                    return (
                      <div key={hour} className="grid grid-cols-6 min-h-[60px]">
                        <div className="p-2 border-r border-b text-xs text-muted-foreground">
                          {timeLabel}
                        </div>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                          <div key={day} className="p-1 border-r border-b hover:bg-muted/50 transition-colors">
                            {/* Course blocks would be positioned here based on actual times */}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Course List View */}
                <div className="space-y-3 mt-6">
                  <h4 className="font-semibold text-lg">Courses This Semester</h4>
                  {currentPlan.courses.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => setSelectedCourse(course)}
                      className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-all ${
                        selectedCourse?.id === course.id ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold">{course.code}</h5>
                            <Badge
                              variant="outline"
                              className={
                                course.type === 'required'
                                  ? 'bg-green-50 border-green-500 text-green-700'
                                  : course.type === 'flexible'
                                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                                  : 'bg-orange-50 border-orange-500 text-orange-700'
                              }
                            >
                              {course.type === 'required'
                                ? 'Required'
                                : course.type === 'flexible'
                                ? 'Flexible'
                                : 'Locked'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{course.title}</p>
                          {course.times && (
                            <p className="text-xs text-muted-foreground mt-1">{course.times}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold">{course.credits} cr</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg font-semibold mb-2">No plan generated yet</p>
                <p className="text-muted-foreground">
                  Fill in your profile and constraints, then click "Generate Base Plan"
                </p>
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}





