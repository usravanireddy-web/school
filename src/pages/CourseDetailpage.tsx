// src/pages/student/CourseDetail.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * CourseDetail — full mock (c1..c7) with improved lesson actions:
 * - Open lessons (toggle)
 * - When lessons open: Hide lessons, Support, Share, Message instructor, Email instructor
 * - View lesson shows inline lesson detail (no alerts / no localhost messages)
 * - Share copies current URL to clipboard with small feedback
 * - Message instructor is an inline simulated message form
 */

type Module = { id: string; title: string; summary: string; completed: boolean; lessons: number };
type Course = {
  id: string;
  title: string;
  shortDesc: string;
  longDesc?: string;
  startDate: string;
  endDate: string;
  schedule?: string;
  durationWeeks?: number;
  cost?: number;
  progressPercent: number;
  modules: Module[];
  instructor?: string;
  status: "ongoing" | "upcoming" | "completed";
  certificateAvailable?: boolean;
};

const MOCK_COURSES: Course[] = [
  {
    id: "c1",
    title: "Mathematics — Foundations to Advanced",
    shortDesc:
      "Covers arithmetic, algebra, geometry and an intro to calculus — 6 months program.",
    longDesc:
      "Full-spectrum mathematics program: from arithmetic foundations to introductory calculus. Includes weekly quizzes and hands-on problem sessions.",
    startDate: "2025-04-01",
    endDate: "2025-09-30",
    schedule: "Mon/Wed/Fri • 09:00 - 10:30",
    durationWeeks: 26,
    cost: 12000,
    progressPercent: 72,
    instructor: "Ms. Geeta Rao",
    status: "ongoing",
    certificateAvailable: false,
    modules: [
      { id: "m1", title: "Numbers & Operations", summary: "Whole numbers, fractions and decimals.", completed: true, lessons: 8 },
      { id: "m2", title: "Algebra I", summary: "Expressions, equations and basic graphing.", completed: true, lessons: 10 },
      { id: "m3", title: "Geometry Basics", summary: "Shapes, area, perimeter and proofs.", completed: false, lessons: 7 },
      { id: "m4", title: "Intro to Calculus", summary: "Limits and simple derivatives.", completed: false, lessons: 5 },
    ],
  },
  {
    id: "c2",
    title: "English Language & Literature",
    shortDesc: "Reading comprehension, grammar, creative writing and public speaking.",
    longDesc: "Comprehensive English program focusing on analysis, writing and oral skills.",
    startDate: "2025-07-01",
    endDate: "2025-11-30",
    schedule: "Tue/Thu • 10:00 - 11:30",
    durationWeeks: 22,
    cost: 9000,
    progressPercent: 35,
    instructor: "Mr. R. Sharma",
    status: "ongoing",
    certificateAvailable: false,
    modules: [
      { id: "m1", title: "Grammar & Usage", summary: "Tenses, sentence structure and punctuation.", completed: true, lessons: 6 },
      { id: "m2", title: "Reading Comprehension", summary: "Techniques for analysis and speed reading.", completed: false, lessons: 8 },
      { id: "m3", title: "Creative Writing", summary: "Narrative writing and editing.", completed: false, lessons: 6 },
    ],
  },
  {
    id: "c3",
    title: "Computer Science Basics",
    shortDesc: "Introduction to programming logic and problem solving.",
    longDesc: "Beginner-friendly programming fundamentals and problem solving with small projects.",
    startDate: "2025-10-01",
    endDate: "2026-01-31",
    schedule: "Mon/Wed • 15:00 - 16:30",
    durationWeeks: 18,
    cost: 14000,
    progressPercent: 0,
    instructor: "Ms. A. Iyer",
    status: "upcoming",
    certificateAvailable: false,
    modules: [
      { id: "m1", title: "Computational Thinking", summary: "Problem decomposition and algorithms.", completed: false, lessons: 4 },
      { id: "m2", title: "Intro to Python", summary: "Syntax, control flow and small programs.", completed: false, lessons: 6 },
    ],
  },
  {
    id: "c4",
    title: "Environmental Science (Elective)",
    shortDesc: "Ecosystems, sustainability and local environmental projects.",
    longDesc: "Hands-on environmental studies with field visits, mapping projects and report-based assessment.",
    startDate: "2024-11-01",
    endDate: "2025-03-31",
    schedule: "Wed • 14:00 - 16:00",
    durationWeeks: 22,
    cost: 7000,
    progressPercent: 100,
    instructor: "Dr. S. Khatri",
    status: "completed",
    certificateAvailable: true,
    modules: [
      { id: "m1", title: "Ecosystems", summary: "Biomes and food webs.", completed: true, lessons: 5 },
      { id: "m2", title: "Sustainability Projects", summary: "Local project planning and execution.", completed: true, lessons: 6 },
    ],
  },
  {
    id: "c5",
    title: "Classical Dance — Bharatanatyam Basics",
    shortDesc: "Traditional Bharatanatyam training: posture, adavus, and abhinaya.",
    longDesc: "Cultural program focusing on rhythm, posture, and expression (abhinaya).",
    startDate: "2025-08-01",
    endDate: "2026-01-31",
    schedule: "Sat • 09:00 - 11:00",
    durationWeeks: 26,
    cost: 8000,
    progressPercent: 45,
    instructor: "Smt. L. Ramya",
    status: "ongoing",
    certificateAvailable: false,
    modules: [
      { id: "m1", title: "Adavus", summary: "Basic footwork patterns and coordination.", completed: true, lessons: 10 },
      { id: "m2", title: "Abhinaya", summary: "Facial expressions and storytelling.", completed: false, lessons: 8 },
    ],
  },
  {
    id: "c6",
    title: "Yoga — Foundation & Wellness",
    shortDesc: "Asanas, pranayama and mindfulness techniques for students.",
    longDesc: "Wellness program teaching safe asanas and breathing practices for concentration and calm.",
    startDate: "2025-09-01",
    endDate: "2026-02-28",
    schedule: "Mon • 07:30 - 08:30",
    durationWeeks: 22,
    cost: 6000,
    progressPercent: 20,
    instructor: "Mr. R. Patel",
    status: "ongoing",
    certificateAvailable: false,
    modules: [
      { id: "m1", title: "Basic Asanas", summary: "Mountain, tree, cobra and seated poses.", completed: true, lessons: 6 },
      { id: "m2", title: "Pranayama", summary: "Breathing exercises.", completed: false, lessons: 4 },
    ],
  },
  {
    id: "c7",
    title: "Competitive Exam Prep — Foundation",
    shortDesc:
      "Logical reasoning, basic mathematics & general knowledge for competitive exams.",
    longDesc: "Targeted prep with mocks, timed practice, and concept revision sessions.",
    startDate: "2025-06-01",
    endDate: "2025-12-31",
    schedule: "Mon-Fri • 16:00 - 17:30",
    durationWeeks: 30,
    cost: 15000,
    progressPercent: 60,
    instructor: "Mr. S. Rao",
    status: "ongoing",
    certificateAvailable: false,
    modules: [
      { id: "m1", title: "Logical Reasoning", summary: "Puzzles, sequences and critical thinking.", completed: true, lessons: 12 },
      { id: "m2", title: "Quant basics", summary: "Number properties, ratios, percentages.", completed: true, lessons: 14 },
      { id: "m3", title: "General Knowledge", summary: "Current affairs & static GK.", completed: false, lessons: 8 },
    ],
  },
];

