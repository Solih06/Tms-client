import { Component, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detail-container">
      <a routerLink="/dashboard">← Back to Dashboard</a>
      <h2>Course Details</h2>
      <p>Viewing details for course ID: <strong>{{ id() }}</strong></p>
    </div>
  `,
  styles: [`
    .detail-container { padding: 2rem; font-family: sans-serif; }
    a { display: inline-block; margin-bottom: 1rem; color: #007bff; text-decoration: none; }
    a:hover { text-decoration: underline; }
  `]
})
export class CourseDetailComponent {
  // Automatically grabs the :id parameter directly from the URL!
  id = input.required<string>();

  constructor() {
    effect(() => {
      console.log(`Fetching data for course ID: ${this.id()}`);
    });
  }
}