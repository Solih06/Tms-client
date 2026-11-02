import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>Welcome, {{ studentName() }}!</h1>
      <p>Credits: {{ earnedCredits() }}</p>
      <p>Status: <span [class.eligible]="graduationStatus() === 'Eligible'">{{ graduationStatus() }}</span></p>
      <button (click)="addCredits()">Register for class</button>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 2rem; font-family: sans-serif; }
    button { margin-top: 1rem; padding: 0.5rem 1rem; cursor: pointer; border-radius: 4px; background: #007bff; color: white; border: none; }
    button:hover { background: #0056b3; }
    .eligible { color: #28a745; font-weight: bold; }
  `]
})
export class StudentDashboardComponent {
  studentName = signal('Liya Kebede');
  earnedCredits = signal(45);
  
  // Computed property derives automatically when earnedCredits updates
  graduationStatus = computed(() =>
    this.earnedCredits() >= 120 ? 'Eligible' : 'In Progress'
  );

  addCredits() {
    this.earnedCredits.update(c => c + 3);
  }
}
