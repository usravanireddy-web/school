import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  Calendar,
  Shield,
  TrendingUp,
  Clock,
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Student Management",
      description: "Comprehensive student profiles, enrollment tracking, and academic records",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Class Management",
      description: "Organize classes, subjects, timetables, and course materials efficiently",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Grade Tracking",
      description: "Monitor student performance, generate reports, and track academic progress",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Attendance System",
      description: "Real-time attendance marking with automated reports and alerts",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Parent Portal",
      description: "Keep parents informed with access to grades, attendance, and school updates",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Analytics & Reports",
      description: "Comprehensive analytics and customizable reports for better decision making",
    },
  ];

  const userTypes = [
    {
      role: "admin",
      title: "Admin",
      description: "Manage the entire school system",
      icon: <Shield className="h-8 w-8" />,
      color: "bg-primary/10 text-primary",
    },
    {
      role: "teacher",
      title: "Teacher",
      description: "Manage classes and students",
      icon: <BookOpen className="h-8 w-8" />,
      color: "bg-secondary/10 text-secondary",
    },
    {
      role: "student",
      title: "Student",
      description: "Access courses and grades",
      icon: <GraduationCap className="h-8 w-8" />,
      color: "bg-accent/10 text-accent",
    },
    {
      role: "parent",
      title: "Parent",
      description: "Monitor child's progress",
      icon: <Users className="h-8 w-8" />,
      color: "bg-muted text-muted-foreground",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                <GraduationCap className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              School Management
              <span className="block text-primary mt-2">Made Simple</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform to manage students, staff, academics, and school operations all in one place
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link to="/login">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Access for Everyone</h2>
            <p className="text-lg text-muted-foreground">
              Role-based dashboards tailored for different users
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {userTypes.map((type) => (
              <Card key={type.role} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`h-16 w-16 rounded-2xl ${type.color} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-bold">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to="/login">Access Portal</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to run your school efficiently
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="space-y-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4 max-w-6xl mx-auto text-center">
            <div>
              <h3 className="text-4xl font-bold mb-2">1000+</h3>
              <p className="text-primary-foreground/80">Students Enrolled</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">50+</h3>
              <p className="text-primary-foreground/80">Teaching Staff</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">95%</h3>
              <p className="text-primary-foreground/80">Attendance Rate</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">24/7</h3>
              <p className="text-primary-foreground/80">System Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 border-none shadow-lg">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Transform Your School?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join hundreds of institutions already using our platform
              </p>
              <Button size="lg" asChild className="text-lg px-8">
                <Link to="/login">Start Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">EduManage</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 School Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
