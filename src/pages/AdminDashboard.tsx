// pages/AdminDashboard.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

type NavItem = { title: string; href: string; icon: React.ReactNode };
type Activity = { id: number; type: string; message: string; time: string };
type EventItem = { id: number; title: string; date: string; type: string };
type Student = { id: number; name: string; class: string; roll: string; guardian?: string };
type Staff = { id: number; name: string; role: string };

const STORAGE_KEYS = {
  students: "em_students_v1",
  staff: "em_staff_v1",
  announcements: "em_announcements_v1",
  activities: "em_activities_v1",
};

const nowLabel = () => "just now";

const defaultRecent: Activity[] = [
  { id: 1, type: "registration", message: "New student registered: John Doe", time: "10 minutes ago" },
  { id: 2, type: "attendance", message: "Class 10-A attendance marked", time: "25 minutes ago" },
  { id: 3, type: "payment", message: "Fee payment received from Sarah Wilson", time: "1 hour ago" },
];

const defaultEvents: EventItem[] = [
  { id: 1, title: "Parent-Teacher Meeting", date: "2025-03-15", type: "meeting" },
  { id: 2, title: "Mid-term Examinations", date: "2025-03-20", type: "exam" },
  { id: 3, title: "Sports Day", date: "2025-03-30", type: "event" },
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

  const navItems: NavItem[] = [
    { title: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
    { title: "Students", href: "/admin/students", icon: <GraduationCap className="h-5 w-5" /> },
    { title: "Staff", href: "/admin/staff", icon: <UserCog className="h-5 w-5" /> },
    { title: "Parents", href: "/admin/parents", icon: <Users className="h-5 w-5" /> },
    { title: "Classes", href: "/admin/classes", icon: <BookOpen className="h-5 w-5" /> },
    { title: "Attendance", href: "/admin/attendance", icon: <CheckCircle2 className="h-5 w-5" /> },
    { title: "Reports", href: "/admin/reports", icon: <FileText className="h-5 w-5" /> },
    { title: "Announcements", href: "/admin/announcements", icon: <Megaphone className="h-5 w-5" /> },
  ];

  // persisted demo data
  const [students, setStudents] = useState<Student[]>(
    () =>
      readFromStorage<Student[]>(STORAGE_KEYS.students, [
        { id: 101, name: "John Doe", class: "10-A", roll: "12", guardian: "Jane Doe" },
        { id: 102, name: "Sravani", class: "9-B", roll: "05", guardian: "Ramesh" },
      ])
  );

  const [staff, setStaff] = useState<Staff[]>(
    () =>
      readFromStorage<Staff[]>(STORAGE_KEYS.staff, [
        { id: 201, name: "Mrs. Anita", role: "Math Teacher" },
        { id: 202, name: "Mr. Reddy", role: "Physical Education" },
      ])
  );

  const [announcements, setAnnouncements] = useState(
    () => readFromStorage(STORAGE_KEYS.announcements, [{ id: 1, title: "Welcome Back", content: "School reopens on March 1st", postedAt: "2025-02-25" }])
  );

  const [recentActivities, setRecentActivities] = useState<Activity[]>(() => readFromStorage(STORAGE_KEYS.activities, defaultRecent));

  const [upcomingEvents] = useState<EventItem[]>(defaultEvents);

  // drawers state (right side panels)
  const [drawer, setDrawer] = useState<null | "student" | "staff" | "announcement">(null);
  const closeDrawer = () => setDrawer(null);

  // small forms
  const [studentForm, setStudentForm] = useState({ name: "", className: "", roll: "" });
  const [staffForm, setStaffForm] = useState({ name: "", role: "" });
  const [announcementForm, setAnnouncementForm] = useState({ title: "", content: "" });

  // toast messages
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // refs for drawer content
  const drawerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => saveToStorage(STORAGE_KEYS.students, students), [students]);
  useEffect(() => saveToStorage(STORAGE_KEYS.staff, staff), [staff]);
  useEffect(() => saveToStorage(STORAGE_KEYS.announcements, announcements), [announcements]);
  useEffect(() => saveToStorage(STORAGE_KEYS.activities, recentActivities), [recentActivities]);

  // Attach Escape listener only when drawer open
  useEffect(() => {
    if (!drawer) return;
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [drawer]);

  // handlers
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
    setRecentActivities((r) => [{ id: Date.now(), type: "registration", message: `New student registered: ${newStudent.name}`, time: nowLabel() }, ...r]);
    setStudentForm({ name: "", className: "", roll: "" });
    closeDrawer();
    showToast("Student added");
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
    setRecentActivities((r) => [{ id: Date.now(), type: "staff", message: `Staff added: ${newStaff.name}`, time: nowLabel() }, ...r]);
    setStaffForm({ name: "", role: "" });
    closeDrawer();
    showToast("Staff member added");
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
    setRecentActivities((r) => [{ id: Date.now(), type: "announcement", message: `Announcement posted: ${ann.title}`, time: nowLabel() }, ...r]);
    setAnnouncementForm({ title: "", content: "" });
    closeDrawer();
    showToast("Announcement posted");
  };

  const generateReport = () => {
    const rows: string[] = [];

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
    rows.push("");

    const csvContent = rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const filename = `edumanage_report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setRecentActivities((r) => [{ id: Date.now(), type: "report", message: `Report generated: ${filename}`, time: nowLabel() }, ...r]);
    showToast("Report generated");
  };

  const totalStudents = students.length;
  const totalStaff = staff.length;
  const activeClasses = useMemo(() => new Set(students.map((s) => s.class)).size, [students]);
  const attendanceToday = "94.5%";

  const Drawer: React.FC<{ open: boolean; title: string; onClose: () => void; children?: React.ReactNode }> = ({ open, title, onClose, children }) => {
    return (
      <>
        {/* Transparent backdrop — receives clicks/touches and closes drawer. No dark overlay. */}
        {open && <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden />}
        <div
          aria-hidden={!open}
          className={`fixed inset-y-0 right-0 z-50 transform transition-transform duration-200 ${open ? "translate-x-0" : "translate-x-full"}`}
          role="dialog"
          aria-label={title}
        >
          <div ref={drawerRef} className="w-full max-w-md h-full bg-white shadow-xl border-l border-gray-200 p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{title}</h3>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close drawer">
                ✕
              </Button>
            </div>
            {children}
          </div>
        </div>
      </>
    );
  };

  return (
    <DashboardLayout navItems={navItems} userName="Dr. Smith" userRole="Principal">
      <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Overview of your school management system</p>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Students" value={totalStudents} icon={GraduationCap} variant="primary" trend={{ value: 5.2, isPositive: true }} />
          <StatCard title="Total Staff" value={totalStaff} icon={UserCog} variant="secondary" trend={{ value: 2.1, isPositive: true }} />
          <StatCard title="Active Classes" value={activeClasses} icon={BookOpen} variant="warning" />
          <StatCard title="Attendance Today" value={attendanceToday} icon={CheckCircle2} variant="primary" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Parents" value={892} icon={Users} variant="default" />
          <StatCard title="Pending Fees" value="$24,580" icon={DollarSign} variant="destructive" />
          <StatCard title="This Month" value="$185,420" icon={TrendingUp} variant="secondary" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Admin tasks performed inline (no separate pages)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" onClick={() => setDrawer("student")}>
                <UserPlus className="mr-2 h-4 w-4" /> Add New Student
              </Button>

              <Button className="w-full justify-start" variant="outline" onClick={() => setDrawer("staff")}>
                <UserCheck className="mr-2 h-4 w-4" /> Add Staff Member
              </Button>

              <Button className="w-full justify-start" variant="outline" onClick={() => setDrawer("announcement")}>
                <Megaphone className="mr-2 h-4 w-4" /> Post Announcement
              </Button>

              <Button className="w-full justify-start" variant="outline" onClick={generateReport}>
                <FileText className="mr-2 h-4 w-4" /> Generate Report
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest updates and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-64 overflow-auto">
                {recentActivities.map((a) => (
                  <div key={a.id} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{a.message}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {a.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Schedule & deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((ev) => (
                  <div key={ev.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{ev.title}</p>
                      <p className="text-xs text-gray-500">{ev.date}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {ev.type}
                      </Badge>
                    </div>
                  </div>
                ))}
                <div className="mt-3">
                  <label className="block text-xs text-gray-500 mb-1">Check date</label>
                  <input
                    type="date"
                    onChange={(e) => {
                      const sel = e.target.value;
                      if (!sel) return;
                      const found = upcomingEvents.find((x) => x.date === sel);
                      if (found) {
                        alert(`Event: ${found.title}\nDate: ${found.date}\nType: ${found.type}`);
                      } else {
                        alert(`No scheduled event on ${sel}`);
                      }
                    }}
                    className="border rounded p-2 text-sm w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Drawers (no heavy overlay) */}
      <Drawer open={drawer === "student"} title="Add New Student" onClose={closeDrawer}>
        <form onSubmit={addStudent} className="space-y-3">
          <div>
            <label className="block text-xs mb-1">Student Name</label>
            <input className="border p-2 rounded w-full" value={studentForm.name} onChange={(e) => setStudentForm((p) => ({ ...p, name: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-xs mb-1">Class</label>
            <input className="border p-2 rounded w-full" placeholder="e.g. 10-A" value={studentForm.className} onChange={(e) => setStudentForm((p) => ({ ...p, className: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-xs mb-1">Roll (optional)</label>
            <input className="border p-2 rounded w-full" value={studentForm.roll} onChange={(e) => setStudentForm((p) => ({ ...p, roll: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={closeDrawer}>Cancel</Button>
            <Button type="submit">Add Student</Button>
          </div>
        </form>
      </Drawer>

      <Drawer open={drawer === "staff"} title="Add Staff Member" onClose={closeDrawer}>
        <form onSubmit={addStaff} className="space-y-3">
          <div>
            <label className="block text-xs mb-1">Staff Name</label>
            <input className="border p-2 rounded w-full" value={staffForm.name} onChange={(e) => setStaffForm((p) => ({ ...p, name: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-xs mb-1">Role</label>
            <input className="border p-2 rounded w-full" value={staffForm.role} onChange={(e) => setStaffForm((p) => ({ ...p, role: e.target.value }))} required />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={closeDrawer}>Cancel</Button>
            <Button type="submit">Add Staff</Button>
          </div>
        </form>
      </Drawer>

      <Drawer open={drawer === "announcement"} title="Post Announcement" onClose={closeDrawer}>
        <form onSubmit={postAnnouncement} className="space-y-3">
          <div>
            <label className="block text-xs mb-1">Title</label>
            <input className="border p-2 rounded w-full" value={announcementForm.title} onChange={(e) => setAnnouncementForm((p) => ({ ...p, title: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-xs mb-1">Content</label>
            <textarea rows={6} className="border p-2 rounded w-full" value={announcementForm.content} onChange={(e) => setAnnouncementForm((p) => ({ ...p, content: e.target.value }))} required />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={closeDrawer}>Cancel</Button>
            <Button type="submit">Post Announcement</Button>
          </div>
        </form>
      </Drawer>

      {/* Toast */}
      {toast && (
        <div className="fixed right-4 top-6 z-60 bg-black text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
