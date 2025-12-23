// src/pages/student/SchedulePage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Menu,
  Home,
  BookOpen,
  FileText,
  BarChart,
  Calendar as CalendarIcon,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Clock,
  Users,
  Bell,
  Download,
  Filter,
  Plus,
  Video,
  MapPin,
  UserCheck,
  Music,
  Award,
  GraduationCap,
  School,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Clock3,
  CalendarDays,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";


const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <Home size={20} />,
    path: "/student/dashboard", 
    
  },
  {
    id: "courses",
    label: "My Courses",
    icon: <BookOpen size={20} />,
    path: "/student/courses",
    
  },
  {
    id: "assignments",
    label: "Assignments",
    icon: <FileText size={20} />,
    path: "/student/assignments",
    
  },
  {
    id: "grades",
    label: "Grades",
    icon: <BarChart size={20} />,
    path: "/student/grades",
   
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: <CalendarIcon size={20} />,
    path: "/student/schedule",
    active: true,
    
  },
  {
    id: "messages",
    label: "Messages",
    icon: <MessageSquare size={20} />,
    path: "/student/messages",
    
  },
  {
    id: "students",
    label: "Students",
    icon: <Users size={20} />,
    path: "/students",
    description: "Manage student profiles"
  },
];

// Types
interface ClassSchedule {
  id: string;
  day: string;
  periods: {
    time: string;
    subject: string;
    teacher: string;
    room: string;
    type: "theory" | "practical" | "lab" | "sports";
  }[];
}

interface CulturalEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "music" | "dance" | "drama" | "art" | "debate" | "sports";
  description: string;
  participants: number;
  status: "upcoming" | "ongoing" | "completed";
  organizer: string;
}

interface ParentMeeting {
  id: string;
  date: string;
  time: string;
  teacher: string;
  subject: string;
  mode: "in-person" | "online";
  status: "scheduled" | "completed" | "cancelled";
  notes: string;
  room?: string;
  meetingLink?: string;
}

interface ExamSchedule {
  id: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  room: string;
  type: "theory" | "practical";
  maxMarks: number;
}

interface SpecialEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  category: "holiday" | "celebration" | "workshop" | "field-trip";
  for: "all" | "specific-grades";
  grades?: string[];
}

interface PersonalEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  category: "personal";
  location?: string;
  reminder?: boolean;
}

// Common interface for all events in the upcoming events section
interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "cultural" | "meeting" | "exam" | "special" | "personal";
  location?: string;
  status?: string;
}

// Mock Data
const CLASS_TIMETABLE: ClassSchedule[] = [
  {
    id: "mon",
    day: "Monday",
    periods: [
      { time: "08:00 - 08:45", subject: "Mathematics", teacher: "Ms. Geeta Rao", room: "B-101", type: "theory" },
      { time: "08:45 - 09:30", subject: "Physics", teacher: "Dr. Sharma", room: "Lab-2", type: "practical" },
      { time: "09:30 - 10:15", subject: "English", teacher: "Mr. R. Sharma", room: "A-201", type: "theory" },
      { time: "10:30 - 11:15", subject: "Chemistry", teacher: "Ms. A. Iyer", room: "Lab-1", type: "lab" },
      { time: "11:15 - 12:00", subject: "Computer Science", teacher: "Mr. S. Kumar", room: "Comp-Lab", type: "lab" },
      { time: "12:45 - 13:30", subject: "Physical Education", teacher: "Mr. R. Patel", room: "Ground", type: "sports" },
    ]
  },
  {
    id: "tue",
    day: "Tuesday",
    periods: [
      { time: "08:00 - 08:45", subject: "Chemistry", teacher: "Ms. A. Iyer", room: "B-102", type: "theory" },
      { time: "08:45 - 09:30", subject: "Biology", teacher: "Dr. S. Khatri", room: "Lab-3", type: "practical" },
      { time: "09:30 - 10:15", subject: "Mathematics", teacher: "Ms. Geeta Rao", room: "A-202", type: "theory" },
      { time: "10:30 - 11:15", subject: "History", teacher: "Mr. S. Rao", room: "A-203", type: "theory" },
      { time: "11:15 - 12:00", subject: "Art & Culture", teacher: "Smt. L. Ramya", room: "Art-Room", type: "theory" },
    ]
  },
  {
    id: "wed",
    day: "Wednesday",
    periods: [
      { time: "08:00 - 08:45", subject: "Physics", teacher: "Dr. Sharma", room: "B-103", type: "theory" },
      { time: "08:45 - 09:30", subject: "Computer Science", teacher: "Mr. S. Kumar", room: "Comp-Lab", type: "lab" },
      { time: "09:30 - 10:15", subject: "English", teacher: "Mr. R. Sharma", room: "A-204", type: "theory" },
      { time: "10:30 - 11:15", subject: "Mathematics", teacher: "Ms. Geeta Rao", room: "Lab-1", type: "practical" },
      { time: "11:15 - 12:00", subject: "Sports", teacher: "Mr. R. Patel", room: "Ground", type: "sports" },
    ]
  },
  {
    id: "thu",
    day: "Thursday",
    periods: [
      { time: "08:00 - 08:45", subject: "Biology", teacher: "Dr. S. Khatri", room: "B-104", type: "theory" },
      { time: "08:45 - 09:30", subject: "Chemistry", teacher: "Ms. A. Iyer", room: "Lab-2", type: "lab" },
      { time: "09:30 - 10:15", subject: "Economics", teacher: "Mr. S. Rao", room: "A-205", type: "theory" },
      { time: "10:30 - 11:15", subject: "Physics", teacher: "Dr. Sharma", room: "Lab-3", type: "practical" },
      { time: "11:15 - 12:00", subject: "Library", teacher: "Ms. P. Gupta", room: "Library", type: "theory" },
    ]
  },
  {
    id: "fri",
    day: "Friday",
    periods: [
      { time: "08:00 - 08:45", subject: "Mathematics", teacher: "Ms. Geeta Rao", room: "B-105", type: "theory" },
      { time: "08:45 - 09:30", subject: "English", teacher: "Mr. R. Sharma", room: "A-206", type: "theory" },
      { time: "09:30 - 10:15", subject: "Computer Science", teacher: "Mr. S. Kumar", room: "B-106", type: "theory" },
      { time: "10:30 - 11:15", subject: "Value Education", teacher: "Smt. L. Ramya", room: "A-207", type: "theory" },
      { time: "11:15 - 12:00", subject: "Cultural Activities", teacher: "Various", room: "Auditorium", type: "theory" },
    ]
  },
];

