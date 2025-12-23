import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

/* Public */
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

/* Dashboards */
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ParentDashboard from "./pages/ParentDashboard";

/* Student pages (reused) */
import StudentCourses from "./pages/StudentCourses";
import StudentAssignments from "./pages/StudentsAssignments";
import AssignmentDetail from "./pages/AssignmentDetail";
import StudentGrades from "./pages/StudentsGrades";
import CourseDetail from "./pages/CourseDetailpage";
import SchedulePage from "./pages/Schedule"; 
import StudentsMessages from "./pages/StudentsMessages"

/* Admin – Student management */
import StudentsList from "./pages/students/StudentsList";
import StudentProfile from "./pages/students/StudentProfile";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            {/* ---------- Public ---------- */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />

            {/* ---------- Admin ---------- */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/students" element={<StudentsList />} />
            <Route path="/students/:id" element={<StudentProfile />} />

            {/* ✅ Admin → Student detail pages */}
            <Route path="/students/:id/courses" element={<StudentCourses />} />
            <Route path="/students/:id/courses/:courseId" element={<CourseDetail />} />
            <Route path="/students/:id/assignments" element={<StudentAssignments />} />
            <Route path="/students/:id/assignments/:assignmentId" element={<AssignmentDetail />} />
            <Route path="/students/:id/grades" element={<StudentGrades />} />
            <Route path="/students/:id/schedule" element={<SchedulePage />} />
            <Route path="/students/:id/messages" element={<StudentsMessages />} />

            {/* ---------- Student (SELF) ---------- */}
            <Route path="/student">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="courses" element={<StudentCourses />} />
              <Route path="courses/:courseId" element={<CourseDetail />} />
              <Route path="assignments" element={<StudentAssignments />} />
              <Route path="assignments/:assignmentId" element={<AssignmentDetail />} />
              <Route path="grades" element={<StudentGrades />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="messages" element={<StudentsMessages />} />
            </Route>

            {/* ---------- Teacher ---------- */}
            <Route path="/teacher" element={<TeacherDashboard />} />

            {/* ---------- Parent ---------- */}
            <Route path="/parent" element={<ParentDashboard />} />

            {/* ---------- 404 ---------- */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}