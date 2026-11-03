import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { CourseService, type Course } from '../../services/course.service.js';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="course-container">
      <h2>Course List</h2>
      
      @if (coursesResource.isLoading()) {
        <p>Loading courses from .NET API...</p>
      } @else if (coursesResource.error()) {
        <p class="error">Failed to load courses. Make sure your .NET backend is running at https://localhost:5001 with CORS enabled.</p>
      } @else {
        <ul>
          @for (course of coursesResource.value(); track course.id) {
            <li>
              <strong>{{ course.title }}</strong>
              <p>{{ course.description }}</p>
            </li>
          } @empty {
            <li>No courses found.</li>
          }
        </ul>
      }
    </div>
  `,
  styles: [`
    .course-container { padding: 2rem; font-family: sans-serif; }
    .error { color: #d9534f; }
    ul { list-style: none; padding: 0; }
    li { background: #f9f9f9; margin-bottom: 1rem; padding: 1rem; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
  `]
})
export class CourseListComponent {
  private courseService = inject(CourseService);

  coursesResource = rxResource<Course[], void>({
    stream: () => this.courseService.getCourses()
  });
}