const CULTURAL_EVENTS: CulturalEvent[] = [
  {
    id: "ce1",
    title: "Annual Music Competition",
    date: "2025-12-20",
    time: "10:00 AM - 4:00 PM",
    location: "School Auditorium",
    type: "music",
    description: "Inter-school music competition featuring vocal and instrumental categories. All students from classes 6-12 are eligible to participate.",
    participants: 45,
    status: "upcoming",
    organizer: "Music Department"
  },
  {
    id: "ce2",
    title: "Dance Drama: Ramayana",
    date: "2025-12-15",
    time: "5:00 PM - 7:00 PM",
    location: "Open Air Theater",
    type: "dance",
    description: "Traditional dance drama presentation by senior students. Parents and alumni are invited.",
    participants: 25,
    status: "upcoming",
    organizer: "Dance Club"
  },
  {
    id: "ce3",
    title: "Art Exhibition",
    date: "2025-12-10",
    time: "9:00 AM - 3:00 PM",
    location: "Art Gallery",
    type: "art",
    description: "Showcase of student artwork from all grades. Painting, sculpture, and digital art categories.",
    participants: 60,
    status: "ongoing",
    organizer: "Art Department"
  },
  {
    id: "ce4",
    title: "Debate Championship",
    date: "2025-12-05",
    time: "2:00 PM - 5:00 PM",
    location: "Seminar Hall",
    type: "debate",
    description: "Final round of the inter-house debate competition. Topic: 'Artificial Intelligence in Education'.",
    participants: 12,
    status: "completed",
    organizer: "English Department"
  },
  {
    id: "ce5",
    title: "Sports Day Rehearsals",
    date: "2025-12-18",
    time: "3:00 PM - 5:00 PM",
    location: "Sports Ground",
    type: "sports",
    description: "Final rehearsals for Sports Day March Past and cultural events.",
    participants: 120,
    status: "upcoming",
    organizer: "Sports Department"
  },
];

const PARENT_MEETINGS: ParentMeeting[] = [
  {
    id: "pm1",
    date: "2025-12-12",
    time: "10:00 AM - 10:30 AM",
    teacher: "Ms. Geeta Rao",
    subject: "Mathematics",
    mode: "in-person",
    status: "scheduled",
    notes: "Discuss mid-term performance and improvement strategies",
    room: "B-101"
  },
  {
    id: "pm2",
    date: "2025-12-12",
    time: "11:00 AM - 11:30 AM",
    teacher: "Mr. R. Sharma",
    subject: "English",
    mode: "online",
    status: "scheduled",
    notes: "Review writing skills and reading comprehension",
    meetingLink: "https://meet.google.com/xyz-abc-def"
  },
  {
    id: "pm3",
    date: "2025-12-05",
    time: "2:00 PM - 2:30 PM",
    teacher: "Dr. Sharma",
    subject: "Physics",
    mode: "in-person",
    status: "completed",
    notes: "Discussed laboratory performance and project work"
  },
  {
    id: "pm4",
    date: "2025-12-19",
    time: "3:00 PM - 3:30 PM",
    teacher: "Ms. A. Iyer",
    subject: "Chemistry",
    mode: "online",
    status: "scheduled",
    notes: "Practical exam preparation strategy",
    meetingLink: "https://meet.google.com/ijk-lmn-opq"
  },
  {
    id: "pm5",
    date: "2025-11-28",
    time: "9:00 AM - 9:30 AM",
    teacher: "Dr. S. Khatri",
    subject: "Biology",
    mode: "in-person",
    status: "completed",
    notes: "Parent-teacher general meeting"
  },
];

