import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  FileText,
  MessageSquare,
  Award,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

const StudentDashboard = () => {
  const navItems = [
    { title: "Dashboard", href: "/student", icon: <LayoutDashboard className="h-5 w-5" /> },
    { title: "My Courses", href: "/student/courses", icon: <BookOpen className="h-5 w-5" /> },
    { title: "Assignments", href: "/student/assignments", icon: <FileText className="h-5 w-5" /> },
    { title: "Grades", href: "/student/grades", icon: <Award className="h-5 w-5" /> },
    { title: "Schedule", href: "/student/schedule", icon: <Calendar className="h-5 w-5" /> },
    { title: "Messages", href: "/student/messages", icon: <MessageSquare className="h-5 w-5" /> },
  ];

  const todayClasses = [
    { id: 1, subject: "Mathematics", time: "09:00 AM - 10:00 AM", teacher: "Mr. Johnson", room: "Room 301" },
    { id: 2, subject: "Physics", time: "10:15 AM - 11:15 AM", teacher: "Dr. Williams", room: "Lab 2" },
    { id: 3, subject: "English Literature", time: "11:30 AM - 12:30 PM", teacher: "Ms. Davis", room: "Room 205" },
    { id: 4, subject: "Chemistry", time: "02:00 PM - 03:00 PM", teacher: "Dr. Brown", room: "Lab 1" },
  ];

  const upcomingAssignments = [
    { id: 1, title: "Math Calculus Problem Set", subject: "Mathematics", dueDate: "Mar 15", status: "pending" },
    { id: 2, title: "Physics Lab Report", subject: "Physics", dueDate: "Mar 18", status: "in-progress" },
    { id: 3, title: "Essay on Shakespeare", subject: "English", dueDate: "Mar 20", status: "pending" },
  ];

  const recentGrades = [
    { subject: "Mathematics", grade: "A", percentage: 92 },
    { subject: "Physics", grade: "A-", percentage: 88 },
    { subject: "Chemistry", grade: "B+", percentage: 85 },
    { subject: "English", grade: "A", percentage: 94 },
  ];

  return (
    <DashboardLayout navItems={navItems} userName="Alex Thompson" userRole="Student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">Track your academic progress and schedule</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Overall GPA"
            value="3.85"
            icon={Award}
            variant="primary"
            description="Out of 4.0"
          />
          <StatCard
            title="Attendance"
            value="96.5%"
            icon={CheckCircle2}
            variant="secondary"
            trend={{ value: 2.1, isPositive: true }}
          />
          <StatCard
            title="Pending Assignments"
            value={5}
            icon={FileText}
            variant="warning"
          />
          <StatCard
            title="Completed Courses"
            value={8}
            icon={BookOpen}
            variant="default"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Your classes for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayClasses.map((classItem) => (
                  <div key={classItem.id} className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{classItem.subject}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {classItem.time}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{classItem.teacher}</span>
                        <span>•</span>
                        <span>{classItem.room}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Assignments</CardTitle>
              <CardDescription>Deadlines approaching</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAssignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-start justify-between gap-4 p-3 rounded-lg border">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{assignment.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{assignment.subject}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={assignment.status === "in-progress" ? "default" : "outline"} className="text-xs">
                          {assignment.status === "in-progress" ? "In Progress" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">Due Date</p>
                      <p className="text-sm font-semibold text-primary">{assignment.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
            <CardDescription>Your latest academic performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {recentGrades.map((grade) => (
                <div key={grade.subject} className="space-y-2 p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{grade.subject}</p>
                    <Badge variant="secondary" className="text-lg font-bold">
                      {grade.grade}
                    </Badge>
                  </div>
                  <Progress value={grade.percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">{grade.percentage}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
