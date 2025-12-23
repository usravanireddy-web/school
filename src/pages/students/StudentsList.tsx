// src/pages/student/StudentsList.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  LogOut,
  Users,
  PlusCircle,
  Search,
  Filter,
  Download,
  Eye,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";

const DEMO_STUDENTS = [
  { id: "10", name: "Aisha Khan", cls: "8", section: "C", email: "aisha.khan@school.edu", phone: "+91 98765 43210", status: "active" },
  { id: "11", name: "Josh Fernandes", cls: "11", section: "A", email: "josh.fernandes@school.edu", phone: "+91 98765 43211", status: "active" },
  { id: "12", name: "Alex Thompson", cls: "10", section: "A", email: "alex.thompson@school.edu", phone: "+91 98765 43212", status: "inactive" },
  { id: "13", name: "Meera Patel", cls: "9", section: "B", email: "meera.patel@school.edu", phone: "+91 98765 43213", status: "active" },
  { id: "14", name: "Ravi Kumar", cls: "10", section: "A", email: "ravi.kumar@school.edu", phone: "+91 98765 43214", status: "active" },
  { id: "15", name: "Priya Sharma", cls: "12", section: "B", email: "priya.sharma@school.edu", phone: "+91 98765 43215", status: "active" },
  { id: "16", name: "Karan Verma", cls: "7", section: "A", email: "karan.verma@school.edu", phone: "+91 98765 43216", status: "active" },
  { id: "17", name: "Sana Reddy", cls: "8", section: "B", email: "sana.reddy@school.edu", phone: "+91 98765 43217", status: "inactive" },
  { id: "18", name: "Arjun Das", cls: "9", section: "C", email: "arjun.das@school.edu", phone: "+91 98765 43218", status: "active" },
  { id: "19", name: "Nisha Gupta", cls: "11", section: "C", email: "nisha.gupta@school.edu", phone: "+91 98765 43219", status: "active" },
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

export default function StudentsList() {
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("students");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

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

  const handleNavigation = (path: string, id: string) => {
    setActiveNav(id);
    navigate(path);
    setMobileSidebarOpen(false);
  };

  // Filter students based on search and filters
  const filteredStudents = DEMO_STUDENTS.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.id.includes(searchQuery);
    
    const matchesClass = filterClass === "all" || student.cls === filterClass;
    const matchesStatus = filterStatus === "all" || student.status === filterStatus;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  const classOptions = ["all", ...new Set(DEMO_STUDENTS.map(s => s.cls))].sort();
  const activeFilters = (searchQuery ? 1 : 0) + (filterClass !== "all" ? 1 : 0) + (filterStatus !== "all" ? 1 : 0);

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilterClass("all");
    setFilterStatus("all");
  };

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
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="text-gray-500 text-sm font-medium">Total Students</div>
                <div className="text-2xl lg:text-3xl font-bold text-blue-600 mt-2">
                  {DEMO_STUDENTS.length}
                </div>
                <div className="text-gray-400 text-xs mt-1">All registered students</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="text-gray-500 text-sm font-medium">Active Students</div>
                <div className="text-2xl lg:text-3xl font-bold text-green-600 mt-2">
                  {DEMO_STUDENTS.filter(s => s.status === "active").length}
                </div>
                <div className="text-gray-400 text-xs mt-1">Currently enrolled</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="text-gray-500 text-sm font-medium">Classes</div>
                <div className="text-2xl lg:text-3xl font-bold text-amber-600 mt-2">
                  {new Set(DEMO_STUDENTS.map(s => s.cls)).size}
                </div>
                <div className="text-gray-400 text-xs mt-1">Different classes</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="text-gray-500 text-sm font-medium">Sections</div>
                <div className="text-2xl lg:text-3xl font-bold text-purple-600 mt-2">
                  {new Set(DEMO_STUDENTS.map(s => s.section)).size}
                </div>
                <div className="text-gray-400 text-xs mt-1">Different sections</div>
              </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
              {/* Header Section */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-800">All Students</h2>
                  <p className="text-gray-600 text-sm lg:text-base mt-1">Manage and view student profiles</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => navigate("/students/new")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusCircle size={18} className="mr-2" />
                    Add New Student
                  </Button>
                  <Button variant="outline">
                    <Download size={18} className="mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Search and Filter Bar - All in one row on desktop */}
              <div className="mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search Input */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <Input
                        placeholder="Search students by name, email, or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-full"
                      />
                    </div>
                  </div>

                  {/* Filter by Class */}
                  <div className="lg:w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Class</label>
                    <div className="relative">
                      <select
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                      >
                        {classOptions.map(cls => (
                          <option key={cls} value={cls}>
                            {cls === "all" ? "All Classes" : `Class ${cls}`}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Filter by Status */}
                  <div className="lg:w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                    <div className="relative">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Filter Toggle Button for Mobile */}
                  <div className="lg:hidden">
                    <Button
                      onClick={() => setShowFilters(!showFilters)}
                      variant="outline"
                      className="w-full"
                    >
                      <Filter size={18} className="mr-2" />
                      {showFilters ? "Hide Filters" : "Show Filters"}
                    </Button>
                  </div>
                </div>

                {/* Active Filters Display */}
                {activeFilters > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    {searchQuery && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Search: "{searchQuery}"
                        <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-red-500">
                          <X size={14} />
                        </button>
                      </Badge>
                    )}
                    {filterClass !== "all" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Class: {filterClass}
                        <button onClick={() => setFilterClass("all")} className="ml-1 hover:text-red-500">
                          <X size={14} />
                        </button>
                      </Badge>
                    )}
                    {filterStatus !== "all" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Status: {filterStatus}
                        <button onClick={() => setFilterStatus("all")} className="ml-1 hover:text-red-500">
                          <X size={14} />
                        </button>
                      </Badge>
                    )}
                    <Button
                      onClick={clearAllFilters}
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </div>

              {/* Students Grid */}
              {filteredStudents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                  {filteredStudents.map((student) => (
                    <Card key={student.id} className="hover:shadow-lg transition-all duration-300 border border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg lg:text-xl text-gray-800">
                              {student.name}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">ID: {student.id}</p>
                          </div>
                          <Badge variant={student.status === "active" ? "default" : "secondary"}>
                            {student.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users size={16} className="text-gray-400" />
                            <span>Class {student.cls} • Section {student.section}</span>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            <div className="font-medium mb-1">Contact Info:</div>
                            <p className="truncate">{student.email}</p>
                            <p>{student.phone}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 pt-3 border-t">
                            <Button
                              onClick={() => navigate(`/students/${student.id}`)}
                              className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700"
                              size="sm"
                            >
                              <Eye size={16} className="mr-2" />
                              View Profile
                            </Button>
                            <Button
                              onClick={() => navigate(`/student/courses?student=${student.id}`)}
                              variant="outline"
                              size="sm"
                              className="flex-1 min-w-[120px]"
                            >
                              View Courses
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Users size={64} className="mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}

              {/* Results Count */}
              {filteredStudents.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-medium">{filteredStudents.length}</span> of{" "}
                      <span className="font-medium">{DEMO_STUDENTS.length}</span> students
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm">
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Note */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Tip: Click on "View Profile" to see detailed student information and course progress.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Showing {filteredStudents.length} filtered students • Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}