const EXAM_SCHEDULE: ExamSchedule[] = [
  {
    id: "ex1",
    subject: "Mathematics",
    date: "2025-12-22",
    time: "9:00 AM - 12:00 PM",
    duration: "3 hours",
    room: "Hall A",
    type: "theory",
    maxMarks: 100
  },
  {
    id: "ex2",
    subject: "Physics",
    date: "2025-12-23",
    time: "9:00 AM - 12:00 PM",
    duration: "3 hours",
    room: "Hall B",
    type: "theory",
    maxMarks: 100
  },
  {
    id: "ex3",
    subject: "Chemistry",
    date: "2025-12-24",
    time: "9:00 AM - 12:00 PM",
    duration: "3 hours",
    room: "Hall A",
    type: "theory",
    maxMarks: 100
  },
  {
    id: "ex4",
    subject: "English",
    date: "2025-12-26",
    time: "9:00 AM - 12:00 PM",
    duration: "3 hours",
    room: "Hall B",
    type: "theory",
    maxMarks: 100
  },
  {
    id: "ex5",
    subject: "Computer Science",
    date: "2025-12-27",
    time: "2:00 PM - 5:00 PM",
    duration: "3 hours",
    room: "Computer Lab",
    type: "practical",
    maxMarks: 100
  },
];

const SPECIAL_EVENTS: SpecialEvent[] = [
  {
    id: "se1",
    title: "Winter Break",
    date: "2025-12-25",
    time: "All Day",
    description: "School closed for winter holidays",
    category: "holiday",
    for: "all"
  },
  {
    id: "se2",
    title: "Science Fair",
    date: "2025-12-28",
    time: "9:00 AM - 4:00 PM",
    description: "Annual science exhibition showcasing student projects",
    category: "workshop",
    for: "all"
  },
  {
    id: "se3",
    title: "Field Trip - Science Museum",
    date: "2025-12-29",
    time: "8:00 AM - 4:00 PM",
    description: "Educational trip for classes 9-12",
    category: "field-trip",
    for: "specific-grades",
    grades: ["9", "10", "11", "12"]
  },
  {
    id: "se4",
    title: "Republic Day Celebration",
    date: "2026-01-26",
    time: "8:00 AM - 12:00 PM",
    description: "Flag hoisting and cultural program",
    category: "celebration",
    for: "all"
  },
  {
    id: "se5",
    title: "Career Counseling Workshop",
    date: "2025-12-30",
    time: "10:00 AM - 1:00 PM",
    description: "For students of classes 11 and 12",
    category: "workshop",
    for: "specific-grades",
    grades: ["11", "12"]
  },
];

