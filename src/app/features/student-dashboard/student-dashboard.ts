import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCardComponent } from '../../ui/course-card/course-card.js';
import type { Course } from '../../models/course.model.ts';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  template: `
    <div class="dashboard-container">
      <h1>Welcome, {{ studentName() }}!</h1>
      <p>Credits: {{ earnedCredits() }}</p>
      <p>Status: <span [class.eligible]="graduationStatus() === 'Eligible'">{{ graduationStatus() }}</span></p>
      <button (click)="addCredits()">Register for class</button>

      <hr style="margin: 2rem 0;" />

      <h2>Available Courses</h2>
      <app-course-card 
        [course]="sampleCourse" 
        (enrollClicked)="handleEnroll($event)" />

      @if (enrolledCourse()) {
        <div class="success-banner">
          <p>✅ Successfully enrolled in: <strong>{{ enrolledCourse()?.title }}</strong></p>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 2rem; font-family: sans-serif; max-width: 600px; }
    button { margin-top: 1rem; padding: 0.5rem 1rem; cursor: pointer; border-radius: 4px; background: #007bff; color: white; border: none; }
    button:hover { background: #0056b3; }
    .eligible { color: #28a745; font-weight: bold; }
    .success-banner { margin-top: 1.5rem; padding: 1rem; background: #e8f5e9; border: 1px solid #c8e6c9; border-radius: 6px; color: #2e7d32; }
  `]
})
export class StudentDashboardComponent {
  studentName = signal('Liya Kebede');
  earnedCredits = signal(45);
  
  graduationStatus = computed(() =>
    this.earnedCredits() >= 120 ? 'Eligible' : 'In Progress'
  );

  sampleCourse: Course = {
    id: 1,
    title: 'Advanced Full Stack Architecture',
    capacity: 30,
    startDate: '2026-06-01'
  };

  // Track the currently enrolled course via a signal
  enrolledCourse = signal<Course | null>(null);

  addCredits() {
    this.earnedCredits.update(c => c + 3);
  }

  handleEnroll(course: Course) {
    this.enrolledCourse.set(course);
    console.log('Successfully enrolled in course ID:', course.id);
  }
}