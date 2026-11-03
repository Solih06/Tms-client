import { Component, signal, computed, inject } from '@angular/core';
import type { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { isObservable, of, type Observable } from 'rxjs';
import { CourseService } from '../../services/course.service.js';
import { CourseStore } from '../../store/course.store.js';
import { CourseHubService } from '../../services/course-hub.service.js';
import { CourseCardComponent } from '../../ui/course-card/course-card.js';
import { EnrollmentFormComponent } from '../enrollment-form/enrollment-form.js';
import type { Course } from '../../models/course.model.ts';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, CourseCardComponent, EnrollmentFormComponent],
  template: `
    <!-- Connection Status Banners (Exercise 3) -->
    @if (hub.connectionState() === 'reconnecting') {
      <div class="connection-banner warn">⚠️ Reconnecting to live updates...</div>
    }
    @if (hub.connectionState() === 'disconnected') {
      <div class="connection-banner error">❌ Live updates unavailable. Check your connection.</div>
    }

    <div class="dashboard-container">
      <h1>Welcome, {{ studentName() }}!</h1>
      <p>Credits: {{ earnedCredits() }}</p>
      <p>Status: <span [class.eligible]="graduationStatus() === 'Eligible'">{{ graduationStatus() }}</span></p>
      <button (click)="addCredits()">Register for class</button>

      <hr style="margin: 2rem 0;" />

      <h2>Course Catalog (Live Synchronized)</h2>
      @if (coursesResource.isLoading()) {
        <div class="spinner">Fetching live courses...</div>
      } @else if (coursesResource.error()) {
        <div class="alert">Failed to connect to TMS Server.</div>
      } @else {
        <div class="grid">
          <!-- Loop through store entities to reflect real-time SignalR patches -->
          @for (course of store.entities(); track course.id) {
            <app-course-card 
              [course]="course" 
              (enrollClicked)="handleEnroll($event)" />
          } @empty {
            <p>No courses available from server.</p>
          }
        </div>
      }

      <hr style="margin: 2rem 0;" />

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
    .spinner { padding: 1rem; color: #666; font-style: italic; }
    .alert { padding: 1rem; background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 4px; }
    .success-banner { margin-top: 1.5rem; padding: 1rem; background: #e8f5e9; border: 1px solid #c8e6c9; border-radius: 6px; color: #2e7d32; }
    .connection-banner { padding: 0.75rem 1.25rem; font-weight: 500; text-align: center; font-size: 0.9rem; }
    .connection-banner.warn { background: #fff3cd; color: #856404; border-bottom: 1px solid #ffeeba; }
    .connection-banner.error { background: #f8d7da; color: #721c24; border-bottom: 1px solid #f5c6cb; }
  `]
})
export class StudentDashboardComponent implements OnInit {
  private api = inject(CourseService);
  readonly store = inject(CourseStore);
  readonly hub = inject(CourseHubService);

  studentName = signal('Liya Kebede');
  earnedCredits = signal(45);
  
  graduationStatus = computed(() =>
    this.earnedCredits() >= 120 ? 'Eligible' : 'In Progress'
  );

  coursesResource = rxResource({
    stream: () => {
      const courses: unknown = this.api.getAll();
      return isObservable(courses)
        ? courses as Observable<Course[]>
        : of([] as Course[]);
    }
  });

  enrolledCourse = signal<Course | null>(null);

  ngOnInit() {
    // Initialize SignalR real-time synchronization pulse on component load
    this.store.initLiveUpdates();
  }

  addCredits() {
    this.earnedCredits.update(c => c + 3);
  }

  handleEnroll(course: Course) {
    this.enrolledCourse.set(course);
    console.log('Successfully enrolled in course ID:', course.id);
  }
}
