// src/pages/student/StudentCourses.tsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  Home, 
  BookOpen, 
  FileText, 
  BarChart, 
  Calendar,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut
} from "lucide-react";

type Module = {
  id: string;
  title: string;
  summary: string;
  completed: boolean;
  lessons: number;
};

type Course = {
  id: string;
  title: string;
  shortDesc: string;
  startDate: string;
  endDate: string;
  progressPercent: number;
  modules: Module[];
  instructor?: string;
  status: "ongoing" | "upcoming" | "completed";
  certificateAvailable?: boolean;
};

const MOCK_COURSES: Course[] = [
  {
    id: "c1",
    title: "Mathematics — Foundations to Advanced",
    shortDesc: "Covers arithmetic, algebra, geometry and an intro to calculus — 6 months program.",
    startDate: "2025-04-01",
    endDate: "2025-09-30",
    progressPercent: 72,
    instructor: "Ms. Geeta Rao",
    status: "ongoing",
    certificateAvailable: false,
    modules: [
      { id: "m1", title: "Numbers & Operations", summary: "Whole numbers, fractions and decimals.", completed: true, lessons: 8 },
      { id: "m2", title: "Algebra I", summary: "Expressions, equations and basic graphing.", completed: true, lessons: 10 },
      { id: "m3", title: "Geometry Basics", summary: "Shapes, area, perimeter and proofs.", completed: false, lessons: 7 },
      { id: "m4", title: "Intro to Calculus", summary: "Limits and simple derivatives.", completed: false, lessons: 5 },
    ],
  },
  {
    id: "c2",
    title: "English Language & Literature",
    shortDesc: "Reading comprehension, grammar, creative writing and public speaking.",
    startDate: "2025-07-01",
    endDate: "2025-11-30",
    progressPercent: 35,
    instructor: "Mr. R. Sharma",
    status: "ongoing",
    certificateAvailable: false,
    modules: [
      { id: "m1", title: "Grammar & Usage", summary: "Tenses, sentence structure and punctuation.", completed: true, lessons: 6 },
      { id: "m2", title: "Reading Comprehension", summary: "Techniques for analysis and speed reading.", completed: false, lessons: 8 },
      { id: "m3", title: "Creative Writing", summary: "Narrative writing and editing.", completed: false, lessons: 6 },
    ],
  },
  {
    id: "c3",
    title: "Computer Science Basics",
    shortDesc: "Introduction to programming logic and problem solving.",
    startDate: "2025-10-01",
    endDate: "2026-01-31",
    progressPercent: 0,
    instructor: "Ms. A. Iyer",
    status: "upcoming",
    certificateAvailable: false,
    modules: [
      { id: "m1", title: "Computational Thinking", summary: "Problem decomposition and algorithms.", completed: false, lessons: 4 },
      { id: "m2", title: "Intro to Python", summary: "Syntax, control flow and small programs.", completed: false, lessons: 6 },
    ],
  },
  {
    id: "c4",
    title: "Environmental Science (Elective)",
    shortDesc: "Ecosystems, sustainability and local environmental projects.",
    startDate: "2024-11-01",
    endDate: "2025-03-31",
    progressPercent: 100,
    instructor: "Dr. S. Khatri",
    status: "completed",
    certificateAvailable: true,
    modules: [
      { id: "m1", title: "Ecosystems", summary: "Biomes and food webs.", completed: true, lessons: 5 },
      { id: "m2", title: "Sustainability Projects", summary: "Local project planning and execution.", completed: true, lessons: 6 },
    ],
  },
  {
    id: "c5",
    title: "Classical Dance — Bharatanatyam Basics",
    shortDesc: "Traditional Bharatanatyam training: posture, adavus, and abhinaya.",
    startDate: "2025-08-01",
    endDate: "2026-01-31",
    progressPercent: 45,
    instructor: "Smt. L. Ramya",
    status: "ongoing",
    certificateAvailable: false,
    modules: [
      { id: "m1", title: "Adavus", summary: "Basic footwork patterns and coordination.", completed: true, lessons: 10 },
      { id: "m2", title: "Abhinaya", summary: "Facial expressions and storytelling.", completed: false, lessons: 8 },
    ],
  },
  {
    id: "c6",
    title: "Yoga — Foundation & Wellness",
    shortDesc: "Asanas, pranayama and mindfulness techniques for students.",
    startDate: "2025-09-01",
    endDate: "2026-02-28",
    progressPercent: 20,
    instructor: "Mr. R. Patel",
    status: "ongoing",
    certificateAvailable: false,
    modules: [
      { id: "m1", title: "Basic Asanas", summary: "Mountain, tree, cobra and seated poses.", completed: true, lessons: 6 },
      { id: "m2", title: "Pranayama", summary: "Breathing exercises.", completed: false, lessons: 4 },
    ],
  },
  {
    id: "c7",
    title: "Competitive Exam Prep — Foundation",
    shortDesc: "Logical reasoning, basic mathematics & general knowledge for competitive exams.",
    startDate: "2025-06-01",
    endDate: "2025-12-31",
    progressPercent: 60,
    instructor: "Mr. S. Rao",
    status: "ongoing",
    certificateAvailable: false,
    modules: [
      { id: "m1", title: "Logical Reasoning", summary: "Puzzles, sequences and critical thinking.", completed: true, lessons: 12 },
      { id: "m2", title: "Quant basics", summary: "Number properties, ratios, percentages.", completed: true, lessons: 14 },
      { id: "m3", title: "General Knowledge", summary: "Current affairs & static GK.", completed: false, lessons: 8 },
    ],
  },
];

