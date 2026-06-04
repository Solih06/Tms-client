import { Temporal } from "@js-temporal/polyfill";
import type { Student } from "./models/student.model.ts";
import { isStudent } from "./models/student.model.js";
import { parseStudent } from "./models/student.model.js";
import type { AssessmentItem } from "./models/assesment.model.ts";
import { calculateGrade } from "./models/assesment.model.js";
import type { EnrollmentStatus } from "./models/enrollment.model.ts";
import { describeEnrollment } from "./models/enrollment.model.js";
import type { CourseStatus } from "./models/course.model.ts";
import { describeCourse } from "./models/course.model.js";

const student: Student = {
    id: "STU-001",
    name: "Hana Tadesse",
    enrollmentDate: Temporal.Now.instant(), // GPA is undefined until the student receives a grade
    gpa:2.8, // Explicitly set to undefined to indicate that the student has not yet received a grade
};

console.log("Student:", student);


function processStudent(raw: unknown) {
if (isStudent(raw)) {
const gpaDisplay = raw.gpa?.toFixed(2) ?? "Not yet graded";
console.log(`Student ${raw.name} GPA: ${gpaDisplay}`);
} else {
console.error("Invalid student data received");
}
}
processStudent({ id: "STU-001", name: "Hana", gpa: 3.7 });
processStudent(42);


console.log(parseStudent({ id: "STU-001", name: "Hana" }));
// Prints a valid Student object
parseStudent({ id: 42, name: "Test" });
// Throws: TypeError: Expected id to be a string, received number


const quiz: AssessmentItem = {
id: "QUIZ-001",
kind: "quiz",
title: "SQL Basics",
correctAnswers: 8,
totalQuestions: 10,
};
const lab: AssessmentItem = {
id: "LAB-001",
kind: "lab",
title: "REST API Project",
functionalityScore: 85,
codeQualityScore: 90,
};
console.log(`Quiz grade: ${calculateGrade(quiz)}%`); // 80
console.log(`Lab grade: ${calculateGrade(lab)}%`); // 87
// Verify readonly: the id property cannot be modified as it is read-only

const pending: EnrollmentStatus = {
status: "PENDING",
requestedAt: Temporal.Now.instant(),
studentId: "STU-001",
courseId: "CRS-101",
};
console.log(describeEnrollment(pending));
// Awaiting approval since 2026-05-08T...


const webDev: CourseStatus = {
status: "ACTIVE",
enrolledCount: 28,
startDate: Temporal.PlainDate.from("2026-09-01"),
};
console.log(describeCourse(webDev));

import type { ApiResponse } from "./models/api-response.model.ts"; 
import  { renderResponse } from "./models/api-response.model.js";
import type { Course } from "./models/course.model.js";
const studentRes: ApiResponse<Student> = {
status: "success",
data: {
id: "STU-001",
name: "Dawit Bekele",
enrollmentDate: Temporal.Now.instant(),
gpa: 3.4,
},
fetchedAt: Temporal.Now.instant(),
};
console.log(
renderResponse(studentRes, (s) => `${s.name} GPA: ${s.gpa ?? "N/A"}`),
);
// Nowtest with a different data type
const courseListRes: ApiResponse<Course[]> = {
status: "success",
data: [
{
id: 101,
title: "Web Development Fundamentals",
capacity: 30,
startDate: Temporal.PlainDate.from("2026-09-01"),
},
],
fetchedAt: Temporal.Now.instant(),
};
console.log(
renderResponse(courseListRes, (courses) =>
courses.map((c) => c.title).join(", "),
),
);

// 1. Record the exact moment an enrollment is approved (UTC)
const approvedAt = Temporal.Now.instant();
console.log(`Approved at (UTC): ${approvedAt}`);
// 2. Display in local timezone
const addisTime = approvedAt.toZonedDateTimeISO("Africa/Addis_Ababa");
const londonTime = approvedAt.toZonedDateTimeISO("Europe/London");
console.log(`Addis: ${addisTime.toPlainTime()}`);
console.log(`London: ${londonTime.toPlainTime()}`);
// Same moment, different wall-clock time
// 3. Course start date (date only, no time)
const courseStart = Temporal.PlainDate.from("2026-09-01");
const today = Temporal.Now.plainDateISO();
const daysUntilStart = today.until(courseStart).total({ unit: "days" });
console.log(`${Math.floor(daysUntilStart)} days until course starts`);
// 4. Assignment deadline duration
const deadline = Temporal.PlainDate.from("2026-12-15");
const remaining = today.until(deadline);
console.log(
`${remaining.total({ unit: "days" })} days until assignment is due`,
);