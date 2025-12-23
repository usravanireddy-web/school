// src/pages/student/StudentProfile.tsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  LogOut,
  Users,
  Phone,
  Mail,
  Download,
  Edit,
  ArrowLeft,
  CalendarDays,
  MessageCircle,
  CreditCard,
  FileText as FileTextIcon,
  UserPlus,
  GraduationCap,
  BookMarked
} from "lucide-react";

type Payment = { id: number; date: string; amount: number; note?: string };
type Grade = { subject: string; grade: string };
type Student = {
  id: string;
  name: string;
  class: string;
  section: string;
  roll: number;
  feeDue: number;
  cgpa: number;
  photoUrl?: string;
  phone?: string;
  email?: string;
  attendancePercent?: number;
  recentGrades?: Grade[];
  payments?: Payment[];
  notes?: string;
};

/** Mock data for local testing (10 students) */
const STUDENTS_DATA: Student[] = [
  {
    id: "10",
    name: "Aisha Khan",
    class: "8",
    section: "C",
    roll: 1,
    feeDue: 0,
    cgpa: 8.2,
    photoUrl: "https://i.pravatar.cc/150?img=10",
    phone: "+91 90000 11111",
    email: "aisha.khan@example.com",
    attendancePercent: 95,
    recentGrades: [
      { subject: "Math", grade: "A" },
      { subject: "Science", grade: "A-" },
      { subject: "English", grade: "B+" },
    ],
    payments: [{ id: 10, date: "2025-11-01", amount: 4000, note: "Term fee" }],
    notes: "Active in sports and debate. Excellent team player with strong leadership skills. Consistently participates in extracurricular activities.",
  },
  {
    id: "11",
    name: "Josh Fernandes",
    class: "11",
    section: "A",
    roll: 3,
    feeDue: 1200,
    cgpa: 7.9,
    photoUrl: "https://i.pravatar.cc/150?img=11",
    phone: "+91 90000 22222",
    email: "josh.fernandes@example.com",
    attendancePercent: 89,
    recentGrades: [
      { subject: "Physics", grade: "B+" },
      { subject: "Chemistry", grade: "B" },
      { subject: "Math", grade: "A-" },
    ],
    payments: [{ id: 11, date: "2025-09-10", amount: 2000, note: "Library Fee" }],
    notes: "Strong in practicals, needs focus on theory. Shows great potential in laboratory experiments.",
  },
  {
    id: "12",
    name: "Alex Thompson",
    class: "10",
    section: "A",
    roll: 12,
    feeDue: 4500,
    cgpa: 9.3,
    photoUrl: "https://i.pravatar.cc/150?img=3",
    phone: "+91 98765 43210",
    email: "alex.thompson@example.com",
    attendancePercent: 92,
    recentGrades: [
      { subject: "Math", grade: "A+" },
      { subject: "Science", grade: "A" },
      { subject: "English", grade: "A" },
    ],
    payments: [
      { id: 1, date: "2025-09-10", amount: 5000, note: "Term 1" },
      { id: 2, date: "2025-06-10", amount: 2000, note: "Activity Fee" },
    ],
    notes: "Prefers hands-on learning. Parents available on weekends. Top performer in mathematics.",
  },
  {
    id: "13",
    name: "Meera Patel",
    class: "9",
    section: "B",
    roll: 7,
    feeDue: 0,
    cgpa: 8.7,
    photoUrl: "https://i.pravatar.cc/150?img=5",
    phone: "+91 91234 56789",
    email: "meera.patel@example.com",
    attendancePercent: 96,
    recentGrades: [
      { subject: "Math", grade: "A" },
      { subject: "Science", grade: "A" },
      { subject: "English", grade: "A-" },
    ],
    payments: [{ id: 3, date: "2025-10-01", amount: 4500, note: "Term 2" }],
    notes: "Excellent in group activities. Very creative and organized.",
  },
  {
    id: "14",
    name: "Ravi Kumar",
    class: "10",
    section: "A",
    roll: 5,
    feeDue: 1500,
    cgpa: 7.8,
    photoUrl: "https://i.pravatar.cc/150?img=12",
    phone: "+91 99887 66554",
    email: "ravi.kumar@example.com",
    attendancePercent: 88,
    recentGrades: [
      { subject: "Math", grade: "B+" },
      { subject: "Science", grade: "B" },
      { subject: "English", grade: "A-" },
    ],
    payments: [{ id: 4, date: "2025-08-05", amount: 2000, note: "School Trip" }],
    notes: "Needs encouragement for math practice tests. Shows improvement with individual attention.",
  },
  {
    id: "15",
    name: "Priya Sharma",
    class: "12",
    section: "B",
    roll: 2,
    feeDue: 0,
    cgpa: 9.1,
    photoUrl: "https://i.pravatar.cc/150?img=15",
    phone: "+91 90000 33333",
    email: "priya.sharma@example.com",
    attendancePercent: 97,
    recentGrades: [
      { subject: "Biology", grade: "A+" },
      { subject: "Chemistry", grade: "A" },
      { subject: "English", grade: "A" },
    ],
    payments: [{ id: 15, date: "2025-10-20", amount: 6000, note: "Final term fee" }],
    notes: "Applying for medical entrance; very focused and determined.",
  },
  {
    id: "16",
    name: "Karan Verma",
    class: "7",
    section: "A",
    roll: 9,
    feeDue: 500,
    cgpa: 7.2,
    photoUrl: "https://i.pravatar.cc/150?img=16",
    phone: "+91 90000 44444",
    email: "karan.verma@example.com",
    attendancePercent: 84,
    recentGrades: [
      { subject: "Math", grade: "B" },
      { subject: "EVS", grade: "B+" },
      { subject: "English", grade: "B-" },
    ],
    payments: [{ id: 16, date: "2025-07-05", amount: 500, note: "Misc" }],
    notes: "Shy in class; warms up with encouragement. Good at art.",
  },
  {
    id: "17",
    name: "Sana Reddy",
    class: "8",
    section: "B",
    roll: 11,
    feeDue: 0,
    cgpa: 8.6,
    photoUrl: "https://i.pravatar.cc/150?img=17",
    phone: "+91 90000 55555",
    email: "sana.reddy@example.com",
    attendancePercent: 94,
    recentGrades: [
      { subject: "Math", grade: "A" },
      { subject: "Science", grade: "A" },
      { subject: "Social", grade: "A-" },
    ],
    payments: [{ id: 17, date: "2025-09-15", amount: 3000, note: "Term fee" }],
    notes: "Great in art and extracurriculars. Very punctual.",
  },
  {
    id: "18",
    name: "Arjun Das",
    class: "9",
    section: "C",
    roll: 6,
    feeDue: 2500,
    cgpa: 7.5,
    photoUrl: "https://i.pravatar.cc/150?img=18",
    phone: "+91 90000 66666",
    email: "arjun.das@example.com",
    attendancePercent: 86,
    recentGrades: [
      { subject: "Math", grade: "B+" },
      { subject: "Science", grade: "B" },
      { subject: "English", grade: "B+" },
    ],
    payments: [{ id: 18, date: "2025-08-20", amount: 1500, note: "Transport" }],
    notes: "Enjoys coding club; needs practice in writing.",
  },
  {
    id: "19",
    name: "Nisha Gupta",
    class: "11",
    section: "C",
    roll: 4,
    feeDue: 0,
    cgpa: 8.9,
    photoUrl: "https://i.pravatar.cc/150?img=19",
    phone: "+91 90000 77777",
    email: "nisha.gupta@example.com",
    attendancePercent: 98,
    recentGrades: [
      { subject: "Math", grade: "A" },
      { subject: "Physics", grade: "A" },
      { subject: "Chemistry", grade: "A-" },
    ],
    payments: [{ id: 19, date: "2025-10-05", amount: 5000, note: "Term fee" }],
    notes: "Top performer; helps classmates as peer tutor.",
  },
];