const formatDate = (iso: string) => {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString();
  } catch {
    return iso;
  }
};

export default function CourseDetail(): JSX.Element {
  const { id: studentId, courseId } = useParams<{ id?: string; courseId?: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessonsOpen, setLessonsOpen] = useState(false);

  // UI state for lesson view / share / messaging
  const [selectedLesson, setSelectedLesson] = useState<{ moduleId: string; lessonIndex: number } | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  useEffect(() => {
    if (!courseId) {
      setCourse(null);
      return;
    }
    const found = MOCK_COURSES.find((c) => c.id === courseId) ?? null;
    setCourse(found);
    setLessonsOpen(false);
    setSelectedLesson(null);
    setCopySuccess(null);
    setMessageOpen(false);
    setMessageText("");
    setMessageSent(false);
    setSupportOpen(false);
  }, [courseId]);

  const downloadCertificate = (c: Course) => {
    const content = `Certificate of Completion\n\nStudent: ${studentId ?? "Student"}\nCourse: ${c.title}\nDate: ${new Date().toLocaleDateString()}\n\n(Placeholder)`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(studentId ?? "student")}_${c.id}_certificate.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // copy current location to clipboard (Share)
  const copyLink = async () => {
    try {
      const link = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        // fallback
        const ta = document.createElement("textarea");
        ta.value = link;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      setCopySuccess("Link copied to clipboard");
      setTimeout(() => setCopySuccess(null), 2000);
    } catch {
      setCopySuccess("Unable to copy link");
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;
    setSendingMessage(true);
    setTimeout(() => {
      setSendingMessage(false);
      setMessageSent(true);
      setMessageText("");
      // keep messageOpen true to show success; user can close
    }, 900);
  };

  if (!course) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Course not found</h2>
        <p className="text-sm text-muted-foreground mt-2">
          We couldn't find course <strong>{courseId}</strong>. Confirm the link or go back.
        </p>
        <div className="mt-4 flex gap-2">
          <Button onClick={() => navigate(-1)} variant="ghost">Back</Button>
          <Link to={`/students/${studentId ?? "me"}/courses`}>
            <Button>Back to courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  // helper to render a lesson inline (no alerts)
  const LessonDetail = ({ moduleIndex, lessonIndex }: { moduleIndex: number; lessonIndex: number }) => {
    const m = course.modules[moduleIndex];
    if (!m) return null;
    return (
      <div className="mt-3 p-3 border rounded bg-muted/5">
        <div className="font-medium">Lesson {lessonIndex + 1}: {m.title}</div>
        <div className="text-sm text-muted-foreground mt-2">
          This is a lightweight preview of the lesson content. Replace with your real lesson player or page.
        </div>
        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={() => setSelectedLesson(null)}>Close</Button>
          <Button size="sm" variant="outline" onClick={() => setSelectedLesson({ moduleId: m.id, lessonIndex })}>
            Refresh
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{course.title}</h1>
          <div className="text-sm text-muted-foreground mt-1">{course.shortDesc}</div>
          <div className="text-xs text-muted-foreground mt-2">
            {formatDate(course.startDate)} → {formatDate(course.endDate)} • {course.schedule ?? "-"}
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3">
          <Badge>{course.status}</Badge>
          <div className="text-sm font-medium">Progress: {course.progressPercent}%</div>
          <div className="flex gap-2">
            <Button onClick={() => navigate(-1)} variant="ghost">Back</Button>
            <Button onClick={() => downloadCertificate(course)} className="bg-indigo-600 text-white">Certificate</Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About this course</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{course.longDesc}</p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 border rounded">
              <div className="text-xs text-muted-foreground">Duration</div>
              <div className="font-medium">{course.durationWeeks ?? "N/A"} weeks</div>
            </div>
            <div className="p-3 border rounded">
              <div className="text-xs text-muted-foreground">Cost</div>
              <div className="font-medium">{typeof course.cost === "number" ? `₹${course.cost}` : "N/A"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {course.modules.map((m, mi) => (
              <li key={m.id} className="p-2 border rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{m.title}</div>
                  <div className="text-sm text-muted-foreground">{m.summary}</div>
                  <div className="text-xs text-muted-foreground mt-1">Lessons: {m.lessons}</div>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2">
                  {/* View now opens inline lesson preview (no alert) */}
                  <Button size="sm" onClick={() => setSelectedLesson({ moduleId: m.id, lessonIndex: 0 })}>
                    View
                  </Button>

                  {/* show a small 'Open lesson' selector dropdown style: select first lesson open */}
                  <div className="text-xs text-muted-foreground hidden sm:block">First lesson preview</div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setLessonsOpen((v) => !v)} variant={lessonsOpen ? "outline" : undefined}>
          {lessonsOpen ? "Hide lessons" : "Open lessons"}
        </Button>

        {/* Actions shown when lessons are open */}
        {lessonsOpen && (
          <>
            <Button variant="outline" onClick={() => setSupportOpen((s) => !s)}>Support</Button>

            <Button variant="ghost" onClick={copyLink}>
              Share
            </Button>

            <Button variant="outline" onClick={() => setMessageOpen((m) => !m)}>
              Message instructor
            </Button>

            {/* Email instructor using a simple mailto (safe) */}
            <a
              className="inline-flex"
              href={`mailto:${(course.instructor ?? "instructor").replace(/\s+/g, ".").toLowerCase()}@example.com?subject=${encodeURIComponent(
                `Question about ${course.title}`
              )}`}
            >
              <Button variant="ghost">Email instructor</Button>
            </a>
          </>
        )}

        {/* small feedback text for copy/share */}
        {copySuccess && <div className="text-sm text-green-600 ml-2">{copySuccess}</div>}
      </div>

      {/* Inline support box */}
      {supportOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              For technical support, please contact your school administrator or use the messaging option to message the instructor.
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={() => setSupportOpen(false)}>Close</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inline message instructor form */}
      {messageOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Message {course.instructor ?? "Instructor"}</CardTitle>
          </CardHeader>
          <CardContent>
            {messageSent ? (
              <div className="text-sm text-green-600">Message sent. The instructor will reply via the school system or email.</div>
            ) : (
              <>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Write your message..."
                  className="w-full rounded-md border p-2"
                  rows={4}
                />
                <div className="mt-3 flex gap-2">
                  <Button onClick={sendMessage} disabled={sendingMessage || !messageText.trim()}>
                    {sendingMessage ? "Sending…" : "Send message"}
                  </Button>
                  <Button variant="outline" onClick={() => { setMessageOpen(false); setMessageText(""); setMessageSent(false); }}>
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lessons area */}
      {lessonsOpen && (
        <Card id="lessons-area">
          <CardHeader>
            <CardTitle>Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            {course.modules.map((m, mi) => (
              <div key={m.id} className="p-3 border rounded mb-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium">{m.title}</div>
                    <div className="text-sm text-muted-foreground">{m.summary}</div>
                    <div className="text-xs text-muted-foreground mt-1">Lessons: {m.lessons}</div>
                  </div>
                  <div className="text-sm">{m.completed ? "Completed" : "Pending"}</div>
                </div>

                <ul className="mt-3 space-y-1">
                  {Array.from({ length: m.lessons }).map((_, ix) => (
                    <li key={ix} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 rounded bg-muted/5">
                      <div className="text-sm w-full sm:w-auto">Lesson {ix + 1}: {m.title} — topic {ix + 1}</div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setSelectedLesson({ moduleId: m.id, lessonIndex: ix })}>
                          View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { /* placeholder for preview/download */ }}>
                          Resources
                        </Button>
                      </div>

                      {/* Inline lesson detail area for the selected lesson */}
                      {selectedLesson && selectedLesson.moduleId === m.id && selectedLesson.lessonIndex === ix && (
                        <div className="w-full mt-3">
                          <LessonDetail moduleIndex={mi} lessonIndex={ix} />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
