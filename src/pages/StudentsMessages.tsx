// src/pages/student/MessagesPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Star,
  StarOff,
  Reply,
  Forward,
  Archive,
  Trash2,
  Eye,
  EyeOff,
  Bell,
  Download,
  Check,
  CheckCircle,
  AlertCircle,
  User,
  Users,
  BookOpen,
  School,
  Calendar,
  FileText,
  MessageSquare,
  Menu,
  Home,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Mail,
  MailOpen,
  UserPlus,
  Shield,
  Megaphone,
  BarChart3,
  BellRing,
  Clock,
  HelpCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

// Sidebar navigation items - Fixed paths with /student/ prefix
const navItems = [
  { 
    id: "dashboard", 
    label: "Dashboard", 
    icon: <Home size={20} />, 
    path: "/student/dashboard",
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
    icon: <BarChart3 size={20} />, 
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
    active: true,
    description: "Communicate with teachers"
  },
  { 
    id: "help", 
    label: "Help & Support", 
    icon: <HelpCircle size={20} />, 
    path: "/student/help",
    description: "Get help and support"
  },
];

// Types
interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    role: "teacher" | "admin" | "principal" | "system" | "parent" | "student";
    avatar?: string;
  };
  title: string;
  content: string;
  category: "academic" | "announcement" | "assignment" | "event" | "parent" | "system";
  priority: "low" | "normal" | "high" | "urgent";
  timestamp: string;
  read: boolean;
  starred: boolean;
  attachments?: {
    name: string;
    size: string;
    type: string;
  }[];
  replies?: Message[];
  class?: string;
  subjectName?: string;
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  subject?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

// Mock Data
const TEACHERS = [
  { id: "t1", name: "Ms. Geeta Rao", subject: "Mathematics", avatar: "GR" },
  { id: "t2", name: "Mr. R. Sharma", subject: "English", avatar: "RS" },
  { id: "t3", name: "Dr. Sharma", subject: "Physics", avatar: "DS" },
  { id: "t4", name: "Ms. A. Iyer", subject: "Chemistry", avatar: "AI" },
  { id: "t5", name: "Dr. S. Khatri", subject: "Biology", avatar: "SK" },
  { id: "t6", name: "Mr. S. Kumar", subject: "Computer Science", avatar: "SK" },
  { id: "t7", name: "Mr. S. Rao", subject: "History", avatar: "SR" },
  { id: "t8", name: "Smt. L. Ramya", subject: "Art & Culture", avatar: "LR" },
  { id: "t9", name: "Mr. R. Patel", subject: "Physical Education", avatar: "RP" },
];

