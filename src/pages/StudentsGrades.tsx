// src/pages/student/StudentGrades.tsx
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Award,
  BookOpen,
  FileText,
  Calendar,
  MessageSquare,
  User,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import jsPDF from "jspdf";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ================= TYPES ================= */
type Remark = {
  date: string;
  teacher: string;
  text: string;
};

type Grade = {
  subject: string;
  grade: string;
  percentage: number;
  remarks: Remark[];
};

/* ================= DATA ================= */
const SEMESTER_DATA: Record<string, Grade[]> = {
  "Semester 1": [
    { subject: "Mathematics", grade: "A", percentage: 92, remarks: [{ date: "Aug 10", teacher: "Mr. Rao", text: "Excellent logic" }] },
    { subject: "Physics", grade: "A-", percentage: 88, remarks: [{ date: "Aug 12", teacher: "Dr. Mehta", text: "Strong concepts" }] },
    { subject: "Chemistry", grade: "B+", percentage: 85, remarks: [{ date: "Aug 15", teacher: "Ms. Anjali", text: "Practice reactions" }] },
    { subject: "Biology", grade: "A-", percentage: 89, remarks: [{ date: "Aug 22", teacher: "Dr. Neha", text: "Good diagrams" }] },
    { subject: "English", grade: "A", percentage: 94, remarks: [{ date: "Aug 14", teacher: "Ms. Davis", text: "Excellent writing" }] },
    { subject: "History", grade: "B", percentage: 78, remarks: [{ date: "Aug 16", teacher: "Mr. Kumar", text: "Needs structure" }] },
    { subject: "Geography", grade: "B+", percentage: 82, remarks: [{ date: "Aug 18", teacher: "Ms. Priya", text: "Good maps" }] },
    { subject: "Computer Science", grade: "A", percentage: 95, remarks: [{ date: "Aug 20", teacher: "Mr. Sanjay", text: "Excellent coding" }] },
    { subject: "Economics", grade: "B+", percentage: 84, remarks: [{ date: "Aug 19", teacher: "Mr. Ravi", text: "Improve graphs" }] },
    { subject: "Civics", grade: "A-", percentage: 90, remarks: [{ date: "Aug 21", teacher: "Ms. Kiran", text: "Good analysis" }] },
  ],

  "Semester 2": [
    { subject: "Mathematics", grade: "A+", percentage: 96, remarks: [{ date: "Dec 10", teacher: "Mr. Rao", text: "Outstanding improvement" }] },
    { subject: "Physics", grade: "A", percentage: 91, remarks: [{ date: "Dec 12", teacher: "Dr. Mehta", text: "Strong application" }] },
    { subject: "Chemistry", grade: "A-", percentage: 89, remarks: [{ date: "Dec 13", teacher: "Ms. Anjali", text: "Very consistent" }] },
    { subject: "Biology", grade: "A", percentage: 92, remarks: [{ date: "Dec 19", teacher: "Dr. Neha", text: "Clear understanding" }] },
    { subject: "English", grade: "A", percentage: 93, remarks: [{ date: "Dec 14", teacher: "Ms. Davis", text: "Strong expression" }] },
    { subject: "History", grade: "B+", percentage: 83, remarks: [{ date: "Dec 15", teacher: "Mr. Kumar", text: "Improved answers" }] },
    { subject: "Geography", grade: "A-", percentage: 88, remarks: [{ date: "Dec 16", teacher: "Ms. Priya", text: "Good improvement" }] },
    { subject: "Computer Science", grade: "A+", percentage: 98, remarks: [{ date: "Dec 18", teacher: "Mr. Sanjay", text: "Class topper" }] },
    { subject: "Economics", grade: "A-", percentage: 87, remarks: [{ date: "Dec 17", teacher: "Mr. Ravi", text: "Better analysis" }] },
    { subject: "Civics", grade: "A", percentage: 91, remarks: [{ date: "Dec 20", teacher: "Ms. Kiran", text: "Excellent reasoning" }] },
  ],
};

