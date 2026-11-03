import { Temporal } from "@js-temporal/polyfill";

export interface Student { 
    id: string;
    name: string;
    enrollmentDate: Temporal.Instant;
    gpa?: number; // Optional undefined until the student recieves a grade

}

export function isStudent(value: unknown): value is Student {
    return (
        typeof value === "object" &&
        value !== null &&
        "id" in value &&
        "name" in value &&
        typeof (value as Record<string, unknown>).id === "string" &&
        typeof (value as Record<string, unknown>).name === "string"
    );
}

export function parseStudent(raw: unknown): Student {
    if (typeof raw !== "object" || raw === null) {
        throw new TypeError(
        `Expected an object, recieved ${raw === null ? "null" : typeof raw}`,
    );
}

const obj = raw as Record<string, unknown>;
if (typeof obj.id !== "string") {
    throw new TypeError(
        `Expected 'id' to be a string, recieved ${typeof obj.id}`,
    );
}
if (typeof obj.name !== "string") {
    throw new TypeError(
        `Expected 'name' to be a string, recieved ${typeof obj.name}`,
    );
}
if (!(obj.enrollmentDate instanceof Temporal.Instant)) {
    throw new TypeError(
        `Expected 'enrollmentDate' to be a Temporal.Instant, recieved ${typeof obj.enrollmentDate}`,
    );
}


return {
    id: obj.id as string,
    name: obj.name as string,
    enrollmentDate: obj.enrollmentDate as Temporal.Instant,
   
};
}