const MESSAGES: Message[] = [
  {
    id: "m1",
    sender: {
      id: "t1",
      name: "Ms. Geeta Rao",
      role: "teacher",
      avatar: "GR"
    },
    title: "Mathematics Assignment Submission Reminder",
    content: "Dear Students, This is a reminder that the mathematics assignment on 'Trigonometry Applications' is due tomorrow. Please ensure you submit your assignments through the portal by 5:00 PM. Late submissions will not be accepted. If you have any questions, please visit me during office hours.",
    category: "assignment",
    priority: "high",
    timestamp: "2025-12-10 14:30",
    read: false,
    starred: true,
    attachments: [
      { name: "Assignment_Guidelines.pdf", size: "2.4 MB", type: "pdf" },
      { name: "Sample_Solutions.docx", size: "1.8 MB", type: "doc" }
    ],
    class: "10-A",
    subjectName: "Mathematics"
  },
  {
    id: "m2",
    sender: {
      id: "admin",
      name: "School Administration",
      role: "admin",
      avatar: "SA"
    },
    title: "Annual Sports Day Announcement",
    content: "We are pleased to announce that our Annual Sports Day will be held on December 20, 2025. All students from classes 6-12 are expected to participate. The event will start at 8:00 AM in the school grounds. Please ensure you have your sports attire and house t-shirts. Parents are invited to attend.",
    category: "event",
    priority: "normal",
    timestamp: "2025-12-09 10:15",
    read: true,
    starred: false,
    class: "All",
    subjectName: "General"
  },
  {
    id: "m3",
    sender: {
      id: "t3",
      name: "Dr. Sharma",
      role: "teacher",
      avatar: "DS"
    },
    title: "Physics Lab Schedule Change",
    content: "Due to maintenance work in Lab-2, the physics practical sessions for Class 10-A scheduled for tomorrow have been moved to Lab-3. The timings remain the same (10:30 AM - 12:00 PM). Please bring your lab manuals and calculators.",
    category: "academic",
    priority: "normal",
    timestamp: "2025-12-08 16:45",
    read: true,
    starred: true,
    class: "10-A",
    subjectName: "Physics"
  },
  {
    id: "m4",
    sender: {
      id: "principal",
      name: "Principal's Office",
      role: "principal",
      avatar: "PO"
    },
    title: "Important: Parent-Teacher Meeting Schedule",
    content: "The Parent-Teacher Meeting for Class 10 students has been scheduled for December 15, 2025. Each parent will have a 15-minute slot with subject teachers. Please ensure your parents check their emails for the scheduled time slot. Attendance is mandatory.",
    category: "parent",
    priority: "urgent",
    timestamp: "2025-12-07 09:00",
    read: false,
    starred: false,
    attachments: [
      { name: "PTM_Schedule.pdf", size: "1.2 MB", type: "pdf" }
    ]
  },
  {
    id: "m5",
    sender: {
      id: "t2",
      name: "Mr. R. Sharma",
      role: "teacher",
      avatar: "RS"
    },
    title: "English Project Submission Deadline Extended",
    content: "The deadline for the English Literature Project has been extended by 3 days. New submission date: December 18, 2025. Please use this extra time to improve the quality of your work. The project guidelines remain unchanged.",
    category: "assignment",
    priority: "normal",
    timestamp: "2025-12-06 11:20",
    read: true,
    starred: false,
    class: "10-A",
    subjectName: "English"
  },
  {
    id: "m6",
    sender: {
      id: "system",
      name: "EduManage System",
      role: "system",
      avatar: "EM"
    },
    title: "Portal Maintenance Notification",
    content: "The EduManage student portal will be undergoing scheduled maintenance on December 12, 2025, from 10:00 PM to 2:00 AM. During this time, the portal will be unavailable. Please plan your activities accordingly.",
    category: "system",
    priority: "low",
    timestamp: "2025-12-05 18:30",
    read: true,
    starred: false
  },
  {
    id: "m7",
    sender: {
      id: "t4",
      name: "Ms. A. Iyer",
      role: "teacher",
      avatar: "AI"
    },
    title: "Chemistry Practical Exam Guidelines",
    content: "Important guidelines for the upcoming Chemistry Practical Exam: 1. Bring your lab coat and safety goggles. 2. Arrive 15 minutes before your scheduled time. 3. No electronic devices allowed in the lab. 4. Follow all safety instructions carefully. The exam schedule will be posted tomorrow.",
    category: "academic",
    priority: "high",
    timestamp: "2025-12-04 15:10",
    read: false,
    starred: true,
    attachments: [
      { name: "Practical_Exam_Rules.pdf", size: "3.1 MB", type: "pdf" }
    ],
    class: "10-A",
    subjectName: "Chemistry"
  },
  {
    id: "m8",
    sender: {
      id: "admin",
      name: "School Administration",
      role: "admin",
      avatar: "SA"
    },
    title: "Library Week Celebration",
    content: "Join us for Library Week from December 14-20, 2025. Activities include: Book fair, Author talk sessions, Reading competitions, and Digital library workshops. Participation certificates will be awarded. Visit the library for more details.",
    category: "event",
    priority: "normal",
    timestamp: "2025-12-03 13:45",
    read: true,
    starred: false,
    class: "All",
    subjectName: "General"
  }
];

const CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    participants: [
      { id: "t1", name: "Ms. Geeta Rao", role: "Mathematics Teacher", avatar: "GR" },
      { id: "s1", name: "You", role: "Student" }
    ],
    lastMessage: "I've reviewed your assignment. Good work, but check problem 4 again.",
    lastMessageTime: "10:30 AM",
    unreadCount: 2,
    subject: "Mathematics Assignment Feedback"
  },
  {
    id: "c2",
    participants: [
      { id: "t3", name: "Dr. Sharma", role: "Physics Teacher", avatar: "DS" },
      { id: "s1", name: "You", role: "Student" }
    ],
    lastMessage: "The lab manual has been updated. Please download the new version.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    subject: "Physics Lab Updates"
  },
  {
    id: "c3",
    participants: [
      { id: "t2", name: "Mr. R. Sharma", role: "English Teacher", avatar: "RS" },
      { id: "s1", name: "You", role: "Student" }
    ],
    lastMessage: "Your essay submission was excellent!",
    lastMessageTime: "2 days ago",
    unreadCount: 0,
    subject: "English Essay Feedback"
  },
  {
    id: "c4",
    participants: [
      { id: "t4", name: "Ms. A. Iyer", role: "Chemistry Teacher", avatar: "AI" },
      { id: "s1", name: "You", role: "Student" }
    ],
    lastMessage: "Can we schedule extra help session tomorrow?",
    lastMessageTime: "3 days ago",
    unreadCount: 1,
    subject: "Chemistry Doubts"
  },
  {
    id: "c5",
    participants: [
      { id: "t6", name: "Mr. S. Kumar", role: "Computer Science Teacher", avatar: "SK" },
      { id: "s1", name: "You", role: "Student" }
    ],
    lastMessage: "Project submission reminder",
    lastMessageTime: "1 week ago",
    unreadCount: 0,
    subject: "CS Project Deadline"
  }
];

const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "New Assignment Posted",
    message: "Mathematics: Trigonometry Assignment has been posted",
    type: "info",
    timestamp: "10 minutes ago",
    read: false,
    action: {
      label: "View Assignment",
      url: "/student/assignments"
    }
  },
  {
    id: "n2",
    title: "Grade Updated",
    message: "Your Physics test score has been updated",
    type: "success",
    timestamp: "1 hour ago",
    read: true,
    action: {
      label: "View Grades",
      url: "/student/grades"
    }
  },
  {
    id: "n3",
    title: "Event Reminder",
    message: "Sports Day rehearsals start tomorrow at 3 PM",
    type: "warning",
    timestamp: "3 hours ago",
    read: false,
    action: {
      label: "View Schedule",
      url: "/student/schedule"
    }
  },
  {
    id: "n4",
    title: "System Alert",
    message: "Portal maintenance scheduled for tonight",
    type: "error",
    timestamp: "5 hours ago",
    read: true
  },
  {
    id: "n5",
    title: "New Message",
    message: "You have a new message from Ms. Geeta Rao",
    type: "info",
    timestamp: "1 day ago",
    read: false,
    action: {
      label: "View Message",
      url: "/student/messages"
    }
  }
];

