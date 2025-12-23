// src/pages/student/StudentDashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

/**
 * StudentDashboard
 *
 * - Nav items point to concrete student routes: /students/:studentId/courses and /students/:studentId/assignments
 * - Ensure you register those routes in App.tsx (see notes below).
 */
const StudentDashboard: React.FC = () => {
  // Replace this with the authenticated student's id when available
  const studentId = "12";
  const navigate = useNavigate();

  const navItems = [
    { title: "Dashboard", href: "/student", icon: <LayoutDashboard className="h-5 w-5" /> },

    // exact route used by StudentCourses component
    { title: "My Courses", href: `/students/${studentId}/courses`, icon: <BookOpen className="h-5 w-5" /> },

    // exact route used by StudentAssignments component (important)
    { title: "Assignments", href: `/students/${studentId}/assignments`, icon: <FileText className="h-5 w-5" /> },

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
      <div className="space-y-6 p-4 md:p-6">
        {/* Header - Responsive layout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Student Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1 sm:text-base">
              Track your academic progress and schedule
            </p>
          </div>

          {/* QUICK TEST: programmatic button to open courses and assignments pages */}
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <button
              onClick={() => navigate(`/students/${studentId}/courses`)}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 transition sm:text-base w-full sm:w-auto"
            >
              Open My Courses
            </button>

            <button
              onClick={() => navigate(`/students/${studentId}/assignments`)}
              className="rounded-md bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 transition sm:text-base w-full sm:w-auto"
            >
              Open My Assignments
            </button>
          </div>
        </div>

        {/* Statistics Cards - Responsive grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
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

        {/* Today's Schedule and Upcoming Assignments - Responsive columns */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Today's Schedule */}
          <Card className="w-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl">Today's Schedule</CardTitle>
              <CardDescription className="text-sm">Your classes for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {todayClasses.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center sm:h-10 sm:w-10">
                      <BookOpen className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm leading-tight sm:text-base">{classItem.subject}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{classItem.time}</span>
                      </p>
                      <div className="flex flex-col gap-1 mt-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-3">
                        <span className="truncate">{classItem.teacher}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="truncate">{classItem.room}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Assignments */}
          <Card className="w-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl">Upcoming Assignments</CardTitle>
              <CardDescription className="text-sm">Deadlines approaching</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {upcomingAssignments.map((assignment) => (
                  <div 
                    key={assignment.id} 
                    className="flex flex-col gap-3 p-3 rounded-lg border sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm leading-tight truncate sm:text-base">
                        {assignment.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{assignment.subject}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={assignment.status === "in-progress" ? "default" : "outline"}
                          className="text-xs"
                        >
                          {assignment.status === "in-progress" ? "In Progress" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right sm:text-left sm:flex-shrink-0">
                      <p className="text-xs font-medium">Due Date</p>
                      <p className="text-sm font-semibold text-primary sm:text-base">{assignment.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Grades - Responsive grid */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">Recent Grades</CardTitle>
            <CardDescription className="text-sm">Your latest academic performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {recentGrades.map((grade) => (
                <div 
                  key={grade.subject} 
                  className="space-y-2 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors sm:p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate pr-2">{grade.subject}</p>
                    <Badge variant="secondary" className="flex-shrink-0 text-base font-bold sm:text-lg">
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

        {/* Mobile Optimization Tips */}
        <div className="text-center p-2 text-xs text-muted-foreground lg:hidden">
          <p>Tip: Rotate your device or use landscape mode for better layout on tablets</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;