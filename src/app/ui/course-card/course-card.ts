import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Course, CourseStatus } from '../../models/course.model.ts';
import { describeCourse } from '../../models/course.model.js';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h3>{{ course().title }} (ID: {{ course().id }})</h3>
      <p>Capacity: {{ course().capacity }}</p>
      <p class="status-text">{{ statusDescription() }}</p>
      <button (click)="enrollClicked.emit(course())">Enroll</button>
    </div>
  `,
  styles: [`
    .card { border: 1px solid #ddd; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
    h3 { margin: 0 0 0.5rem 0; font-size: 1.1rem; }
    p { margin: 0 0 0.5rem 0; color: #666; }
    .status-text { font-style: italic; color: #007bff; font-size: 0.9rem; }
    button { padding: 0.4rem 0.8rem; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 0.5rem; }
    button:hover { background: #218838; }
  `]
})
export class CourseCardComponent {
  course = input.required<Course>();
  
  // Use computed so it evaluates safely after the input is bound
  statusDescription = computed(() => {
    const currentStatus: CourseStatus = {
      status: 'ACTIVE',
      enrolledCount: 15,
      startDate: this.course().startDate
    };
    return describeCourse(currentStatus);
  });

  enrollClicked = output<Course>();
}