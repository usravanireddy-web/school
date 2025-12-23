// pages/AdminDashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom"; // ✅ FIX
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCog,
  BookOpen,
  Calendar,
  FileText,
  UserPlus,
  UserCheck,
  Megaphone,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  ChevronRight,
  MoreVertical,
  Download,
  Filter,
  Eye,
  Edit,
  Trash2,
  Star,
  Trophy,
  Award,
  Target,
  TrendingDown,
  Mail,
  Phone,
  BookCheck,
  School,
  BarChart3,
  PieChart,
  LineChart,
  Home,
  BookMarked,
  CreditCard,
  Bell,
  Settings,
  Search,
  Menu,
  RefreshCw,
  UsersRound,
  ChartBar,
  CalendarDays,
  FileBarChart,
  LibraryBig,
  ShieldCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Legend,
} from "recharts";

type NavItem = { title: string; href: string; icon: React.ReactNode };
type Activity = { id: number; type: string; message: string; time: string; icon: React.ReactNode };
type EventItem = { id: number; title: string; date: string; type: string; color: string };
type Student = { id: number; name: string; class: string; roll: string; guardian?: string; avatar?: string };
type Staff = { id: number; name: string; role: string; avatar?: string };
type StarStudent = { 
  id: number; 
  name: string; 
  studentId: string; 
  marks: number; 
  percentage: number; 
  year: number; 
  gender: 'Male' | 'Female';
  avatar?: string;
  rank: number;
};
type RevenueData = { month: string; revenue: number; expenses: number };
type AttendanceData = { day: string; present: number; absent: number };

const STORAGE_KEYS = {
  students: "em_students_v2",
  staff: "em_staff_v2",
  announcements: "em_announcements_v2",
  activities: "em_activities_v2",
  starStudents: "em_star_students_v2",
};

const nowLabel = () => "just now";

// Revenue chart data
const revenueData: RevenueData[] = [
  { month: 'Jan', revenue: 42000, expenses: 32000 },
  { month: 'Feb', revenue: 48000, expenses: 34000 },
  { month: 'Mar', revenue: 52000, expenses: 38000 },
  { month: 'Apr', revenue: 56000, expenses: 42000 },
  { month: 'May', revenue: 61000, expenses: 45000 },
  { month: 'Jun', revenue: 68000, expenses: 49000 },
  { month: 'Jul', revenue: 72000, expenses: 52000 },
  { month: 'Aug', revenue: 75000, expenses: 55000 },
  { month: 'Sep', revenue: 79000, expenses: 58000 },
  { month: 'Oct', revenue: 82000, expenses: 60000 },
  { month: 'Nov', revenue: 85000, expenses: 62000 },
  { month: 'Dec', revenue: 90000, expenses: 65000 },
];

// Attendance chart data
const attendanceData: AttendanceData[] = [
  { day: 'Mon', present: 420, absent: 80 },
  { day: 'Tue', present: 450, absent: 50 },
  { day: 'Wed', present: 480, absent: 20 },
  { day: 'Thu', present: 460, absent: 40 },
  { day: 'Fri', present: 440, absent: 60 },
  { day: 'Sat', present: 400, absent: 100 },
];

// Subject performance data
const subjectData = [
  { subject: 'Mathematics', score: 85, color: '#8884d8' },
  { subject: 'Science', score: 78, color: '#82ca9d' },
  { subject: 'English', score: 92, color: '#ffc658' },
  { subject: 'History', score: 68, color: '#ff8042' },
  { subject: 'Physical Ed', score: 95, color: '#0088fe' },
];

const defaultStarStudents: StarStudent[] = [
  { id: 1, name: "Evelyn Harper", studentId: "PRE:43778", marks: 1185, percentage: 98, year: 2014, gender: 'Female', rank: 1 },
  { id: 2, name: "Diana Plenty", studentId: "PRE:43774", marks: 1165, percentage: 91, year: 2014, gender: 'Female', rank: 3 },
  { id: 3, name: "John Millar", studentId: "PRE:43787", marks: 1175, percentage: 92, year: 2014, gender: 'Male', rank: 2 },
  { id: 4, name: "Michael Chen", studentId: "PRE:43792", marks: 1190, percentage: 97, year: 2014, gender: 'Male', rank: 4 },
  { id: 5, name: "Sarah Johnson", studentId: "PRE:43795", marks: 1150, percentage: 89, year: 2014, gender: 'Female', rank: 5 },
];

