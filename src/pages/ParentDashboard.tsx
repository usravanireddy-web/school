import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  DollarSign,
  Users,
  Award,
  CheckCircle2,
  TrendingUp,
  FileText,
  Bell,
} from "lucide-react";

const ParentDashboard = () => {
  const navItems = [
    { title: "Dashboard", href: "/parent", icon: <LayoutDashboard className="h-5 w-5" /> },
    { title: "My Children", href: "/parent/children", icon: <Users className="h-5 w-5" /> },
    { title: "Fees", href: "/parent/fees", icon: <DollarSign className="h-5 w-5" /> },
    { title: "Meetings", href: "/parent/meetings", icon: <Calendar className="h-5 w-5" /> },
    { title: "Messages", href: "/parent/messages", icon: <MessageSquare className="h-5 w-5" /> },
    { title: "Reports", href: "/parent/reports", icon: <FileText className="h-5 w-5" /> },
  ];

  const children = [
    {
      id: 1,
      name: "Emma Wilson",
      class: "Class 10-A",
      grade: "A",
      attendance: 96,
      avatar: "",
    },
    {
      id: 2,
      name: "James Wilson",
      class: "Class 7-B",
      grade: "B+",
      attendance: 92,
      avatar: "",
    },
  ];

  const announcements = [
    { id: 1, title: "Parent-Teacher Meeting Scheduled", date: "March 15, 2025", priority: "high" },
    { id: 2, title: "Sports Day Invitation", date: "March 30, 2025", priority: "medium" },
    { id: 3, title: "Mid-term Results Published", date: "March 10, 2025", priority: "high" },
  ];

  const upcomingEvents = [
    { id: 1, title: "Parent-Teacher Meeting", date: "Mar 15", time: "10:00 AM" },
    { id: 2, title: "Science Fair", date: "Mar 22", time: "09:00 AM" },
  ];

  const feeStatus = {
    total: 5000,
    paid: 3500,
    pending: 1500,
    dueDate: "March 31, 2025",
  };

  return (
    <DashboardLayout navItems={navItems} userName="Sarah Wilson" userRole="Parent">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Parent Dashboard</h1>
          <p className="text-muted-foreground">Monitor your children's academic progress</p>
        </div>

        {/* Children Overview */}
        <div>
          <h2 className="text-xl font-semibold mb-4">My Children</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {children.map((child) => (
              <Card key={child.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={child.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {child.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{child.name}</h3>
                      <p className="text-sm text-muted-foreground">{child.class}</p>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Current Grade</p>
                          <Badge variant="secondary" className="mt-1 text-base font-bold">
                            {child.grade}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Attendance</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={child.attendance} className="h-2 flex-1" />
                            <span className="text-sm font-semibold">{child.attendance}%</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        View Full Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Upcoming Meetings"
            value={2}
            icon={Calendar}
            variant="primary"
          />
          <StatCard
            title="Pending Fees"
            value={`$${feeStatus.pending}`}
            icon={DollarSign}
            variant="warning"
          />
          <StatCard
            title="New Messages"
            value={5}
            icon={MessageSquare}
            variant="secondary"
          />
          <StatCard
            title="New Reports"
            value={3}
            icon={FileText}
            variant="default"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Fee Status */}
          <Card>
            <CardHeader>
              <CardTitle>Fee Status</CardTitle>
              <CardDescription>Payment overview for this term</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Fee</span>
                  <span className="font-semibold">${feeStatus.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Paid</span>
                  <span className="font-semibold text-secondary">${feeStatus.paid}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-semibold text-destructive">${feeStatus.pending}</span>
                </div>
              </div>
              <Progress value={(feeStatus.paid / feeStatus.total) * 100} className="h-2" />
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Due Date: {feeStatus.dueDate}</p>
                <Button className="w-full mt-3">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Pay Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Important dates and meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg border">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{event.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{event.date}</span>
                        <span>•</span>
                        <span>{event.time}</span>
                      </div>
                      <Button variant="link" size="sm" className="px-0 h-auto mt-2">
                        Add to Calendar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* School Announcements */}
        <Card>
          <CardHeader>
            <CardTitle>School Announcements</CardTitle>
            <CardDescription>Latest updates from the school</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    announcement.priority === "high" ? "bg-destructive/10" : "bg-primary/10"
                  }`}>
                    <Bell className={`h-5 w-5 ${
                      announcement.priority === "high" ? "text-destructive" : "text-primary"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-sm">{announcement.title}</h4>
                      <Badge variant={announcement.priority === "high" ? "destructive" : "outline"} className="text-xs">
                        {announcement.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{announcement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
