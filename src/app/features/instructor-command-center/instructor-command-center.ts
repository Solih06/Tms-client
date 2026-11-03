import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import type { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentStore } from '../../store/enrollment.store.js';

@Component({
  selector: 'app-instructor-command-center',
  standalone: true,
  imports: [CommonModule],
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
        <table class="enrollment-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            @for (enrollment of store.entities(); track enrollment.id) {
              <tr>
                <td>{{ enrollment.studentName }}</td>
                <td>{{ enrollment.courseTitle }}</td>
                <td>
                  <span [class]="'badge ' + enrollment.status.toLowerCase()">
                    {{ enrollment.status }}
                  </span>
                </td>
                <td>
                  @if (enrollment.status === 'Pending') {
                    <button (click)="store.approveEnrollment(enrollment.id)">
                      Approve (Optimistic)
                    </button>
                  }
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4">No enrollments found.</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
  styles: [`
    .command-center { padding: 2rem; font-family: sans-serif; max-width: 900px; }
    .stats-bar { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { background: #f4f6f8; padding: 1rem; border-radius: 6px; border: 1px solid #d1d5db; }
    .enrollment-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    .enrollment-table th, .enrollment-table td { padding: 0.75rem; border: 1px solid #e5e7eb; text-align: left; }
    .badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; font-weight: bold; }
    .badge.pending { background: #fef3c7; color: #92400e; }
    .badge.approved { background: #d1fae5; color: #065f46; }
    button { padding: 0.4rem 0.8rem; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #1d4ed8; }
    .spinner { font-style: italic; color: #6b7280; padding: 1rem 0; }
    .error { background: #fee2e2; color: #991b1b; padding: 0.75rem; border-radius: 4px; }
  `]
})
export class InstructorCommandCenterComponent implements OnInit {
  readonly store = inject(EnrollmentStore);

  ngOnInit() {
    this.store.loadEnrollments();
  }
}