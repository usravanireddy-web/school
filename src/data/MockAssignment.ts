// src/data/MockAssignment.ts
export type Attachment = {
  id: string;
  filename: string;
  url?: string;
};

export type Assignment = {
  id: string;
  title: string;
  subject?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  totalMarks?: number;
  attachments?: Attachment[];
  status?: "open" | "closed" | "graded" | "draft";
};

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "as1",
    title: "Algebra: Linear Equations",
    subject: "Mathematics",
    startDate: "2025-12-01",
    endDate: "2025-12-10",
    description: "Solve problems 1–20 from the textbook.",
    totalMarks: 20,
    attachments: [{ id: "att1", filename: "worksheet-algebra.pdf" }],
    status: "open",
  },
  {
    id: "as2",
    title: "Physics: Lab Report — Motion",
    subject: "Physics",
    startDate: "2025-11-20",
    endDate: "2025-12-08",
    description: "Prepare and upload lab report for the motion experiment.",
    totalMarks: 30,
    attachments: [{ id: "att2", filename: "lab-instructions.pdf" }],
    status: "open",
  },
  {
    id: "as3",
    title: "Chemistry: Periodic Table Quiz",
    subject: "Chemistry",
    startDate: "2025-11-28",
    endDate: "2025-12-05",
    description: "Short quiz - naming groups and properties.",
    totalMarks: 10,
    attachments: [],
    status: "graded",
  },
  {
    id: "as4",
    title: "English: Essay — My Favorite Book",
    subject: "English",
    startDate: "2025-11-30",
    endDate: "2025-12-12",
    description: "Write 500–700 words about your favourite book.",
    totalMarks: 25,
    attachments: [{ id: "att4", filename: "essay-guidelines.pdf" }],
    status: "open",
  },
  {
    id: "as5",
    title: "History: Local History Project",
    subject: "History",
    startDate: "2025-11-25",
    endDate: "2025-12-15",
    description: "Group project: document local history and create a poster.",
    totalMarks: 50,
    attachments: [],
    status: "open",
  },
  {
    id: "as6",
    title: "Biology: Plant Dissection",
    subject: "Biology",
    startDate: "2025-12-02",
    endDate: "2025-12-09",
    description: "Submit photos & short notes from dissection.",
    totalMarks: 15,
    attachments: [{ id: "att6", filename: "dissection-safety.pdf" }],
    status: "closed",
  },
  {
    id: "as7",
    title: "Computer Science: Small App",
    subject: "Computer Science",
    startDate: "2025-11-18",
    endDate: "2025-12-20",
    description: "Create a small web app demonstrating DOM manipulation.",
    totalMarks: 40,
    attachments: [{ id: "att7", filename: "project-specs.md" }],
    status: "draft",
  },
  {
    id: "as8",
    title: "Geography: Map Reading",
    subject: "Geography",
    startDate: "2025-12-03",
    endDate: "2025-12-11",
    description: "Complete the worksheet and mark routes.",
    totalMarks: 10,
    attachments: [],
    status: "open",
  },
  {
    id: "as9",
    title: "Art: Still Life Painting",
    subject: "Art",
    startDate: "2025-12-04",
    endDate: "2025-12-18",
    description: "Paint and upload a still life (photo accepted).",
    totalMarks: 30,
    attachments: [{ id: "att9", filename: "art-brief.pdf" }],
    status: "open",
  },
  {
    id: "as10",
    title: "Physical Education: Fitness Log",
    subject: "PE",
    startDate: "2025-11-15",
    endDate: "2025-12-07",
    description: "Submit 2-week fitness log and reflection.",
    totalMarks: 10,
    attachments: [],
    status: "graded",
  },
];
