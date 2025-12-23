// src/pages/students/AssignmentDetail.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_ASSIGNMENTS, Assignment, Attachment } from "@/data/MockAssignment";

const STORAGE_KEY = "student_assignments_submissions_v1";

type SubmissionRecord = {
  status: "not-submitted" | "submitting" | "submitted" | "graded";
  fileName?: string;
  submittedAt?: string;
  grade?: string;
};

function loadSubmissions(): Record<string, SubmissionRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function AssignmentDetail(): JSX.Element {
  // ✅ ONLY param that exists in route
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] =
    useState<Record<string, SubmissionRecord>>(loadSubmissions());
  const [uploading, setUploading] = useState(false);

  /* ---------------- LOAD ASSIGNMENT ---------------- */
  useEffect(() => {
    if (!assignmentId) return;

    const found = MOCK_ASSIGNMENTS.find(
      (a) => String(a.id) === String(assignmentId)
    ) ?? null;

    setAssignment(found);
  }, [assignmentId]);

  /* ---------------- PERSIST SUBMISSIONS ---------------- */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    } catch {
      // ignore
    }
  }, [submissions]);

  /* ---------------- ACTIONS ---------------- */
  const submitFile = (file?: File) => {
    if (!assignment) return;

    setUploading(true);
    setTimeout(() => {
      setSubmissions((prev) => ({
        ...prev,
        [assignment.id]: {
          status: "submitted",
          fileName: file?.name ?? "uploaded_file",
          submittedAt: new Date().toISOString(),
        },
      }));
      setUploading(false);
    }, 900);
  };

  const downloadAttachment = (att?: Attachment) => {
    if (!assignment) return;

    const filename = att?.filename ?? `${assignment.id}_attachment.txt`;
    const content = `Assignment: ${assignment.title}`;
    const blob = new Blob([content], { type: "application/octet-stream" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------------- NOT FOUND ---------------- */
  if (!assignment) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Assignment not found</h2>
        <p className="text-sm text-muted-foreground mt-2">
          We couldn't locate that assignment. Please go back to the assignments list.
        </p>
        <div className="mt-4">
          <Button onClick={() => navigate("/student/assignments")}>
            Back to assignments
          </Button>
        </div>
      </div>
    );
  }

  const submission = submissions[assignment.id];

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{assignment.title}</h1>
          <p className="text-sm text-muted-foreground">
            {assignment.subject} • {assignment.startDate} → {assignment.endDate}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button
            className="bg-blue-600 text-white"
            onClick={() => downloadAttachment(assignment.attachments?.[0])}
          >
            Download attachment
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm">
            {assignment.description ?? "No additional description."}
          </p>

          <div className="mb-3">
            <strong>Marks:</strong> {assignment.totalMarks ?? "N/A"}
          </div>

          <div className="mb-3">
            <strong>Attachments:</strong>
            <div className="mt-2 flex gap-2 flex-wrap">
              {assignment.attachments?.length ? (
                assignment.attachments.map((att) => (
                  <Button
                    key={att.id}
                    size="sm"
                    onClick={() => downloadAttachment(att)}
                  >
                    {att.filename}
                  </Button>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  No attachments
                </span>
              )}
            </div>
          </div>

          <div>
            <strong>Submission</strong>
            <div className="mt-2 flex items-center gap-3">
              <label>
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    submitFile(e.target.files?.[0]);
                    e.currentTarget.value = "";
                  }}
                />
                <Button className="bg-green-600 text-white">
                  {uploading
                    ? "Uploading…"
                    : submission
                    ? "Resubmit"
                    : "Upload & submit"}
                </Button>
              </label>

              {submission ? (
                <div className="text-sm">
                  <div>File: {submission.fileName}</div>
                  <div>
                    Submitted at:{" "}
                    {submission.submittedAt
                      ? new Date(submission.submittedAt).toLocaleString()
                      : "-"}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No submission yet.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teacher feedback / grading</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            (Placeholder) After teacher grades, show score, comments and rubric here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