// Sidebar navigation items
const navItems = [
  { 
    id: "dashboard", 
    label: "Dashboard", 
    icon: <Home size={20} />, 
    path: "/dashboard",
    description: "Overview and analytics"
  },
  { 
    id: "courses", 
    label: "My Courses", 
    icon: <BookOpen size={20} />, 
    path: "/student/courses",
    description: "View and manage courses"
  },
  { 
    id: "assignments", 
    label: "Assignments", 
    icon: <FileText size={20} />, 
    path: "/student/assignments",
    description: "View assignments and submissions"
  },
  { 
    id: "grades", 
    label: "Grades", 
    icon: <BarChart size={20} />, 
    path: "/student/grades",
    description: "View grades and progress"
  },
  { 
    id: "schedule", 
    label: "Schedule", 
    icon: <Calendar size={20} />, 
    path: "/student/schedule",
    description: "Class schedule and calendar"
  },
  { 
    id: "messages", 
    label: "Messages", 
    icon: <MessageSquare size={20} />, 
    path: "/student/messages",
    description: "Communicate with teachers"
  },
  { 
    id: "students", 
    label: "Students", 
    icon: <Users size={20} />, 
    path: "/students",
    active: true,
    description: "Manage student profiles"
  },
];

export default function StudentProfile(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("students");

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

  const handleNavigation = (path: string, navId: string) => {
    setActiveNav(navId);
    navigate(path);
    setMobileSidebarOpen(false);
  };

  // Choose base path depending on current location so links adapt to either /dashboard/students or /students
  const baseStudentsPath = location.pathname.startsWith("/dashboard")
    ? "/dashboard/students"
    : "/students";

  // Find selected student if id present
  const selected = id ? STUDENTS_DATA.find((s) => s.id === id) ?? null : null;

  // Helper: client-side download (simple text/timetable demo)
  const downloadTimetableFor = (student: Student) => {
    const content = `Timetable for ${student.name}\n\n(Mock timetable — replace with real file from API)`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${student.name.replace(/\s+/g, "_")}_timetable.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handlePhoneClick = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s+/g, '')}`;
  };

  // LIST VIEW (no :id param) ------------------------------------------------
  if (!id) {
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
                  <Users size={24} />
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
                    <p className="font-medium text-sm text-gray-800 truncate">Admin User</p>
                    <p className="text-xs text-gray-500 truncate">Administrator Account</p>
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
                  <h1 className="text-xl font-bold text-gray-800">Student Management</h1>
                  <p className="text-sm text-gray-600 hidden sm:block">
                    Manage all student profiles and information
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
                  <ArrowLeft size={16} className="mr-2" />
                  Back
                </Button>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center lg:hidden">
                  <User size={20} className="text-blue-600" />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              {/* Students List View */}
              <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-800">All Students</h2>
                    <p className="text-gray-600 text-sm lg:text-base mt-1">Manage and view student profiles</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => navigate(`${baseStudentsPath}/new`)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <UserPlus size={18} className="mr-2" />
                      Add New Student
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                  {STUDENTS_DATA.map((s) => (
                    <Card key={s.id} className="hover:shadow-lg transition-all duration-300 border border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-4">
                          <img 
                            src={s.photoUrl} 
                            alt={s.name} 
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                          />
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg text-gray-800 truncate">{s.name}</CardTitle>
                            <div className="text-sm text-gray-600">
                              Class {s.class} • Sec {s.section}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Roll: {s.roll}</div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant={s.feeDue === 0 ? "default" : "secondary"}>
                              {s.feeDue === 0 ? "Fees Clear" : `Due: ₹${s.feeDue}`}
                            </Badge>
                            <Badge variant="outline">
                              CGPA: {s.cgpa}
                            </Badge>
                          </div>
                          
                          <div className="pt-2">
                            <Button
                              onClick={() => navigate(`${baseStudentsPath}/${s.id}`)}
                              className="w-full bg-blue-600 hover:bg-blue-700"
                              size="sm"
                            >
                              <User size={16} className="mr-2" />
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center text-sm text-gray-600">
                    Showing {STUDENTS_DATA.length} students • Last updated: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>

              <Outlet />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // NOT FOUND VIEW (id present but no matching record) -----------------------
  if (id && !selected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Student not found</h2>
          <p className="text-gray-600 mb-6">
            No student found with ID: <strong>{id}</strong>
          </p>
          <Button 
            onClick={() => navigate(baseStudentsPath)} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Students List
          </Button>
        </div>
      </div>
    );
  }

  // PROFILE VIEW (valid selected student) -----------------------------------
  const s = selected as Student;

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
                <Users size={24} />
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
                  <p className="font-medium text-sm text-gray-800 truncate">Admin User</p>
                  <p className="text-xs text-gray-500 truncate">Administrator Account</p>
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
                <h1 className="text-xl font-bold text-gray-800">Student Profile</h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  View and manage student information
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate(baseStudentsPath)}
                variant="outline"
                size="sm"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to List
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
            {/* Student Header Card */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={s.photoUrl} 
                    alt={`${s.name} photo`} 
                    className="w-24 h-24 lg:w-28 lg:h-28 rounded-xl object-cover border-4 border-white shadow-lg"
                  />
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{s.name}</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        <GraduationCap size={14} className="mr-1" />
                        Class {s.class} • Section {s.section}
                      </Badge>
                      <Badge variant="outline">
                        <BookMarked size={14} className="mr-1" />
                        Roll: {s.roll}
                      </Badge>
                      <Badge variant={s.feeDue === 0 ? "default" : "secondary"}>
                        {s.feeDue === 0 ? "Fees Clear" : `Fee Due: ₹${s.feeDue}`}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={() => navigate(`${baseStudentsPath}/${s.id}/edit`)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" onClick={() => downloadTimetableFor(s)}>
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>

            {/* Main grid: profile + sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact & Stats Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User size={20} />
                      Contact & Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Phone Number</div>
                          <div className="flex items-center gap-2">
                            <Phone size={16} className="text-gray-400" />
                            <span className="font-medium">{s.phone ?? "-"}</span>
                            {s.phone && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handlePhoneClick(s.phone!)}
                                className="ml-2"
                              >
                                Call
                              </Button>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Email Address</div>
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-gray-400" />
                            <span className="font-medium">{s.email ?? "-"}</span>
                            {s.email && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleEmailClick(s.email!)}
                                className="ml-2"
                              >
                                Email
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="text-xs text-blue-600 mb-1">Attendance</div>
                            <div className="text-xl font-bold text-blue-700">{s.attendancePercent ?? 0}%</div>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="text-xs text-green-600 mb-1">CGPA</div>
                            <div className="text-xl font-bold text-green-700">{s.cgpa}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Grades Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart size={20} />
                      Recent Grades
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {s.recentGrades && s.recentGrades.length > 0 ? (
                        s.recentGrades.map((g) => (
                          <div key={g.subject} className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                            <div className="text-sm text-gray-500 mb-1">{g.subject}</div>
                            <div className="text-2xl font-bold text-gray-800">{g.grade}</div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-8 text-gray-500">
                          No grades recorded yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Teacher Notes Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileTextIcon size={20} />
                      Teacher Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">{s.notes ?? "No notes yet."}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Quick Actions & Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button 
                        onClick={() => downloadTimetableFor(s)} 
                        variant="outline" 
                        className="w-full justify-start"
                      >
                        <CalendarDays size={16} className="mr-2" />
                        Download Timetable
                      </Button>
                      <Button 
                        onClick={() => navigate(`${baseStudentsPath}/${s.id}/exams`)} 
                        variant="outline" 
                        className="w-full justify-start"
                      >
                        <Calendar size={16} className="mr-2" />
                        View Exam Schedule
                      </Button>
                      <Button 
                        onClick={() => handleEmailClick(s.email!)} 
                        variant="outline" 
                        className="w-full justify-start"
                        disabled={!s.email}
                      >
                        <MessageCircle size={16} className="mr-2" />
                        Message Parent
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment History Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard size={20} />
                      Payment History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {s.payments && s.payments.length > 0 ? (
                        s.payments.map((p) => (
                          <div key={p.id} className="p-3 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">₹{p.amount}</div>
                                <div className="text-xs text-gray-500">{p.date}</div>
                              </div>
                              <Badge variant="outline">{p.note}</Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          No payments recorded
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Other Students Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Other Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {STUDENTS_DATA
                        .filter((other) => other.id !== s.id)
                        .slice(0, 5)
                        .map((other) => (
                          <Button
                            key={other.id}
                            onClick={() => navigate(`${baseStudentsPath}/${other.id}`)}
                            variant="ghost"
                            className="w-full justify-start py-2 h-auto"
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src={other.photoUrl} 
                                alt={other.name} 
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="text-left">
                                <div className="font-medium text-sm">{other.name}</div>
                                <div className="text-xs text-gray-500">
                                  Class {other.class} • Sec {other.section}
                                </div>
                              </div>
                            </div>
                          </Button>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}