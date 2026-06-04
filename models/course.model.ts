import {Temporal} from "@js-temporal/polyfill";

export interface Course {
    readonly id: number;
    title: string;
    capacity: number;
    startDate: Temporal.PlainDate;
}

export type CourseStatus =
| { status: "DRAFT"; createdBy: string; createdAt: Temporal.Instant }
| { status: "PUBLISHED"; publishedAt: Temporal.Instant; syllabus: string }
| {
status: "ACTIVE";
enrolledCount: number;
startDate: Temporal.PlainDate;
}
| {
status: "ARCHIVED";
archivedAt: Temporal.Instant;
finalEnrollmentCount: number;
}
| { status: "CANCELLED"; reason: string; cancelledAt: Temporal.Instant };


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