export default function MessagesPage() {
  const navigate = useNavigate();
  const { id: studentId } = useParams<{ id?: string }>();
  const { toast } = useToast();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("messages");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(MESSAGES[0]);
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [newMessage, setNewMessage] = useState({
    to: "",
    title: "",
    content: "",
    category: "academic" as Message["category"],
    priority: "normal" as Message["priority"]
  });
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    assignmentAlerts: true,
    gradeUpdates: true,
    eventReminders: true,
    messageAlerts: true
  });

  // Stats
  const unreadCount = messages.filter(m => !m.read).length;
  const starredCount = messages.filter(m => m.starred).length;
  const highPriorityCount = messages.filter(m => m.priority === "high" || m.priority === "urgent").length;

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
    
    // Show toast for navigation
    if (id === "dashboard") {
      toast({
        title: "Navigating to Dashboard",
        description: "Loading your dashboard overview...",
      });
    }
  };

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    // Mark as read
    if (!message.read) {
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, read: true } : m
      ));
    }
  };

  const handleStarMessage = (messageId: string) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, starred: !m.starred } : m
    ));
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(prev => prev ? { ...prev, starred: !prev.starred } : null);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(messages.find(m => m.id !== messageId) || null);
    }
    toast({
      title: "Message Deleted",
      description: "The message has been moved to trash",
    });
  };

  const handleArchiveMessage = (messageId: string) => {
    toast({
      title: "Message Archived",
      description: "The message has been archived",
    });
  };

  const handleMarkAsRead = (messageId: string, read: boolean) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, read } : m
    ));
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(prev => prev ? { ...prev, read } : null);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.to || !newMessage.title || !newMessage.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: {
        id: "s1",
        name: "You",
        role: "student"
      },
      title: newMessage.title,
      content: newMessage.content,
      category: newMessage.category,
      priority: newMessage.priority,
      timestamp: new Date().toISOString(),
      read: true,
      starred: false,
      class: "10-A"
    };

    // Add to messages
    setMessages(prev => [newMsg, ...prev]);
    
    // Reset form
    setNewMessage({
      to: "",
      title: "",
      content: "",
      category: "academic",
      priority: "normal"
    });
    
    setShowNewMessageDialog(false);
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully",
    });
  };

  const handleReply = () => {
    if (!selectedMessage) return;
    
    setReplyingTo(selectedMessage);
    setNewMessage({
      to: selectedMessage.sender.name,
      title: `Re: ${selectedMessage.title}`,
      content: `\n\n--- Original Message ---\nFrom: ${selectedMessage.sender.name}\nDate: ${selectedMessage.timestamp}\nTitle: ${selectedMessage.title}\n\n${selectedMessage.content}`,
      category: selectedMessage.category,
      priority: "normal"
    });
    setShowNewMessageDialog(true);
  };

  const handleForward = () => {
    if (!selectedMessage) return;
    
    setNewMessage({
      to: "",
      title: `Fwd: ${selectedMessage.title}`,
      content: `\n\n--- Forwarded Message ---\nFrom: ${selectedMessage.sender.name}\nDate: ${selectedMessage.timestamp}\nTitle: ${selectedMessage.title}\n\n${selectedMessage.content}`,
      category: selectedMessage.category,
      priority: "normal"
    });
    setShowNewMessageDialog(true);
  };

  const handleMarkAllAsRead = () => {
    setMessages(prev => prev.map(m => ({ ...m, read: true })));
    toast({
      title: "All Messages Read",
      description: "All messages have been marked as read",
    });
  };

  const handleClearFilter = () => {
    setFilterCategory("all");
    setFilterPriority("all");
    setSearchQuery("");
  };

  const getPriorityColor = (priority: Message["priority"]) => {
    switch(priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "normal": return "bg-blue-100 text-blue-800 border-blue-200";
      case "low": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: Message["category"]) => {
    switch(category) {
      case "academic": return <BookOpen size={14} />;
      case "announcement": return <Megaphone size={14} />;
      case "assignment": return <FileText size={14} />;
      case "event": return <Calendar size={14} />;
      case "parent": return <UserPlus size={14} />;
      case "system": return <Shield size={14} />;
      default: return <Mail size={14} />;
    }
  };

  const getCategoryColor = (category: Message["category"]) => {
    switch(category) {
      case "academic": return "text-blue-600 bg-blue-50 border-blue-200";
      case "announcement": return "text-purple-600 bg-purple-50 border-purple-200";
      case "assignment": return "text-amber-600 bg-amber-50 border-amber-200";
      case "event": return "text-green-600 bg-green-50 border-green-200";
      case "parent": return "text-pink-600 bg-pink-50 border-pink-200";
      case "system": return "text-gray-600 bg-gray-50 border-gray-200";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  // Helper function to get avatar initials
  const getAvatarInitials = (name: string, avatar?: string) => {
    if (avatar) return avatar;
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Helper function to get avatar color based on role
  const getAvatarColor = (role: Message["sender"]["role"]) => {
    switch(role) {
      case "teacher": return "bg-blue-100 text-blue-800";
      case "admin": return "bg-purple-100 text-purple-800";
      case "principal": return "bg-red-100 text-red-800";
      case "system": return "bg-gray-100 text-gray-800";
      case "parent": return "bg-green-100 text-green-800";
      case "student": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredMessages = messages.filter(message => {
    // Search filter
    if (searchQuery && !message.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !message.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !message.sender.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filterCategory !== "all" && message.category !== filterCategory) {
      return false;
    }
    
    // Priority filter
    if (filterPriority !== "all" && message.priority !== filterPriority) {
      return false;
    }
    
    return true;
  });

  const unreadNotifications = notifications.filter(n => !n.read).length;

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
                <MessageSquare size={24} />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="font-bold text-lg text-gray-800">EduManage</h1>
                  <p className="text-xs text-gray-500">Student Portal</p>
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
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-100 text-blue-800">
                  {studentId ? `S${studentId.slice(-2)}` : "S1"}
                </AvatarFallback>
              </Avatar>
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
                <h1 className="text-xl font-bold text-gray-800">Messages & Notifications</h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Communicate with teachers and stay updated
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="relative"
                  onClick={() => {
                    toast({
                      title: "Notifications",
                      description: "Showing all notifications",
                    });
                  }}
                >
                  <BellRing size={16} className="mr-2" />
                  Notifications
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </div>
              <Avatar className="h-10 w-10 lg:hidden">
                <AvatarFallback className="bg-blue-100 text-blue-800">
                  {studentId ? `S${studentId.slice(-2)}` : "S1"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-600 text-sm font-medium flex items-center gap-2">
                        <Mail size={16} />
                        Total Messages
                      </div>
                      <div className="text-2xl lg:text-3xl font-bold text-blue-600 mt-2">
                        {messages.length}
                      </div>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Mail size={24} className="text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-600 text-sm font-medium flex items-center gap-2">
                        <MailOpen size={16} />
                        Unread
                      </div>
                      <div className="text-2xl lg:text-3xl font-bold text-amber-600 mt-2">
                        {unreadCount}
                      </div>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <MailOpen size={24} className="text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-600 text-sm font-medium flex items-center gap-2">
                        <Star size={16} />
                        Starred
                      </div>
                      <div className="text-2xl lg:text-3xl font-bold text-purple-600 mt-2">
                        {starredCount}
                      </div>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Star size={24} className="text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-600 text-sm font-medium flex items-center gap-2">
                        <AlertCircle size={16} />
                        High Priority
                      </div>
                      <div className="text-2xl lg:text-3xl font-bold text-red-600 mt-2">
                        {highPriorityCount}
                      </div>
                    </div>
                    <div className="bg-red-100 p-3 rounded-lg">
                      <AlertCircle size={24} className="text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Messages List */}
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div>
                        <CardTitle>Messages</CardTitle>
                        <CardDescription>
                          School announcements, teacher communications, and updates
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleMarkAllAsRead}
                          disabled={unreadCount === 0}
                        >
                          <Check size={16} className="mr-2" />
                          Mark All Read
                        </Button>
                        <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <Send size={16} className="mr-2" />
                              New Message
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Compose New Message</DialogTitle>
                              <DialogDescription>
                                Send a message to your teachers or school administration
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="recipient">To *</Label>
                                <Select
                                  value={newMessage.to}
                                  onValueChange={(value) => setNewMessage({...newMessage, to: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select recipient" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all-teachers">All Teachers</SelectItem>
                                    <SelectItem value="class-teacher">Class Teacher</SelectItem>
                                    <SelectItem value="subject-teacher">Subject Teacher</SelectItem>
                                    <SelectItem value="administration">School Administration</SelectItem>
                                    {TEACHERS.map(teacher => (
                                      <SelectItem key={teacher.id} value={teacher.name}>
                                        {teacher.name} ({teacher.subject})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                  id="title"
                                  placeholder="Enter message title"
                                  value={newMessage.title}
                                  onChange={(e) => setNewMessage({...newMessage, title: e.target.value})}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="category">Category</Label>
                                  <Select
                                    value={newMessage.category}
                                    onValueChange={(value: Message["category"]) => setNewMessage({...newMessage, category: value})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="academic">Academic</SelectItem>
                                      <SelectItem value="assignment">Assignment</SelectItem>
                                      <SelectItem value="announcement">Announcement</SelectItem>
                                      <SelectItem value="event">Event</SelectItem>
                                      <SelectItem value="parent">Parent Related</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="priority">Priority</Label>
                                  <Select
                                    value={newMessage.priority}
                                    onValueChange={(value: Message["priority"]) => setNewMessage({...newMessage, priority: value})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="low">Low</SelectItem>
                                      <SelectItem value="normal">Normal</SelectItem>
                                      <SelectItem value="high">High</SelectItem>
                                      <SelectItem value="urgent">Urgent</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="content">Message *</Label>
                                <Textarea
                                  id="content"
                                  placeholder="Type your message here..."
                                  value={newMessage.content}
                                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                                  rows={8}
                                  className="resize-none"
                                />
                              </div>
                            </div>
                            <DialogFooter className="flex-col sm:flex-row gap-2">
                              <div className="flex items-center gap-2 sm:mr-auto">
                                <Button variant="outline" size="sm">
                                  <Paperclip size={16} className="mr-2" />
                                  Attach File
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Smile size={16} />
                                </Button>
                              </div>
                              <Button variant="outline" onClick={() => setShowNewMessageDialog(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleSendMessage}>
                                <Send size={16} className="mr-2" />
                                Send Message
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    
                    {/* Search and Filters */}
                    <div className="flex flex-col lg:flex-row gap-4 mt-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search messages..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="academic">Academic</SelectItem>
                            <SelectItem value="announcement">Announcement</SelectItem>
                            <SelectItem value="assignment">Assignment</SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={filterPriority} onValueChange={setFilterPriority}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Priorities</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                        {(searchQuery || filterCategory !== "all" || filterPriority !== "all") && (
                          <Button variant="outline" onClick={handleClearFilter}>
                            Clear
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[500px]">
                      <div className="divide-y">
                        {filteredMessages.length === 0 ? (
                          <div className="p-8 text-center">
                            <Mail size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">No messages found</p>
                            {searchQuery || filterCategory !== "all" || filterPriority !== "all" ? (
                              <Button variant="link" onClick={handleClearFilter}>
                                Clear filters
                              </Button>
                            ) : null}
                          </div>
                        ) : (
                          filteredMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                selectedMessage?.id === message.id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                              } ${!message.read ? "bg-amber-50" : ""}`}
                              onClick={() => handleSelectMessage(message)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback className={getAvatarColor(message.sender.role)}>
                                      {getAvatarInitials(message.sender.name, message.sender.avatar)}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-gray-900 truncate">
                                        {message.sender.name}
                                      </span>
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs ${getPriorityColor(message.priority)}`}
                                      >
                                        {message.priority}
                                      </Badge>
                                      {!message.read && (
                                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs text-gray-500">
                                        {new Date(message.timestamp).toLocaleDateString('en-US', { 
                                          month: 'short', 
                                          day: 'numeric' 
                                        })}
                                      </span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleStarMessage(message.id);
                                        }}
                                        className="p-1 hover:bg-gray-100 rounded"
                                      >
                                        {message.starred ? (
                                          <Star size={14} className="text-amber-500 fill-amber-500" />
                                        ) : (
                                          <StarOff size={14} className="text-gray-400" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                  <p className="font-medium text-gray-800 truncate mb-1">
                                    {message.title}
                                  </p>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${getCategoryColor(message.category)} flex items-center gap-1`}
                                    >
                                      {getCategoryIcon(message.category)}
                                      {message.category}
                                    </Badge>
                                    {message.subjectName && (
                                      <span className="text-xs text-gray-600">
                                        {message.subjectName}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 line-clamp-2">
                                    {message.content}
                                  </p>
                                  {message.attachments && message.attachments.length > 0 && (
                                    <div className="flex items-center gap-1 mt-2">
                                      <Paperclip size={12} className="text-gray-400" />
                                      <span className="text-xs text-gray-500">
                                        {message.attachments.length} attachment{message.attachments.length > 1 ? 's' : ''}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Recent Conversations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Conversations</CardTitle>
                    <CardDescription>Continue chatting with your teachers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {conversations.map((conv) => (
                        <div
                          key={conv.id}
                          className="p-3 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                          onClick={() => {
                            toast({
                              title: "Opening Conversation",
                              description: `Opening chat with ${conv.participants[0].name}`,
                            });
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-blue-100 text-blue-800">
                                {getAvatarInitials(conv.participants[0].name, conv.participants[0].avatar)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium text-gray-800 truncate">
                                  {conv.participants[0].name}
                                </p>
                                <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                              </div>
                              <p className="text-sm text-gray-600 truncate">
                                {conv.lastMessage}
                              </p>
                              {conv.unreadCount > 0 && (
                                <span className="inline-block mt-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                                  {conv.unreadCount} new
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <MessageSquare size={16} className="mr-2" />
                      View All Conversations
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Right Column - Selected Message Details */}
              <div>
                {selectedMessage ? (
                  <Card className="sticky top-24">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className={getAvatarColor(selectedMessage.sender.role)}>
                              {getAvatarInitials(selectedMessage.sender.name, selectedMessage.sender.avatar)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{selectedMessage.sender.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant="outline" 
                                className={`${getCategoryColor(selectedMessage.category)} flex items-center gap-1`}
                              >
                                {getCategoryIcon(selectedMessage.category)}
                                {selectedMessage.category}
                              </Badge>
                              <Badge className={getPriorityColor(selectedMessage.priority)}>
                                {selectedMessage.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical size={20} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Message Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleStarMessage(selectedMessage.id)}>
                              {selectedMessage.starred ? (
                                <>
                                  <StarOff size={16} className="mr-2" />
                                  Unstar
                                </>
                              ) : (
                                <>
                                  <Star size={16} className="mr-2" />
                                  Star
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMarkAsRead(selectedMessage.id, !selectedMessage.read)}>
                              {selectedMessage.read ? (
                                <>
                                  <EyeOff size={16} className="mr-2" />
                                  Mark as Unread
                                </>
                              ) : (
                                <>
                                  <Eye size={16} className="mr-2" />
                                  Mark as Read
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleReply}>
                              <Reply size={16} className="mr-2" />
                              Reply
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleForward}>
                              <Forward size={16} className="mr-2" />
                              Forward
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleArchiveMessage(selectedMessage.id)}>
                              <Archive size={16} className="mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteMessage(selectedMessage.id)}
                              className="text-red-600"
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2">{selectedMessage.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(selectedMessage.timestamp).toLocaleString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {selectedMessage.class && (
                              <span className="flex items-center gap-1">
                                <School size={14} />
                                {selectedMessage.class}
                              </span>
                            )}
                            {selectedMessage.subjectName && (
                              <span className="flex items-center gap-1">
                                <BookOpen size={14} />
                                {selectedMessage.subjectName}
                              </span>
                            )}
                          </div>
                        </div>
                        <Separator />
                        <div className="prose max-w-none">
                          <p className="whitespace-pre-line text-gray-700">{selectedMessage.content}</p>
                        </div>
                        {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                                <Paperclip size={16} />
                                Attachments ({selectedMessage.attachments.length})
                              </h4>
                              <div className="space-y-2">
                                {selectedMessage.attachments.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-gray-100 rounded">
                                        <FileText size={20} className="text-gray-600" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm">{file.name}</p>
                                        <p className="text-xs text-gray-500">{file.size} • {file.type.toUpperCase()}</p>
                                      </div>
                                    </div>
                                    <Button variant="outline" size="sm">
                                      <Download size={16} className="mr-2" />
                                      Download
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button onClick={handleReply} className="flex-1">
                        <Reply size={16} className="mr-2" />
                        Reply
                      </Button>
                      <Button onClick={handleForward} variant="outline" className="flex-1">
                        <Forward size={16} className="mr-2" />
                        Forward
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Mail size={48} className="mx-auto text-gray-300 mb-4" />
                      <h3 className="font-medium text-gray-700 mb-2">No Message Selected</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Select a message from the list to view its details
                      </p>
                      <Button onClick={() => setShowNewMessageDialog(true)}>
                        <Send size={16} className="mr-2" />
                        Compose New Message
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Notifications Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Notifications</CardTitle>
                    <CardDescription>Stay updated with school announcements</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    toast({
                      title: "All Notifications Read",
                      description: "All notifications have been marked as read",
                    });
                  }}>
                    <Check size={16} className="mr-2" />
                    Mark All Read
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.slice(0, 4).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border rounded-lg ${
                        !notification.read ? "bg-blue-50 border-blue-200" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          notification.type === "info" ? "bg-blue-100 text-blue-600" :
                          notification.type === "warning" ? "bg-amber-100 text-amber-600" :
                          notification.type === "success" ? "bg-green-100 text-green-600" :
                          "bg-red-100 text-red-600"
                        }`}>
                          {notification.type === "info" ? <Bell size={16} /> :
                           notification.type === "warning" ? <AlertCircle size={16} /> :
                           notification.type === "success" ? <CheckCircle size={16} /> :
                           <AlertCircle size={16} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-800">{notification.title}</h4>
                            <span className="text-xs text-gray-500">{notification.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          {notification.action && (
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-auto mt-2"
                              onClick={() => navigate(notification.action!.url)}
                            >
                              {notification.action.label} →
                            </Button>
                          )}
                        </div>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => {
                  toast({
                    title: "View All Notifications",
                    description: "Opening notifications page",
                  });
                }}>
                  View All Notifications
                </Button>
              </CardFooter>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Customize how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <Label htmlFor={key} className="font-medium">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <p className="text-sm text-gray-500">
                          {key.includes('email') ? "Receive email notifications" :
                           key.includes('push') ? "Receive push notifications" :
                           key.includes('assignment') ? "Get alerts for new assignments" :
                           key.includes('grade') ? "Notify when grades are updated" :
                           key.includes('event') ? "Remind about upcoming events" :
                           "Alert for new messages"}
                        </p>
                      </div>
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({
                          ...prev,
                          [key]: checked
                        }))}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => {
                  toast({
                    title: "Settings Saved",
                    description: "Your notification preferences have been updated",
                  });
                }}>
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}