// Sidebar navigation items with correct paths - FIXED DASHBOARD PATH
const navItems = [
  { 
    id: "dashboard", 
    label: "Dashboard", 
    icon: <Home size={20} />, 
    path: "/student/dashboard", // CHANGED FROM "/dashboard" TO "/student/dashboard"
    
  },
  { 
    id: "courses", 
    label: "My Courses", 
    icon: <BookOpen size={20} />, 
    path: "/student/courses",
   
  },
  { 
    id: "assignments", 
    label: "Assignments", 
    icon: <FileText size={20} />, 
    path: "/student/assignments",
    
  },
  { 
    id: "grades", 
    label: "Grades", 
    icon: <BarChart size={20} />, 
    path: "/student/grades",
    
  },
  { 
    id: "schedule", 
    label: "Schedule", 
    icon: <Calendar size={20} />, 
    path: "/student/schedule",
    
  },
  { 
    id: "messages", 
    label: "Messages", 
    icon: <MessageSquare size={20} />, 
    path: "/student/messages",
    description: "Communicate with teachers"
  },
];

export default function StudentCourses(): JSX.Element {
  const { id: studentId } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("courses");

  // Close mobile sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleModuleExpand = (courseId: string) => {
    setExpandedModules((prev) => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  const downloadCertificate = (course: Course) => {
    const content = `Certificate of Completion\n\nStudent: ${studentId ?? "Student"}\nCourse: ${course.title}\nDate: ${new Date().toLocaleDateString()}\n\n(This is a placeholder certificate — replace with server PDF.)`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(studentId ?? "student")}_${course.id}_certificate.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleNavigation = (path: string, id: string) => {
    setActiveNav(id);
    navigate(path);
    setMobileSidebarOpen(false);
  };

  const grouped = useMemo(() => {
    return {
      ongoing: courses.filter((c) => c.status === "ongoing"),
      upcoming: courses.filter((c) => c.status === "upcoming"),
      completed: courses.filter((c) => c.status === "completed"),
    };
  }, [courses]);

  const averageProgress = useMemo(() => {
    if (courses.length === 0) return 0;
    const total = courses.reduce((sum, c) => sum + c.progressPercent, 0);
    return Math.round(total / courses.length);
  }, [courses]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for Desktop */}
      <aside className={`
        fixed lg:relative z-40
        h-screen bg-white border-r border-gray-200
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? "w-64" : "w-20"}
        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center w-full"}`}>
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <BookOpen size={24} />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="font-bold text-lg text-gray-800">EduManage</h1>
                  <p className="text-xs text-gray-500">School Portal</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.path, item.id)}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-lg
                      transition-colors duration-200
                      ${activeNav === item.id
                        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600" 
                        : "text-gray-600 hover:bg-gray-50"
                      }
                      ${!sidebarOpen && "justify-center"}
                    `}
                  >
                    <div className={`${activeNav === item.id ? "text-blue-600" : "text-gray-400"}`}>
                      {item.icon}
                    </div>
                    {sidebarOpen && (
                      <div className="text-left">
                        <span className="font-medium block">{item.label}</span>
                        <span className="text-xs text-gray-500">{item.description}</span>
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center"}`}>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={20} className="text-blue-600" />
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">
                    Student {studentId || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">Student Account</p>
                </div>
              )}
              {sidebarOpen && (
                <button 
                  onClick={() => navigate("/login")}
                  className="p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <LogOut size={18} className="text-gray-500" />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu size={24} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">My Courses</h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Track your learning journey and progress
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                size="sm"
                className="hidden sm:flex"
              >
                Back
              </Button>
              <Button
                onClick={() => navigate("/students")}
                variant="outline"
                size="sm"
              >
                All Students
              </Button>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center lg:hidden">
                <User size={20} className="text-blue-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="text-gray-500 text-sm font-medium">Ongoing Courses</div>
                <div className="text-2xl lg:text-3xl font-bold text-blue-600 mt-2">
                  {grouped.ongoing.length}
                </div>
                <div className="text-gray-400 text-xs mt-1">Active learning</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="text-gray-500 text-sm font-medium">Completed</div>
                <div className="text-2xl lg:text-3xl font-bold text-green-600 mt-2">
                  {grouped.completed.length}
                </div>
                <div className="text-gray-400 text-xs mt-1">Finished successfully</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="text-gray-500 text-sm font-medium">Upcoming</div>
                <div className="text-2xl lg:text-3xl font-bold text-amber-600 mt-2">
                  {grouped.upcoming.length}
                </div>
                <div className="text-gray-400 text-xs mt-1">Starting soon</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="text-gray-500 text-sm font-medium">Avg. Progress</div>
                <div className="text-2xl lg:text-3xl font-bold text-purple-600 mt-2">
                  {averageProgress}%
                </div>
                <div className="text-gray-400 text-xs mt-1">Across all courses</div>
              </div>
            </div>

            {/* Ongoing Courses Section */}
            <section className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border-l-4 border-l-blue-500 p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                      Ongoing Courses
                    </h2>
                    <p className="text-gray-600 text-sm lg:text-base mt-1">
                      Continue your learning journey
                    </p>
                  </div>
                  <Badge className="w-fit" variant="default">
                    {grouped.ongoing.length} {grouped.ongoing.length === 1 ? 'course' : 'courses'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {grouped.ongoing.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      studentId={studentId}
                      expandedModules={expandedModules}
                      toggleModuleExpand={toggleModuleExpand}
                      downloadCertificate={downloadCertificate}
                      navigate={navigate}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Completed and Upcoming Courses Side by Side on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Completed Courses Section */}
              {grouped.completed.length > 0 && (
                <section className="space-y-4">
                  <div className="bg-white rounded-xl shadow-sm border-l-4 border-l-green-500 p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
                      <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                          Completed Courses
                        </h2>
                        <p className="text-gray-600 text-sm lg:text-base mt-1">
                          Courses you've completed
                        </p>
                      </div>
                      <Badge className="w-fit" variant="outline">
                        {grouped.completed.length} {grouped.completed.length === 1 ? 'course' : 'courses'}
                      </Badge>
                    </div>

                    <div className="space-y-4 lg:space-y-6">
                      {grouped.completed.map((course) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          studentId={studentId}
                          expandedModules={expandedModules}
                          toggleModuleExpand={toggleModuleExpand}
                          downloadCertificate={downloadCertificate}
                          navigate={navigate}
                          isCompleted
                        />
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Upcoming Courses Section */}
              {grouped.upcoming.length > 0 && (
                <section className="space-y-4">
                  <div className="bg-white rounded-xl shadow-sm border-l-4 border-l-amber-500 p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
                      <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                          Upcoming Courses
                        </h2>
                        <p className="text-gray-600 text-sm lg:text-base mt-1">
                          Courses starting soon
                        </p>
                      </div>
                      <Badge className="w-fit" variant="secondary">
                        {grouped.upcoming.length} {grouped.upcoming.length === 1 ? 'course' : 'courses'}
                      </Badge>
                    </div>

                    <div className="space-y-4 lg:space-y-6">
                      {grouped.upcoming.map((course) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          studentId={studentId}
                          expandedModules={expandedModules}
                          toggleModuleExpand={toggleModuleExpand}
                          downloadCertificate={downloadCertificate}
                          navigate={navigate}
                          isUpcoming
                        />
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Footer Note */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Tip: Replace mock data with your API endpoints. For each course, provide: modules list, lessons, status & certificate URL.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Showing {courses.length} total courses • Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Separate Course Card Component for better organization
interface CourseCardProps {
  course: Course;
  studentId?: string;
  expandedModules: Record<string, boolean>;
  toggleModuleExpand: (courseId: string) => void;
  downloadCertificate: (course: Course) => void;
  navigate: (path: string) => void;
  isCompleted?: boolean;
  isUpcoming?: boolean;
}

function CourseCard({
  course,
  studentId,
  expandedModules,
  toggleModuleExpand,
  downloadCertificate,
  navigate,
  isCompleted = false,
  isUpcoming = false,
}: CourseCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="space-y-3">
          <div>
            <CardTitle className="text-lg lg:text-xl text-gray-800">
              {course.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {course.shortDesc}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {course.instructor}
            </Badge>
            <span className="text-xs text-gray-500">
              {course.startDate} → {course.endDate}
            </span>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-semibold">{course.progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  course.progressPercent >= 80 ? 'bg-green-600' :
                  course.progressPercent >= 50 ? 'bg-blue-600' :
                  course.progressPercent >= 30 ? 'bg-amber-600' : 'bg-red-500'
                }`}
                style={{ width: `${course.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t">
            <div className="flex flex-wrap gap-2">
              {isUpcoming && (
                <Button 
                  size="sm"
                  onClick={() => alert("Enrollment flow — implement API call")}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Enroll Now
                </Button>
              )}

              {!isUpcoming && !isCompleted && (
                <Button 
                  size="sm"
                  onClick={() => navigate(`/students/${studentId ?? "me"}/courses/${course.id}`)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Open Course
                </Button>
              )}

              <Button 
                size="sm" 
                variant="outline"
                onClick={() => downloadCertificate(course)}
              >
                {isCompleted ? "View Certificate" : "Certificate"}
              </Button>
            </div>

            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => toggleModuleExpand(course.id)}
            >
              {expandedModules[course.id] ? (
                <>
                  <span className="hidden sm:inline">Collapse Modules</span>
                  <span className="sm:hidden">Less</span>
                  <span className="ml-1">▲</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">View Modules</span>
                  <span className="sm:hidden">Modules</span>
                  <span className="ml-1">▼</span>
                </>
              )}
            </Button>
          </div>

          {/* Module List */}
          {expandedModules[course.id] && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold text-gray-700 mb-3">
                Course Modules ({course.modules.length})
              </h4>
              <div className="space-y-3">
                {course.modules.map((module) => (
                  <div 
                    key={module.id} 
                    className={`p-3 rounded-lg border ${
                      module.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-800">
                          {module.title}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {module.summary}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>Lessons: {module.lessons}</span>
                          <span>•</span>
                          <span className={
                            module.completed ? 
                            "text-green-600 font-medium" : 
                            "text-amber-600 font-medium"
                          }>
                            {module.completed ? "✓ Completed" : "⏳ Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="pt-3 border-t">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Course Timeline</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-600">Start Date</span>
                </div>
                <span className="text-sm font-medium">{course.startDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm text-gray-600">Current Progress</span>
                </div>
                <span className="text-sm font-medium">{course.progressPercent}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500" />
                  <span className="text-sm text-gray-600">End Date</span>
                </div>
                <span className="text-sm font-medium">{course.endDate}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}