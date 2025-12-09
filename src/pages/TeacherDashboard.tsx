import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  FileText,
  MessageSquare,
  Users,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  Upload,
} from "lucide-react";

const TeacherDashboard = () => {
  const navItems = [
    { title: "Dashboard", href: "/teacher", icon: <LayoutDashboard className="h-5 w-5" /> },
    { title: "My Classes", href: "/teacher/classes", icon: <BookOpen className="h-5 w-5" /> },
    { title: "Students", href: "/teacher/students", icon: <Users className="h-5 w-5" /> },
    { title: "Assignments", href: "/teacher/assignments", icon: <FileText className="h-5 w-5" /> },
    { title: "Attendance", href: "/teacher/attendance", icon: <CheckCircle2 className="h-5 w-5" /> },
    { title: "Schedule", href: "/teacher/schedule", icon: <Calendar className="h-5 w-5" /> },
    { title: "Messages", href: "/teacher/messages", icon: <MessageSquare className="h-5 w-5" /> },
  ];

  const todayClasses = [
    { id: 1, class: "Class 10-A", subject: "Mathematics", time: "09:00 AM", students: 35, room: "Room 301" },
    { id: 2, class: "Class 10-B", subject: "Mathematics", time: "11:00 AM", students: 32, room: "Room 301" },
    { id: 3, class: "Class 9-A", subject: "Algebra", time: "02:00 PM", students: 38, room: "Room 205" },
  ];

  const pendingGrading = [
    { id: 1, assignment: "Calculus Problem Set 5", class: "Class 10-A", submissions: 32, total: 35, dueDate: "Mar 15" },
    { id: 2, assignment: "Mid-term Examination", class: "Class 10-B", submissions: 30, total: 32, dueDate: "Mar 12" },
    { id: 3, assignment: "Algebra Quiz", class: "Class 9-A", submissions: 38, total: 38, dueDate: "Mar 10" },
  ];

  const studentPerformance = [
    { class: "Class 10-A", avgGrade: 85, attendance: 94 },
    { class: "Class 10-B", avgGrade: 82, attendance: 91 },
    { class: "Class 9-A", avgGrade: 88, attendance: 96 },
  ];

  return (
    <DashboardLayout navItems={navItems} userName="Prof. Emily Johnson" userRole="Teacher">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Manage your classes and student progress</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Classes"
            value={6}
            icon={BookOpen}
            variant="primary"
            description="This semester"
          />
          <StatCard
            title="Total Students"
            value={187}
            icon={Users}
            variant="secondary"
          />
          <StatCard
            title="Pending Grading"
            value={42}
            icon={ClipboardCheck}
            variant="warning"
          />
          <StatCard
            title="Today's Classes"
            value={3}
            icon={Calendar}
            variant="default"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Today's Classes */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Your classes for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayClasses.map((classItem) => (
                  <div key={classItem.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{classItem.subject}</h4>
                        <p className="text-sm text-muted-foreground">{classItem.class}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {classItem.time}
                          </span>
                          <span>•</span>
                          <span>{classItem.students} students</span>
                          <span>•</span>
                          <span>{classItem.room}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Mark Attendance
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Assignments to Grade */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Grading</CardTitle>
              <CardDescription>Assignments awaiting evaluation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingGrading.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.assignment}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{item.class}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {item.submissions}/{item.total} submissions
                        </Badge>
                        <span className="text-xs text-muted-foreground">Due: {item.dueDate}</span>
                      </div>
                    </div>
                    <Button size="sm">
                      Grade
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Student Performance Overview</CardTitle>
            <CardDescription>Average grades and attendance by class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {studentPerformance.map((item) => (
                <div key={item.class} className="p-4 rounded-lg border bg-card space-y-4">
                  <div>
                    <h4 className="font-semibold">{item.class}</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Avg. Grade</p>
                      <p className="text-2xl font-bold text-primary">{item.avgGrade}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                      <p className="text-2xl font-bold text-secondary">{item.attendance}%</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common teaching tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="flex flex-col items-start gap-2 w-full">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Mark Attendance</span>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="flex flex-col items-start gap-2 w-full">
                  <Upload className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Upload Materials</span>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="flex flex-col items-start gap-2 w-full">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Create Assignment</span>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="flex flex-col items-start gap-2 w-full">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Enter Grades</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
