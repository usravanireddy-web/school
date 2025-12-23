import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_ASSIGNMENTS, Assignment } from "@/data/MockAssignment";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Award,
  Calendar,
  MessageSquare,
} from "lucide-react";

/* ---------------- CONSTANTS ---------------- */
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const PAGE_SIZE = 5;

/* ---------------- SIDEBAR NAV ---------------- */
const studentNavItems = [
  { title: "Dashboard", href: "/student/dashboard", icon: <LayoutDashboard size={18} /> },
  { title: "My Courses", href: "/student/courses", icon: <BookOpen size={18} /> },
  { title: "Assignments", href: "/student/assignments", icon: <FileText size={18} /> },
  { title: "Grades", href: "/student/grades", icon: <Award size={18} /> },
  { title: "Schedule", href: "/student/schedule", icon: <Calendar size={18} /> },
  { title: "Messages", href: "/student/messages", icon: <MessageSquare size={18} /> },
];

/* ---------------- HELPERS ---------------- */
function clamp(n: number, a = 0, b = 100) {
  return Math.max(a, Math.min(b, n));
}

function timeProgress(start?: string, end?: string) {
  if (!start || !end) return 0;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const now = Date.now();
  if (e <= s) return 100;
  return clamp(Math.round(((now - s) / (e - s)) * 100));
}

function daysLeft(to?: string) {
  if (!to) return null;
  const now = new Date().setHours(0, 0, 0, 0);
  const end = new Date(to).setHours(0, 0, 0, 0);
  return Math.ceil((end - now) / MS_PER_DAY);
}

function subjectEmoji(subject?: string) {
  const map: Record<string, string> = {
    Mathematics: "∑",
    Physics: "⚛️",
    Chemistry: "🧪",
    English: "📚",
    History: "🏛️",
    Biology: "🧬",
    "Computer Science": "💻",
    Geography: "🗺️",
    Art: "🎨",
    PE: "🏃",
  };
  return map[subject ?? ""] ?? "📌";
}

/* ---------------- COMPONENT ---------------- */
export default function StudentAssignments(): JSX.Element {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Assignment["status"] | "all">("all");
  const [sortBy, setSortBy] = useState<"due" | "title">("due");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const items = MOCK_ASSIGNMENTS;

  /* ---------- STATS ---------- */
  const stats = useMemo(() => ({
    total: items.length,
    open: items.filter(i => i.status === "open").length,
    graded: items.filter(i => i.status === "graded").length,
  }), [items]);

  /* ---------- SEARCH & FILTER ---------- */
  const searched = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter(a => {
      if (filter !== "all" && a.status !== filter) return false;
      return (
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.subject?.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q)
      );
    });
  }, [items, query, filter]);

  /* ---------- SORT ---------- */
  const sorted = useMemo(() => {
    const arr = [...searched];
    if (sortBy === "due") {
      arr.sort(
        (a, b) =>
          new Date(a.endDate ?? "").getTime() -
          new Date(b.endDate ?? "").getTime()
      );
    } else {
      arr.sort((a, b) => a.title.localeCompare(b.title));
    }
    return arr;
  }, [searched, sortBy]);

  /* ---------- PAGINATION ---------- */
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [query, filter, sortBy]);

  /* ---------- UI ---------- */
  return (
    <DashboardLayout
      navItems={studentNavItems}
      userName="Alex Thompson"
      userRole="Student"
    >
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Assignments</h1>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
            <span>Total: <b>{stats.total}</b></span>
            <span>Open: <b>{stats.open}</b></span>
            <span>Graded: <b>{stats.graded}</b></span>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assignments..."
            className="w-full sm:w-56 border rounded px-3 py-2 text-sm"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="graded">Graded</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="due">Sort by Due</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>

        {/* Assignment List */}
        <div className="space-y-4">
          {pageItems.map(a => {
            const progress = timeProgress(a.startDate, a.endDate);
            const left = daysLeft(a.endDate);
            const isExpanded = !!expanded[a.id];

            return (
              <Card key={a.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="text-2xl">{subjectEmoji(a.subject)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{a.title}</h3>
                      <p className="text-sm text-slate-600">
                        {a.subject} • {a.totalMarks ?? "-"} marks
                      </p>
                    </div>
                  </div>

                  <p className={`text-sm text-slate-600 ${!isExpanded && "line-clamp-2"}`}>
                    {a.description}
                  </p>

                  <div className="h-2 bg-slate-100 rounded">
                    <div className="h-full bg-slate-400 rounded" style={{ width: `${progress}%` }} />
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>
                      {left !== null &&
                        (left < 0
                          ? `Overdue ${Math.abs(left)}d`
                          : `Due in ${left}d`)}
                    </span>

                    <div className="flex gap-2">
                      {/* ✅ CORRECT LINK */}
                      <Button size="sm" asChild>
                        <Link to={`/student/assignments/${a.id}`}>View</Link>
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setExpanded(p => ({ ...p, [a.id]: !p[a.id] }))
                        }
                      >
                        {isExpanded ? "Less" : "More"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center text-sm">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