export default function SchedulePage() {
  const navigate = useNavigate();
  const { id: studentId } = useParams<{ id?: string }>();
  const { toast } = useToast();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("schedule");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeDay, setActiveDay] = useState<string>("mon");
  const [activeTab, setActiveTab] = useState<string>("timetable");
  const [showFilters, setShowFilters] = useState(false);
  const [personalEvents, setPersonalEvents] = useState<PersonalEvent[]>([]);
  
  // Dialog states
  const [addEventDialogOpen, setAddEventDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [viewAllEventsDialogOpen, setViewAllEventsDialogOpen] = useState(false);
  
  // New event form state
  const [newEvent, setNewEvent] = useState<{
    title: string;
    date: string;
    time: string;
    description: string;
    location: string;
    reminder: boolean;
  }>({
    title: "",
    date: "",
    time: "",
    description: "",
    location: "",
    reminder: false
  });
  
  // Filter state
  const [filters, setFilters] = useState({
    eventTypes: ["classes", "cultural", "meetings", "exams", "personal"],
    timePeriod: "all",
    sortBy: "date",
    statuses: ["upcoming", "ongoing"]
  });

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

  const getEventColor = (type: string) => {
    switch(type) {
      case "music": return "bg-purple-100 text-purple-800 border-purple-200";
      case "dance": return "bg-pink-100 text-pink-800 border-pink-200";
      case "drama": return "bg-orange-100 text-orange-800 border-orange-200";
      case "art": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "debate": return "bg-blue-100 text-blue-800 border-blue-200";
      case "sports": return "bg-green-100 text-green-800 border-green-200";
      case "personal": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "scheduled": return <Clock3 size={16} className="text-blue-500" />;
      case "completed": return <CheckCircle size={16} className="text-green-500" />;
      case "cancelled": return <AlertCircle size={16} className="text-red-500" />;
      case "upcoming": return <Bell size={16} className="text-amber-500" />;
      case "ongoing": return <Clock size={16} className="text-purple-500" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "theory": return <BookOpen size={16} />;
      case "practical": return <GraduationCap size={16} />;
      case "lab": return <School size={16} />;
      case "sports": return <Award size={16} />;
      case "music": return <Music size={16} />;
      case "dance": return <Music size={16} />;
      case "personal": return <CalendarDays size={16} />;
      default: return <CalendarDays size={16} />;
    }
  };

  // Create a unified upcoming events array
  const getUpcomingEvents = (): UpcomingEvent[] => {
    const today = new Date();
    const upcomingEvents: UpcomingEvent[] = [];

    // Add cultural events
    CULTURAL_EVENTS.forEach(event => {
      if (new Date(event.date) >= today && event.status !== "completed") {
        upcomingEvents.push({
          id: event.id,
          title: event.title,
          date: event.date,
          time: event.time,
          type: "cultural",
          location: event.location,
          status: event.status
        });
      }
    });

    // Add parent meetings
    PARENT_MEETINGS.forEach(meeting => {
      if (new Date(meeting.date) >= today && meeting.status === "scheduled") {
        upcomingEvents.push({
          id: meeting.id,
          title: `Meeting with ${meeting.teacher}`,
          date: meeting.date,
          time: meeting.time,
          type: "meeting",
          status: meeting.status
        });
      }
    });

    // Add special events
    SPECIAL_EVENTS.forEach(event => {
      if (new Date(event.date) >= today) {
        upcomingEvents.push({
          id: event.id,
          title: event.title,
          date: event.date,
          time: event.time,
          type: "special"
        });
      }
    });

    // Add personal events
    personalEvents.forEach(event => {
      if (new Date(event.date) >= today) {
        upcomingEvents.push({
          id: event.id,
          title: event.title,
          date: event.date,
          time: event.time,
          type: "personal",
          location: event.location
        });
      }
    });

    // Sort by date and return only 3 events
    return upcomingEvents
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  };

  const upcomingEvents = getUpcomingEvents();

  // Download timetable as PDF
  const downloadTimetable = () => {
    const activeDaySchedule = CLASS_TIMETABLE.find(d => d.id === activeDay);
    if (!activeDaySchedule) return;

    const content = `Class Timetable - ${activeDaySchedule.day}\n\n`;
    const periodsContent = activeDaySchedule.periods.map((period, index) => 
      `${index + 1}. ${period.time} - ${period.subject} (${period.teacher}) - Room: ${period.room}`
    ).join('\n');
    
    const fullContent = content + periodsContent + `\n\nGenerated on: ${new Date().toLocaleDateString()}`;
    
    const blob = new Blob([fullContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timetable-${activeDaySchedule.day.toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Complete",
      description: `Timetable for ${activeDaySchedule.day} downloaded successfully`,
    });
  };

  // Export all schedules
  const exportAllSchedules = () => {
    const allContent = `
EDUMANAGE SCHOOL - COMPLETE SCHEDULE
====================================

CLASS TIMETABLE:
${CLASS_TIMETABLE.map(day => `
${day.day.toUpperCase()}:
${day.periods.map((p, i) => `  ${i+1}. ${p.time} - ${p.subject} (${p.teacher})`).join('\n')}
`).join('\n')}

UPCOMING EVENTS:
${CULTURAL_EVENTS.filter(e => e.status === "upcoming").map(e => `• ${e.title} - ${e.date} ${e.time} at ${e.location}`).join('\n')}

PARENT MEETINGS:
${PARENT_MEETINGS.filter(m => m.status === "scheduled").map(m => `• Meeting with ${m.teacher} - ${m.date} ${m.time} (${m.mode})`).join('\n')}

EXAM SCHEDULE:
${EXAM_SCHEDULE.map(e => `• ${e.subject} - ${e.date} ${e.time} in ${e.room}`).join('\n')}

SPECIAL EVENTS:
${SPECIAL_EVENTS.map(e => `• ${e.title} - ${e.date} ${e.time}`).join('\n')}

PERSONAL EVENTS:
${personalEvents.map(e => `• ${e.title} - ${e.date} ${e.time}`).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
    `.trim();

    const blob = new Blob([allContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complete-schedule-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "All schedules have been exported successfully",
    });
  };

  // Register for cultural event
  const registerForEvent = (eventId: string) => {
    const event = CULTURAL_EVENTS.find(e => e.id === eventId);
    if (event) {
      toast({
        title: "Registration Successful!",
        description: `You have been registered for "${event.title}"`,
        variant: "default",
      });
    }
  };

  // Join online meeting
  const joinOnlineMeeting = (meetingLink?: string) => {
    if (meetingLink) {
      window.open(meetingLink, '_blank', 'noopener,noreferrer');
      toast({
        title: "Joining Meeting",
        description: "Opening meeting link in a new tab",
      });
    } else {
      toast({
        title: "No Meeting Link",
        description: "Meeting link will be shared by the teacher closer to the meeting time",
        variant: "destructive",
      });
    }
  };

  // View event details
  const viewEventDetails = (eventId: string, eventType: "cultural" | "meeting" | "exam" | "special" | "personal") => {
    let event: any;
    let title = "";
    let description = "";
    let details: string[] = [];

    switch (eventType) {
      case "cultural":
        event = CULTURAL_EVENTS.find(e => e.id === eventId);
        if (event) {
          title = event.title;
          description = event.description;
          details = [
            `Date: ${event.date}`,
            `Time: ${event.time}`,
            `Location: ${event.location}`,
            `Type: ${event.type.charAt(0).toUpperCase() + event.type.slice(1)}`,
            `Status: ${event.status}`,
            `Organizer: ${event.organizer}`,
            `Participants: ${event.participants}`
          ];
        }
        break;
      case "meeting":
        event = PARENT_MEETINGS.find(m => m.id === eventId);
        if (event) {
          title = `Meeting with ${event.teacher}`;
          description = event.notes;
          details = [
            `Date: ${event.date}`,
            `Time: ${event.time}`,
            `Subject: ${event.subject}`,
            `Mode: ${event.mode}`,
            `Status: ${event.status}`,
            ...(event.room ? [`Room: ${event.room}`] : []),
            ...(event.meetingLink ? [`Meeting Link: ${event.meetingLink}`] : [])
          ];
        }
        break;
      case "exam":
        event = EXAM_SCHEDULE.find(e => e.id === eventId);
        if (event) {
          title = `${event.subject} Exam`;
          description = `${event.type.charAt(0).toUpperCase() + event.type.slice(1)} examination`;
          details = [
            `Date: ${event.date}`,
            `Time: ${event.time} (${event.duration})`,
            `Room: ${event.room}`,
            `Type: ${event.type}`,
            `Maximum Marks: ${event.maxMarks}`
          ];
        }
        break;
      case "special":
        event = SPECIAL_EVENTS.find(e => e.id === eventId);
        if (event) {
          title = event.title;
          description = event.description;
          details = [
            `Date: ${event.date}`,
            `Time: ${event.time}`,
            `Category: ${event.category}`,
            `For: ${event.for === 'all' ? 'All Students' : `Grades ${event.grades?.join(', ')}`}`
          ];
        }
        break;
      case "personal":
        event = personalEvents.find(e => e.id === eventId);
        if (event) {
          title = event.title;
          description = event.description;
          details = [
            `Date: ${event.date}`,
            `Time: ${event.time}`,
            `Category: Personal Event`,
            ...(event.location ? [`Location: ${event.location}`] : []),
            ...(event.reminder ? [`Reminder: Set`] : [])
          ];
        }
        break;
    }

    if (event) {
      // Create a simple notification with details
      toast({
        title: title,
        description: (
          <div className="mt-2 space-y-1">
            <p className="text-sm">{description}</p>
            <div className="border-t pt-2 mt-2">
              {details.map((detail, index) => (
                <p key={index} className="text-xs text-gray-600">{detail}</p>
              ))}
            </div>
          </div>
        ),
        variant: "default",
      });
    }
  };

  // Add personal event
  const addPersonalEvent = () => {
    setAddEventDialogOpen(true);
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Title, Date, Time)",
        variant: "destructive",
      });
      return;
    }

    const personalEvent: PersonalEvent = {
      id: `personal-${Date.now()}`,
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      description: newEvent.description,
      category: "personal",
      location: newEvent.location,
      reminder: newEvent.reminder
    };

    setPersonalEvents(prev => [...prev, personalEvent]);
    setAddEventDialogOpen(false);
    
    // Reset form
    setNewEvent({
      title: "",
      date: "",
      time: "",
      description: "",
      location: "",
      reminder: false
    });

    toast({
      title: "Event Added!",
      description: `"${personalEvent.title}" has been added to your schedule`,
      variant: "default",
    });
  };

  // Filter schedule
  const openFilterDialog = () => {
    setFilterDialogOpen(true);
  };

  const handleApplyFilters = () => {
    setFilterDialogOpen(false);
    toast({
      title: "Filters Applied",
      description: "Your schedule has been filtered according to your preferences",
    });
  };

  const handleViewAllEvents = () => {
    setViewAllEventsDialogOpen(true);
  };

  // Get all events for the "View All Events" dialog
  const getAllEvents = (): UpcomingEvent[] => {
    const allEvents: UpcomingEvent[] = [];

    // Add cultural events
    CULTURAL_EVENTS.forEach(event => {
      allEvents.push({
        id: event.id,
        title: event.title,
        date: event.date,
        time: event.time,
        type: "cultural",
        location: event.location,
        status: event.status
      });
    });

    // Add parent meetings
    PARENT_MEETINGS.forEach(meeting => {
      allEvents.push({
        id: meeting.id,
        title: `Meeting with ${meeting.teacher}`,
        date: meeting.date,
        time: meeting.time,
        type: "meeting",
        status: meeting.status
      });
    });

    // Add special events
    SPECIAL_EVENTS.forEach(event => {
      allEvents.push({
        id: event.id,
        title: event.title,
        date: event.date,
        time: event.time,
        type: "special"
      });
    });

    // Add personal events
    personalEvents.forEach(event => {
      allEvents.push({
        id: event.id,
        title: event.title,
        date: event.date,
        time: event.time,
        type: "personal",
        location: event.location
      });
    });

    // Sort by date
    return allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const allEvents = getAllEvents();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Toast Provider */}
      <ToastProvider>
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
                  <CalendarIcon size={24} />
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
                    <p className="font-medium text-sm text-gray-800 truncate">
                      {studentId ? `Student ${studentId}` : "Student Portal"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">Class 10 • Section A</p>
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
                  <h1 className="text-xl font-bold text-gray-800">School Schedule</h1>
                  <p className="text-sm text-gray-600 hidden sm:block">
                    Timetable, events, meetings, and important dates
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
                <Button
                  onClick={exportAllSchedules}
                  variant="outline"
                  size="sm"
                >
                  <Download size={16} className="mr-2" />
                  Export
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
              {/* Main Content Area with Tabs - REMOVED THE DUPLICATE CARDS SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Calendar and Quick Info */}
                <div className="space-y-6">
                  {/* Calendar Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Calendar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                      />
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <div className="w-full space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span>Classes</span>
                          </div>
                          <span>6 periods</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>Events</span>
                          </div>
                          <span>3 upcoming</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <span>Meetings</span>
                          </div>
                          <span>2 scheduled</span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>

                  {/* Upcoming Events Card */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Upcoming Events</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleViewAllEvents}
                        >
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {upcomingEvents.map((event) => (
                          <div 
                            key={event.id} 
                            className="p-3 border rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                            onClick={() => viewEventDetails(event.id, event.type)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-sm">{event.title}</div>
                                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                  <CalendarIcon size={12} />
                                  {event.date} • {event.time}
                                </div>
                              </div>
                              {event.status && getStatusIcon(event.status)}
                            </div>
                            {event.location && (
                              <div className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                                <MapPin size={12} />
                                {event.location}
                              </div>
                            )}
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs capitalize">
                                {event.type}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setActiveTab("cultural")}
                      >
                        <CalendarDays size={16} className="mr-2" />
                        Browse Events
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                {/* Middle and Right Columns - Tabs Content */}
                <div className="lg:col-span-2">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-2 lg:grid-cols-5 mb-6">
                      <TabsTrigger value="timetable" className="flex items-center gap-2">
                        <Clock size={16} />
                        <span className="hidden sm:inline">Timetable</span>
                      </TabsTrigger>
                      <TabsTrigger value="cultural" className="flex items-center gap-2">
                        <Music size={16} />
                        <span className="hidden sm:inline">Cultural</span>
                      </TabsTrigger>
                      <TabsTrigger value="meetings" className="flex items-center gap-2">
                        <UserCheck size={16} />
                        <span className="hidden sm:inline">Meetings</span>
                      </TabsTrigger>
                      <TabsTrigger value="exams" className="flex items-center gap-2">
                        <BookOpen size={16} />
                        <span className="hidden sm:inline">Exams</span>
                      </TabsTrigger>
                      <TabsTrigger value="events" className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        <span className="hidden sm:inline">Events</span>
                      </TabsTrigger>
                    </TabsList>

                    {/* Timetable Tab */}
                    <TabsContent value="timetable" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Weekly Class Timetable</CardTitle>
                          <div className="text-sm text-gray-600">Class 10 • Section A • Academic Year 2025-26</div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {CLASS_TIMETABLE.map((day) => (
                              <Button
                                key={day.id}
                                variant={activeDay === day.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setActiveDay(day.id)}
                              >
                                {day.day}
                              </Button>
                            ))}
                          </div>

                          <div className="space-y-4">
                            {CLASS_TIMETABLE.find(d => d.id === activeDay)?.periods.map((period, index) => (
                              <div key={index} className="p-4 border rounded-xl hover:shadow-md transition-shadow">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                                  <div className="flex items-center gap-4">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                      <Clock size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                      <div className="font-semibold text-gray-800">{period.subject}</div>
                                      <div className="text-sm text-gray-600">{period.time}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-3">
                                    <Badge variant="outline" className="flex items-center gap-1">
                                      {getTypeIcon(period.type)}
                                      {period.type}
                                    </Badge>
                                    <div className="text-sm text-gray-600">
                                      <div className="font-medium">{period.teacher}</div>
                                      <div className="text-xs">Room: {period.room}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4">
                          <div className="flex justify-between items-center w-full">
                            <div className="text-sm text-gray-600">
                              Total periods: {CLASS_TIMETABLE.find(d => d.id === activeDay)?.periods.length}
                            </div>
                            <Button variant="outline" size="sm" onClick={downloadTimetable}>
                              <Download size={16} className="mr-2" />
                              Download
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </TabsContent>

                    {/* Cultural Events Tab */}
                    <TabsContent value="cultural" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Cultural Events & Activities</CardTitle>
                          <div className="text-sm text-gray-600">Music, Dance, Drama, Art, and Sports events</div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {CULTURAL_EVENTS.map((event) => (
                              <div key={event.id} className="p-4 border rounded-xl hover:shadow-md transition-shadow">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <Badge className={`${getEventColor(event.type)} border-0`}>
                                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                      </Badge>
                                      <Badge variant={event.status === "upcoming" ? "default" : "outline"}>
                                        {getStatusIcon(event.status)}
                                        <span className="ml-1">{event.status}</span>
                                      </Badge>
                                    </div>
                                    <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                                      <div className="flex items-center gap-1">
                                        <CalendarIcon size={14} />
                                        {event.date}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {event.time}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        {event.location}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Users size={14} />
                                        {event.participants} participants
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <Button 
                                      variant="outline"
                                      onClick={() => registerForEvent(event.id)}
                                      disabled={event.status !== "upcoming"}
                                    >
                                      {event.status === "upcoming" ? "Register" : "Closed"}
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => viewEventDetails(event.id, "cultural")}
                                    >
                                      Details
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Parent Meetings Tab */}
                    <TabsContent value="meetings" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Parent-Teacher Meetings</CardTitle>
                          <div className="text-sm text-gray-600">Scheduled meetings with subject teachers</div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {PARENT_MEETINGS.map((meeting) => (
                              <div key={meeting.id} className="p-4 border rounded-xl hover:shadow-md transition-shadow">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <Badge variant={meeting.mode === "online" ? "default" : "secondary"}>
                                        {meeting.mode === "online" ? <Video size={14} /> : <MapPin size={14} />}
                                        <span className="ml-1">{meeting.mode}</span>
                                      </Badge>
                                      <Badge variant={
                                        meeting.status === "scheduled" ? "default" :
                                        meeting.status === "completed" ? "outline" : "secondary"
                                      }>
                                        {getStatusIcon(meeting.status)}
                                        <span className="ml-1">{meeting.status}</span>
                                      </Badge>
                                    </div>
                                    <h3 className="font-semibold text-lg text-gray-800">
                                      Meeting with {meeting.teacher}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">{meeting.notes}</p>
                                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                                      <div className="flex items-center gap-1">
                                        <CalendarIcon size={14} />
                                        {meeting.date}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {meeting.time}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <BookOpen size={14} />
                                        {meeting.subject}
                                      </div>
                                      {meeting.room && (
                                        <div className="flex items-center gap-1">
                                          <MapPin size={14} />
                                          Room: {meeting.room}
                                        </div>
                                      )}
                                    </div>
                                    {meeting.meetingLink && meeting.status === "scheduled" && (
                                      <div className="mt-3">
                                        <Button 
                                          variant="link" 
                                          size="sm"
                                          onClick={() => joinOnlineMeeting(meeting.meetingLink)}
                                          className="p-0 h-auto text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                        >
                                          <Video size={14} />
                                          Join Online Meeting
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <Button 
                                      variant="outline" 
                                      disabled={meeting.status !== "scheduled"}
                                      onClick={() => meeting.status === "scheduled" && joinOnlineMeeting(meeting.meetingLink)}
                                    >
                                      {meeting.status === "scheduled" ? "Join" : "Completed"}
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => viewEventDetails(meeting.id, "meeting")}
                                    >
                                      Details
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Exams Tab */}
                    <TabsContent value="exams" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Examination Schedule</CardTitle>
                          <div className="text-sm text-gray-600">Term 1 Examinations - December 2025</div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {EXAM_SCHEDULE.map((exam) => (
                              <div key={exam.id} className="p-4 border rounded-xl hover:shadow-md transition-shadow">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                  <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${exam.type === "theory" ? "bg-blue-50" : "bg-green-50"}`}>
                                      {getTypeIcon(exam.type)}
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-lg text-gray-800">{exam.subject}</h3>
                                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                          <CalendarIcon size={14} />
                                          {exam.date}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Clock size={14} />
                                          {exam.time} ({exam.duration})
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <MapPin size={14} />
                                          {exam.room}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <BarChart size={14} />
                                          Max Marks: {exam.maxMarks}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    <Badge variant={exam.type === "theory" ? "default" : "secondary"}>
                                      {exam.type}
                                    </Badge>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => viewEventDetails(exam.id, "exam")}
                                    >
                                      Details
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <div className="text-sm text-gray-600">
                          Total exams: {EXAM_SCHEDULE.length} • Practical exams: {EXAM_SCHEDULE.filter(e => e.type === "practical").length}
                        </div>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  {/* Special Events Tab */}
                  <TabsContent value="events" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>School Events & Holidays</CardTitle>
                        <div className="text-sm text-gray-600">School holidays, celebrations, workshops, and field trips</div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Special Events */}
                          {SPECIAL_EVENTS.map((event) => (
                            <div key={event.id} className="p-4 border rounded-xl hover:shadow-md transition-shadow">
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Badge variant={
                                      event.category === "holiday" ? "secondary" :
                                      event.category === "celebration" ? "default" : "outline"
                                    }>
                                      {event.category}
                                    </Badge>
                                    <Badge variant="outline">
                                      {event.for === "all" ? "All Students" : `Grades: ${event.grades?.join(", ")}`}
                                    </Badge>
                                  </div>
                                  <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
                                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <CalendarIcon size={14} />
                                      {event.date}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock size={14} />
                                      {event.time}
                                    </div>
                                  </div>
                                </div>
                                <Button 
                                  variant="outline"
                                  onClick={() => viewEventDetails(event.id, "special")}
                                >
                                  Details
                                </Button>
                              </div>
                            </div>
                          ))}

                          {/* Personal Events */}
                          {personalEvents.length > 0 && (
                            <>
                              <div className="border-t pt-6 mt-6">
                                <h3 className="font-semibold text-lg text-gray-800 mb-4">Personal Events</h3>
                                {personalEvents.map((event) => (
                                  <div key={event.id} className="p-4 border border-indigo-200 rounded-xl hover:shadow-md transition-shadow bg-indigo-50/50 mb-3">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
                                            Personal
                                          </Badge>
                                          {event.reminder && (
                                            <Badge variant="outline" className="flex items-center gap-1">
                                              <Bell size={12} />
                                              Reminder
                                            </Badge>
                                          )}
                                        </div>
                                        <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                                          <div className="flex items-center gap-1">
                                            <CalendarIcon size={14} />
                                            {event.date}
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {event.time}
                                          </div>
                                          {event.location && (
                                            <div className="flex items-center gap-1">
                                              <MapPin size={14} />
                                              {event.location}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <Button 
                                        variant="outline"
                                        onClick={() => viewEventDetails(event.id, "personal")}
                                      >
                                        Details
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Bottom Info Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-800">Manage Your Schedule</h3>
                    <p className="text-sm text-gray-600">
                      Add personal events, filter your schedule, or export it for offline use.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={openFilterDialog}>
                      <Filter size={16} className="mr-2" />
                      Filter Schedule
                    </Button>
                    <Button onClick={addPersonalEvent}>
                      <Plus size={16} className="mr-2" />
                      Add Personal Event
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Add Event Dialog */}
      <Dialog open={addEventDialogOpen} onOpenChange={setAddEventDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Personal Event</DialogTitle>
            <DialogDescription>
              Add your personal events to keep track of your schedule
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Study Session, Doctor Appointment"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  placeholder="e.g., 2:00 PM - 3:00 PM"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                placeholder="e.g., Library, Home, Clinic"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add any notes or details..."
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="reminder"
                checked={newEvent.reminder}
                onChange={(e) => setNewEvent({...newEvent, reminder: e.target.checked})}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="reminder" className="text-sm font-normal">
                Set reminder for this event
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddEventDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEvent}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Filter Schedule</DialogTitle>
            <DialogDescription>
              Filter events by type, time period, and status
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label>Event Types</Label>
              <div className="grid grid-cols-2 gap-2">
                {["classes", "cultural", "meetings", "exams", "personal"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`type-${type}`}
                      checked={filters.eventTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({...filters, eventTypes: [...filters.eventTypes, type]});
                        } else {
                          setFilters({...filters, eventTypes: filters.eventTypes.filter(t => t !== type)});
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`type-${type}`} className="text-sm font-normal capitalize">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="timePeriod">Time Period</Label>
              <Select
                value={filters.timePeriod}
                onValueChange={(value) => setFilters({...filters, timePeriod: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Upcoming Events</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="next-month">Next Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="sortBy">Sort By</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => setFilters({...filters, sortBy: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date (Earliest First)</SelectItem>
                  <SelectItem value="date-desc">Date (Latest First)</SelectItem>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                  <SelectItem value="type">Event Type</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Status</Label>
              <div className="grid grid-cols-2 gap-2">
                {["upcoming", "ongoing", "completed", "cancelled"].map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`status-${status}`}
                      checked={filters.statuses.includes(status)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({...filters, statuses: [...filters.statuses, status]});
                        } else {
                          setFilters({...filters, statuses: filters.statuses.filter(s => s !== status)});
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`status-${status}`} className="text-sm font-normal capitalize">
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setFilters({
                  eventTypes: ["classes", "cultural", "meetings", "exams", "personal"],
                  timePeriod: "all",
                  sortBy: "date",
                  statuses: ["upcoming", "ongoing"]
                });
              }}
            >
              Reset Filters
            </Button>
            <Button onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View All Events Dialog */}
      <Dialog open={viewAllEventsDialogOpen} onOpenChange={setViewAllEventsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Events</DialogTitle>
            <DialogDescription>
              Complete list of all upcoming events
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {allEvents.length === 0 ? (
              <div className="text-center py-8">
                <CalendarDays size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No events found</p>
              </div>
            ) : (
              allEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="p-4 border rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => viewEventDetails(event.id, event.type)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{event.title}</div>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <CalendarIcon size={12} />
                        {event.date} • {event.time}
                      </div>
                      {event.location && (
                        <div className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                          <MapPin size={12} />
                          {event.location}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {event.type}
                      </Badge>
                      {event.status && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          {getStatusIcon(event.status)}
                          <span className="capitalize">{event.status}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewAllEventsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ToastViewport />
      </ToastProvider>
    </div>
  );
}