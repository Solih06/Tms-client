import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCardComponent } from '../../ui/course-card/course-card.js';
import { EnrollmentFormComponent } from '../enrollment-form/enrollment-form.js';
import type { Course } from '../../models/course.model.ts';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, CourseCardComponent, EnrollmentFormComponent],
  template: `
    <div class="dashboard-container">
      <h1>Welcome, {{ studentName() }}!</h1>
      <p>Credits: {{ earnedCredits() }}</p>
      <p>Status: <span [class.eligible]="graduationStatus() === 'Eligible'">{{ graduationStatus() }}</span></p>
      <button (click)="addCredits()">Register for class</button>

      <hr style="margin: 2rem 0;" />

      <h2>Course Catalog</h2>
      @if (availableCourses().length === 0) {
        <div class="empty-state">No courses are available this term.</div>
      } @else {
        <div class="grid">
          @for (course of availableCourses(); track course.id) {
            <app-course-card 
              [course]="course" 
              (enrollClicked)="handleEnroll($event)" />
          } @empty {
            <p>No results match your search.</p>
          }
        </div>
      }

      <hr style="margin: 2rem 0;" />

      <!-- Reactive Enrollment Form Integration -->
      <app-enrollment-form />

      @if (enrolledCourse()) {
        <div class="success-banner">
          <p>✅ Successfully enrolled in: <strong>{{ enrolledCourse()?.title }}</strong></p>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 2rem; font-family: sans-serif; max-width: 800px; }
    button { margin-top: 1rem; padding: 0.5rem 1rem; cursor: pointer; border-radius: 4px; background: #007bff; color: white; border: none; }
    button:hover { background: #0056b3; }
    .eligible { color: #28a745; font-weight: bold; }
    .grid { display: grid; gap: 1rem; margin-top: 1rem; }
    .empty-state { padding: 1.5rem; background: #fff3cd; border: 1px solid #ffeeba; border-radius: 6px; color: #856404; }
    .success-banner { margin-top: 1.5rem; padding: 1rem; background: #e8f5e9; border: 1px solid #c8e6c9; border-radius: 6px; color: #2e7d32; }
  `]
})
export class StudentDashboardComponent {
  studentName = signal('Liya Kebede');
  earnedCredits = signal(45);
  
  graduationStatus = computed(() =>
    this.earnedCredits() >= 120 ? 'Eligible' : 'In Progress'
  );

  availableCourses = signal<Course[]>([
    { id: 1, title: 'Advanced C#', credits: 4, openSeats: 10, status: 'Open', startDate: '2026-06-01', capacity: 30 },
    { id: 2, title: 'Angular UI', openSeats: 0, status: 'Closed', startDate: '2026-06-01', capacity: 30 }
  ]);

  enrolledCourse = signal<Course | null>(null);

  addCredits() {
    this.earnedCredits.update(c => c + 3);
  }

  handleEnroll(course: Course) {
    this.enrolledCourse.set(course);
    console.log('Successfully enrolled in course ID:', course.id);
  }
}