/* ================= COMPONENT ================= */
const StudentGrades: React.FC = () => {
  const studentId = "12";
  const [semester, setSemester] = useState("Semester 1");
  const [openSubject, setOpenSubject] = useState<string | null>(null);
  const [isParentView, setIsParentView] = useState(false);

  const grades = SEMESTER_DATA[semester];
  const avg = grades.reduce((s, g) => s + g.percentage, 0) / grades.length;
  const gpa = (avg / 25).toFixed(2);

  const chartData = [
    { term: "Sem 1", avg: 87 },
    { term: "Sem 2", avg: 92 },
  ];

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Student Report Card", 20, 20);
    doc.text(`Student ID: ${studentId}`, 20, 35);
    doc.text(`Semester: ${semester}`, 20, 45);
    doc.text(`GPA: ${gpa}`, 20, 55);

    let y = 70;
    grades.forEach((g) => {
      doc.text(`${g.subject} - ${g.grade} (${g.percentage}%)`, 20, y);
      y += 8;
    });

    doc.save(`ReportCard_${semester}.pdf`);
  };

  const navItems = [
    { title: "Dashboard", href: "/student", icon: <BookOpen className="h-5 w-5" /> },
    { title: "My Courses", href: `/students/${studentId}/courses`, icon: <BookOpen className="h-5 w-5" /> },
    { title: "Assignments", href: `/students/${studentId}/assignments`, icon: <FileText className="h-5 w-5" /> },
    { title: "Grades", href: "/student/grades", icon: <Award className="h-5 w-5" /> },
    { title: "Schedule", href: "/student/schedule", icon: <Calendar className="h-5 w-5" /> },
    { title: "Messages", href: "/student/messages", icon: <MessageSquare className="h-5 w-5" /> },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      userName="Alex Thompson"
      userRole={isParentView ? "Parent" : "Student"}
    >
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Grades</h1>
            <p className="text-muted-foreground">Semester-wise academic performance</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="border rounded-md px-3 py-1"
            >
              <option>Semester 1</option>
              <option>Semester 2</option>
            </select>

            <Button
              className="bg-blue-500 hover:bg-orange-500 text-white"
              onClick={() => {
                setIsParentView((p) => !p);
                setOpenSubject(null);
              }}
            >
              <User className="h-4 w-4 mr-1" />
              {isParentView ? "Student View" : "Parent View"}
            </Button>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="p-4">GPA: <strong>{gpa}</strong></CardContent></Card>
          <Card><CardContent className="p-4">Average: <strong>{avg.toFixed(1)}%</strong></CardContent></Card>
          <Card><CardContent className="p-4">Subjects: <strong>{grades.length}</strong></CardContent></Card>
        </div>

        {/* PERFORMANCE CHART */}
        <Card>
          <CardHeader><CardTitle>Performance Trend</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="term" />
                <YAxis />
                <Tooltip />
                <Line dataKey="avg" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* SUBJECT GRADES */}
        <Card>
          <CardHeader><CardTitle>Subject-wise Grades</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {grades.map((g) => (
              <div key={g.subject} className="border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{g.subject}</h3>
                    <p className="text-sm text-muted-foreground">{g.remarks[0].text}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge>{g.grade}</Badge>
                    <Progress value={g.percentage} className="w-32 h-2" />

                    {!isParentView && (
                      <Button
                        size="icon"
                        className="bg-blue-500 hover:bg-orange-500 text-white"
                        onClick={() =>
                          setOpenSubject(openSubject === g.subject ? null : g.subject)
                        }
                      >
                        {openSubject === g.subject ? <ChevronUp /> : <ChevronDown />}
                      </Button>
                    )}
                  </div>
                </div>

                {!isParentView && openSubject === g.subject && (
                  <div className="mt-3 text-sm space-y-2">
                    {g.remarks.map((r, i) => (
                      <div key={i} className="border-l-2 pl-3">
                        <strong>{r.teacher}</strong> ({r.date}) — {r.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ACTION */}
        <div className="flex justify-end">
          <Button
            className="bg-blue-500 hover:bg-orange-500 text-white"
            onClick={downloadPDF}
          >
            <Download className="h-4 w-4 mr-1" />
            Download Report Card
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentGrades;
