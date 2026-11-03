import { Component, inject, ChangeDetectionStrategy, effect } from '@angular/core';
import type { AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentStore } from '../../store/enrollment.store.js';
import type { Enrollment } from '../../store/enrollment.store.js';

@Component({
  selector: 'app-instructor-command-center',
  standalone: true,
  imports: [
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="command-center">
      <h2>Instructor Command Center</h2>
      
      <div class="stats-bar">
        <div class="stat-card">
          <span>Pending Approvals:</span>
          <strong>{{ store.pendingCount() }}</strong>
        </div>
      </div>

      @if (store.isLoading()) {
        <div class="spinner">Loading enrollments from server...</div>
      } @else if (store.error()) {
        <div class="alert error">{{ store.error() }}</div>
      } @else {
        <div class="mat-elevation-z8 table-container">
          <table>
            <thead>
              <tr>
                <th scope="col">Student</th>
                <th scope="col">Course</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              @for (element of enrollments; track element.id) {
                <tr>
                  <td>{{ element.studentName }}</td>
                  <td>{{ element.courseTitle }}</td>
                  <td><span>{{ element.status }}</span></td>
                  <td>
                    @if (element.status === 'Pending') {
                      <button type="button" (click)="store.approveEnrollment(element.id)">
                    Approve (Optimistic)
                      </button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- Performance Optimization: @defer block for analytics chunk -->
      @defer (on viewport; prefetch on idle) {
        <div class="analytics-panel">
          <h3>Enrollment Trend Analytics</h3>
          <p>Loaded asynchronously via chunk splitting to protect initial bundle size.</p>
        </div>
      } @placeholder {
        <div class="skeleton-chart">Scroll down to load enrollment analytics...</div>
      } @loading (minimum 300ms) {
        <div class="spinner">Downloading analytics engine...</div>
      }
    </div>
  `,
  styles: [`
    .command-center { padding: 2rem; font-family: sans-serif; max-width: 1000px; margin: auto; }
    .stats-bar { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { background: #f4f6f8; padding: 1rem; border-radius: 6px; border: 1px solid #d1d5db; }
    .table-container { border-radius: 8px; overflow: hidden; margin-top: 1rem; }
    table { width: 100%; }
    .spinner { font-style: italic; color: #6b7280; padding: 1rem 0; }
    .error { background: #fee2e2; color: #991b1b; padding: 0.75rem; border-radius: 4px; }
    .analytics-panel { margin-top: 2rem; padding: 1.5rem; background: #e0f2fe; border-radius: 8px; border: 1px solid #bae6fd; }
    .skeleton-chart { margin-top: 2rem; padding: 1.5rem; background: #f9fafb; border: 1px dashed #d1d5db; text-align: center; border-radius: 8px; color: #6b7280; }
  `]
})
export class InstructorCommandCenterComponent implements OnInit, AfterViewInit {
  readonly store = inject(EnrollmentStore);

  enrollments: Enrollment[] = [];

  constructor() {
    effect(() => {
      this.enrollments = this.store.entities();
    });
  }

  ngOnInit() {
    this.store.loadEnrollments();
  }

  ngAfterViewInit() {}
}