const defaultEvents: EventItem[] = [
  { id: 1, title: "Parent-Teacher Meeting", date: "2025-03-15", type: "meeting", color: "bg-blue-500" },
  { id: 2, title: "Mid-term Examinations", date: "2025-03-20", type: "exam", color: "bg-red-500" },
  { id: 3, title: "Sports Day", date: "2025-03-30", type: "event", color: "bg-green-500" },
  { id: 4, title: "Science Fair", date: "2025-04-05", type: "event", color: "bg-purple-500" },
  { id: 5, title: "Annual Day", date: "2025-04-15", type: "event", color: "bg-yellow-500" },
];

function readFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, v: T) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardHome = location.pathname === "/admin";

  const navItems: NavItem[] = [
    { title: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
    { title: "Students", href: "/admin/students", icon: <GraduationCap className="h-5 w-5" /> },
    { title: "Staff", href: "/admin/staff", icon: <UserCog className="h-5 w-5" /> },
    { title: "Parents", href: "/admin/parents", icon: <UsersRound className="h-5 w-5" /> },
    { title: "Classes", href: "/admin/classes", icon: <BookOpen className="h-5 w-5" /> },
    { title: "Attendance", href: "/admin/attendance", icon: <CheckCircle2 className="h-5 w-5" /> },
    { title: "Exam Results", href: "/admin/exam-results", icon: <FileBarChart className="h-5 w-5" /> },
    { title: "Fees", href: "/admin/fees", icon: <CreditCard className="h-5 w-5" /> },
    { title: "Courses", href: "/admin/courses", icon: <LibraryBig className="h-5 w-5" /> },
    { title: "Reports", href: "/admin/reports", icon: <FileText className="h-5 w-5" /> },
    { title: "Calendar", href: "/admin/calendar", icon: <CalendarDays className="h-5 w-5" /> },
    { title: "Announcements", href: "/admin/announcements", icon: <Megaphone className="h-5 w-5" /> },
    { title: "Settings", href: "/admin/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  // persisted demo data
  const [students, setStudents] = useState<Student[]>(
    () =>
      readFromStorage<Student[]>(STORAGE_KEYS.students, [
        { id: 101, name: "John Doe", class: "10-A", roll: "12", guardian: "Jane Doe" },
        { id: 102, name: "Sravani", class: "9-B", roll: "05", guardian: "Ramesh" },
        { id: 103, name: "Alex Johnson", class: "11-C", roll: "08", guardian: "Mary Johnson" },
        { id: 104, name: "Sarah Wilson", class: "12-A", roll: "03", guardian: "David Wilson" },
      ])
  );

  const [staff, setStaff] = useState<Staff[]>(
    () =>
      readFromStorage<Staff[]>(STORAGE_KEYS.staff, [
        { id: 201, name: "Mrs. Anita", role: "Math Teacher" },
        { id: 202, name: "Mr. Reddy", role: "Physical Education" },
        { id: 203, name: "Dr. Smith", role: "Principal" },
        { id: 204, name: "Ms. Garcia", role: "Science Teacher" },
      ])
  );

  const [announcements, setAnnouncements] = useState(
    () => readFromStorage(STORAGE_KEYS.announcements, [
      { id: 1, title: "Welcome Back", content: "School reopens on March 1st", postedAt: "2025-02-25" },
      { id: 2, title: "Exam Schedule", content: "Final exams begin on April 15th", postedAt: "2025-03-10" },
    ])
  );

  const [recentActivities, setRecentActivities] = useState<Activity[]>(() => 
    readFromStorage(STORAGE_KEYS.activities, [
      { id: 1, type: "registration", message: "New student registered: John Doe", time: "10 minutes ago", icon: <UserPlus className="h-4 w-4" /> },
      { id: 2, type: "attendance", message: "Class 10-A attendance marked", time: "25 minutes ago", icon: <CheckCircle2 className="h-4 w-4" /> },
      { id: 3, type: "payment", message: "Fee payment received from Sarah Wilson", time: "1 hour ago", icon: <CreditCard className="h-4 w-4" /> },
      { id: 4, type: "announcement", message: "New announcement posted: Exam Schedule", time: "2 hours ago", icon: <Megaphone className="h-4 w-4" /> },
      { id: 5, type: "staff", message: "New staff member added: Ms. Garcia", time: "3 hours ago", icon: <UserCheck className="h-4 w-4" /> },
    ])
  );

  const [starStudents, setStarStudents] = useState<StarStudent[]>(() => readFromStorage(STORAGE_KEYS.starStudents, defaultStarStudents));

  const [upcomingEvents] = useState<EventItem[]>(defaultEvents);

  // drawers state (right side panels)
  const [drawer, setDrawer] = useState<null | "student" | "staff" | "announcement">(null);
  const closeDrawer = () => setDrawer(null);

  // forms
  const [studentForm, setStudentForm] = useState({ name: "", className: "", roll: "" });
  const [staffForm, setStaffForm] = useState({ name: "", role: "" });
  const [announcementForm, setAnnouncementForm] = useState({ title: "", content: "" });

  // toast messages
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // search state
  const [searchQuery, setSearchQuery] = useState("");

  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Student Registration", message: "John Doe registered as new student", time: "10 min ago", read: false },
    { id: 2, title: "Fee Payment", message: "Payment received from Sarah Wilson", time: "1 hour ago", read: false },
    { id: 3, title: "Staff Meeting", message: "Monthly staff meeting scheduled", time: "2 hours ago", read: true },
  ]);

  // Settings state
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => saveToStorage(STORAGE_KEYS.students, students), [students]);
  useEffect(() => saveToStorage(STORAGE_KEYS.staff, staff), [staff]);
  useEffect(() => saveToStorage(STORAGE_KEYS.announcements, announcements), [announcements]);
  useEffect(() => saveToStorage(STORAGE_KEYS.activities, recentActivities), [recentActivities]);
  useEffect(() => saveToStorage(STORAGE_KEYS.starStudents, starStudents), [starStudents]);

  // Attach Escape listener only when drawer open
  useEffect(() => {
    if (!drawer) return;
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [drawer]);

  const addStudent = (e?: React.FormEvent) => {
    e?.preventDefault();
    const { name, className, roll } = studentForm;
    if (!name.trim() || !className.trim()) {
      showToast("Please fill student name and class");
      return;
    }
    const id = students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1000;
    const newStudent: Student = { id, name: name.trim(), class: className.trim(), roll: roll.trim() || "-" };
    setStudents((s) => [newStudent, ...s]);
    setRecentActivities((r) => [{ id: Date.now(), type: "registration", message: `New student registered: ${newStudent.name}`, time: nowLabel(), icon: <UserPlus className="h-4 w-4" /> }, ...r]);
    setStudentForm({ name: "", className: "", roll: "" });
    closeDrawer();
    showToast("Student added successfully");
  };

  const addStaff = (e?: React.FormEvent) => {
    e?.preventDefault();
    const { name, role } = staffForm;
    if (!name.trim() || !role.trim()) {
      showToast("Please fill staff name and role");
      return;
    }
    const id = staff.length ? Math.max(...staff.map((s) => s.id)) + 1 : 2000;
    const newStaff: Staff = { id, name: name.trim(), role: role.trim() };
    setStaff((st) => [newStaff, ...st]);
    setRecentActivities((r) => [{ id: Date.now(), type: "staff", message: `Staff added: ${newStaff.name}`, time: nowLabel(), icon: <UserCheck className="h-4 w-4" /> }, ...r]);
    setStaffForm({ name: "", role: "" });
    closeDrawer();
    showToast("Staff member added successfully");
  };

  const postAnnouncement = (e?: React.FormEvent) => {
    e?.preventDefault();
    const { title, content } = announcementForm;
    if (!title.trim() || !content.trim()) {
      showToast("Please fill title and content");
      return;
    }
    const id = announcements.length ? Math.max(...announcements.map((a: any) => a.id)) + 1 : 1;
    const postedAt = new Date().toISOString().slice(0, 10);
    const ann = { id, title: title.trim(), content: content.trim(), postedAt };
    setAnnouncements((a: any) => [ann, ...a]);
    setRecentActivities((r) => [{ id: Date.now(), type: "announcement", message: `Announcement posted: ${ann.title}`, time: nowLabel(), icon: <Megaphone className="h-4 w-4" /> }, ...r]);
    setAnnouncementForm({ title: "", content: "" });
    closeDrawer();
    showToast("Announcement posted successfully");
  };

  const generateReport = () => {
    const rows: string[] = [];
    rows.push("=== School Management System Report ===");
    rows.push(`Generated: ${new Date().toISOString()}`);
    rows.push("");
    rows.push("=== Students ===");
    rows.push("id,name,class,roll");
    students.forEach((s) => rows.push(`${s.id},"${s.name}","${s.class}","${s.roll}"`));
    rows.push("");
    rows.push("=== Staff ===");
    rows.push("id,name,role");
    staff.forEach((st) => rows.push(`${st.id},"${st.name}","${st.role}"`));
    rows.push("");
    rows.push("=== Announcements ===");
    rows.push("id,title,content,postedAt");
    announcements.forEach((a: any) => rows.push(`${a.id},"${a.title.replace(/\"/g, '""')}","${a.content.replace(/\"/g, '""')}",${a.postedAt}`));
    
    const csvContent = rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const filename = `school_report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setRecentActivities((r) => [{ id: Date.now(), type: "report", message: `Report generated: ${filename}`, time: nowLabel(), icon: <FileText className="h-4 w-4" /> }, ...r]);
    showToast("Report generated successfully");
  };

  const totalStudents = students.length;
  const totalStaff = staff.length;
  const activeClasses = useMemo(() => new Set(students.map((s) => s.class)).size, [students]);
  const attendanceToday = "94.5%";

  // Handle notification button click
  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
    setShowSettings(false);
    
    // Mark all notifications as read
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  // Handle settings button click
  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
    setShowNotifications(false);
    navigate('/admin/settings');
  };

  const Drawer: React.FC<{ open: boolean; title: string; onClose: () => void; children?: React.ReactNode }> = ({ open, title, onClose, children }) => {
    return (
      <>
        {open && <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} aria-hidden />}
        <div
          aria-hidden={!open}
          className={`fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
          role="dialog"
          aria-label={title}
        >
          <div className="w-full max-w-md h-full bg-gradient-to-b from-white to-gray-50 shadow-2xl p-6 overflow-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500">Fill in the details below</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100">
                <span className="text-xl">×</span>
              </Button>
            </div>
            {children}
          </div>
        </div>
      </>
    );
  };

  // Avatar component for students/staff
  const Avatar = ({ name, className = "" }: { name: string; className?: string }) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500'];
    const color = colors[name.length % colors.length];
    
    return (
      <div className={`${color} ${className} rounded-full flex items-center justify-center text-white font-semibold`}>
        {initials}
      </div>
    );
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout navItems={navItems} userName="Dr. Sarah Wilson" userRole="Principal">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
        {/* Top Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening with your school today.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                />
              </div>
              
              {/* Notifications Button with Dropdown */}
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-lg relative"
                  onClick={handleNotificationsClick}
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </Button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-bold text-gray-800">Notifications</h3>
                      <p className="text-sm text-gray-600">{notifications.length} unread notifications</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${!notif.read ? 'bg-blue-50' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${notif.read ? 'bg-gray-200' : 'bg-blue-100'}`}>
                              <Bell className={`h-4 w-4 ${notif.read ? 'text-gray-600' : 'text-blue-600'}`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800">{notif.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                            </div>
                            {!notif.read && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-blue-600"
                        onClick={() => navigate('/admin/announcements')}
                      >
                        View All Notifications
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Settings Button */}
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-lg"
                onClick={handleSettingsClick}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">15.2K</h3>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+12.5%</span>
                    <span className="text-sm text-gray-500 ml-2">from last month</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">2.1K</h3>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+5.2%</span>
                    <span className="text-sm text-gray-500 ml-2">from last month</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <UserCog className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Parents</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">5.8K</h3>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+8.7%</span>
                    <span className="text-sm text-gray-500 ml-2">from last month</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <UsersRound className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Earnings</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">$19.3K</h3>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+15.3%</span>
                    <span className="text-sm text-gray-500 ml-2">from last month</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Chart */}
            <Card className="shadow-lg border-gray-200">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">Revenue Overview</CardTitle>
                    <CardDescription>Monthly revenue and expenses analysis</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate('/admin/reports')}>
                      View Details
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="#ef4444" 
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Student Performance Chart */}
            <Card className="shadow-lg border-gray-200">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">Student Performance</CardTitle>
                    <CardDescription>Subject-wise average scores</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate('/admin/exam-results')}>
                      <ChevronRight className="h-4 w-4 mr-1" />
                      Exam Results
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={subjectData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ subject, percent }) => `${subject}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="score"
                        >
                          {subjectData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    {subjectData.map((subject, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full mr-3" style={{ backgroundColor: subject.color }} />
                          <span className="font-medium">{subject.subject}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-bold text-gray-800 mr-3">{subject.score}%</span>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${subject.score}%`, 
                                backgroundColor: subject.color 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Activities - MOVED TO LEFT COLUMN BELOW STUDENT PERFORMANCE */}
            <Card className="shadow-lg border-gray-200">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">Recent Activities</CardTitle>
                    <CardDescription>Latest updates and notifications</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setRecentActivities([])}
                    className="text-gray-600"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                        <div className="text-gray-600 group-hover:text-blue-600">
                          {activity.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{activity.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Star Students */}
            <Card className="shadow-lg border-gray-200">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">Star Students</CardTitle>
                    <CardDescription>Top performers this semester</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/admin/students')}
                    className="text-blue-600"
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {starStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar name={student.name} className="h-10 w-10" />
                          <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold
                            ${student.rank <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                            {student.rank}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{student.name}</h4>
                          <p className="text-sm text-gray-500">{student.studentId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800">{student.percentage}%</span>
                          {student.percentage >= 95 && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs mt-1 ${student.gender === 'Male' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}
                        >
                          {student.gender}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="shadow-lg border-gray-200">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">Upcoming Events</CardTitle>
                    <CardDescription>Important dates and schedules</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/admin/calendar')}
                    className="text-blue-600"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Calendar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`h-10 w-1 rounded-full ${event.color}`} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{event.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-gray-500" />
                          <span className="text-sm text-gray-500">{event.date}</span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions - MOVED TO BELOW UPCOMING EVENTS */}
            <Card className="shadow-lg border-gray-200">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
                <CardDescription>Frequently used operations</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    className="justify-start h-auto py-3 px-4 bg-blue-50 hover:bg-blue-100 border border-blue-100"
                    onClick={() => setDrawer("student")}
                  >
                    <UserPlus className="mr-2 h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium text-blue-800">Add Student</div>
                      <div className="text-xs text-blue-600">Register new</div>
                    </div>
                  </Button>
                  
                  <Button 
                    className="justify-start h-auto py-3 px-4 bg-green-50 hover:bg-green-100 border border-green-100"
                    onClick={() => setDrawer("staff")}
                  >
                    <UserCheck className="mr-2 h-5 w-5 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium text-green-800">Add Staff</div>
                      <div className="text-xs text-green-600">Hire new</div>
                    </div>
                  </Button>
                  
                  <Button 
                    className="justify-start h-auto py-3 px-4 bg-purple-50 hover:bg-purple-100 border border-purple-100"
                    onClick={() => setDrawer("announcement")}
                  >
                    <Megaphone className="mr-2 h-5 w-5 text-purple-600" />
                    <div className="text-left">
                      <div className="font-medium text-purple-800">Announce</div>
                      <div className="text-xs text-purple-600">Post news</div>
                    </div>
                  </Button>
                  
                  <Button 
                    className="justify-start h-auto py-3 px-4 bg-orange-50 hover:bg-orange-100 border border-orange-100"
                    onClick={generateReport}
                  >
                    <FileText className="mr-2 h-5 w-5 text-orange-600" />
                    <div className="text-left">
                      <div className="font-medium text-orange-800">Generate Report</div>
                      <div className="text-xs text-orange-600">Export data</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Drawers */}
      <Drawer open={drawer === "student"} title="Add New Student" onClose={closeDrawer}>
        <form onSubmit={addStudent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
            <input 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
              value={studentForm.name} 
              onChange={(e) => setStudentForm((p) => ({ ...p, name: e.target.value }))} 
              placeholder="Enter full name"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <input 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
              placeholder="e.g. 10-A" 
              value={studentForm.className} 
              onChange={(e) => setStudentForm((p) => ({ ...p, className: e.target.value }))} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number (optional)</label>
            <input 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
              value={studentForm.roll} 
              onChange={(e) => setStudentForm((p) => ({ ...p, roll: e.target.value }))} 
              placeholder="Enter roll number"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={closeDrawer}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add Student</Button>
          </div>
        </form>
      </Drawer>

      <Drawer open={drawer === "staff"} title="Add Staff Member" onClose={closeDrawer}>
        <form onSubmit={addStaff} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Staff Name</label>
            <input 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
              value={staffForm.name} 
              onChange={(e) => setStaffForm((p) => ({ ...p, name: e.target.value }))} 
              placeholder="Enter full name"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <input 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
              value={staffForm.role} 
              onChange={(e) => setStaffForm((p) => ({ ...p, role: e.target.value }))} 
              placeholder="e.g. Math Teacher"
              required 
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={closeDrawer}>Cancel</Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Add Staff</Button>
          </div>
        </form>
      </Drawer>

      <Drawer open={drawer === "announcement"} title="Post Announcement" onClose={closeDrawer}>
        <form onSubmit={postAnnouncement} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
              value={announcementForm.title} 
              onChange={(e) => setAnnouncementForm((p) => ({ ...p, title: e.target.value }))} 
              placeholder="Enter announcement title"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea 
              rows={6} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none" 
              value={announcementForm.content} 
              onChange={(e) => setAnnouncementForm((p) => ({ ...p, content: e.target.value }))} 
              placeholder="Enter announcement content"
              required 
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={closeDrawer}>Cancel</Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Post Announcement</Button>
          </div>
        </form>
      </Drawer>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-60 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-slide-up">
          <CheckCircle2 className="h-5 w-5 text-green-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Add custom animation */}
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default AdminDashboard;