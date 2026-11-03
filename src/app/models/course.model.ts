export interface Course {
    readonly id: number;
    title: string;
    capacity: number;
    startDate: string; // ISO Date string (e.g. '2026-06-01')
}

export type CourseStatus =
| { status: "DRAFT"; createdBy: string; createdAt: string }
| { status: "PUBLISHED"; publishedAt: string; syllabus: string }
| { status: "ACTIVE"; enrolledCount: number; startDate: string }
| { status: "ARCHIVED"; archivedAt: string; finalEnrollmentCount: number }
| { status: "CANCELLED"; reason: string; cancelledAt: string };

export function describeCourse(status: CourseStatus): string {
  switch (status.status) {
    case "DRAFT":
      return `Course is in draft mode, created by ${status.createdBy}`;
    case "PUBLISHED":
      return `Course is published with syllabus: ${status.syllabus}`;
    case "ACTIVE":
      return `Course is active with ${status.enrolledCount} enrolled students`;
    case "ARCHIVED":
      return `Course is archived with ${status.finalEnrollmentCount} final enrollments`;
    case "CANCELLED":
      return `Course is cancelled. Reason: ${status.reason}`;
    default:
      const exhaustive: never = status;
      return exhaustive;
  }
}