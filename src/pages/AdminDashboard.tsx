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
  MessageSquare,
  UserPlus,
  UserCheck,
  Megaphone,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
} from "lucide-react";

const AdminDashboard = () => {
  const navItems = [
    { title: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
    { title: "Students", href: "/admin/students", icon: <GraduationCap className="h-5 w-5" /> },
    { title: "Staff", href: "/admin/staff", icon: <UserCog className="h-5 w-5" /> },
    { title: "Parents", href: "/admin/parents", icon: <Users className="h-5 w-5" /> },
    { title: "Classes", href: "/admin/classes", icon: <BookOpen className="h-5 w-5" /> },
    { title: "Attendance", href: "/admin/attendance", icon: <CheckCircle2 className="h-5 w-5" /> },
    { title: "Reports", href: "/admin/reports", icon: <FileText className="h-5 w-5" /> },
    { title: "Announcements", href: "/admin/announcements", icon: <Megaphone className="h-5 w-5" /> },
  ];

  const recentActivities = [
    { id: 1, type: "registration", message: "New student registered: John Doe", time: "10 minutes ago" },
    { id: 2, type: "attendance", message: "Class 10-A attendance marked", time: "25 minutes ago" },
    { id: 3, type: "payment", message: "Fee payment received from Sarah Wilson", time: "1 hour ago" },
    { id: 4, type: "alert", message: "Low attendance alert for Class 9-B", time: "2 hours ago" },
  ];

  const upcomingEvents = [
    { id: 1, title: "Parent-Teacher Meeting", date: "March 15, 2025", type: "meeting" },
    { id: 2, title: "Mid-term Examinations", date: "March 20-25, 2025", type: "exam" },
    { id: 3, title: "Sports Day", date: "March 30, 2025", type: "event" },
  ];

  return (
    <DashboardLayout navItems={navItems} userName="Dr. Smith" userRole="Principal">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your school management system</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Students"
            value={1248}
            icon={GraduationCap}
            variant="primary"
            trend={{ value: 5.2, isPositive: true }}
          />
          <StatCard
            title="Total Staff"
            value={87}
            icon={UserCog}
            variant="secondary"
            trend={{ value: 2.1, isPositive: true }}
          />
          <StatCard
            title="Active Classes"
            value={42}
            icon={BookOpen}
            variant="warning"
          />
          <StatCard
            title="Attendance Today"
            value="94.5%"
            icon={CheckCircle2}
            variant="primary"
          />
        </div>

        {/* Quick Actions & Additional Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Parents"
            value={892}
            icon={Users}
            variant="default"
          />
          <StatCard
            title="Pending Fees"
            value="$24,580"
            icon={DollarSign}
            variant="destructive"
          />
          <StatCard
            title="This Month"
            value="$185,420"
            icon={TrendingUp}
            variant="secondary"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Student
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <UserCheck className="mr-2 h-4 w-4" />
                Add Staff Member
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Megaphone className="mr-2 h-4 w-4" />
                Post Announcement
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
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
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.message}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
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
              <CardDescription>Schedule and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
