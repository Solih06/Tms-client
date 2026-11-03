import { Component, inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GradeSubmissionManager {
  private readonly submitSubject = new Subject<unknown>();
  readonly submissions$ = this.submitSubject.asObservable();

  triggerSubmit(payload: unknown): void {
    this.submitSubject.next(payload);
  }
}

@Component({
  selector: 'app-grade-submission',
  standalone: true,
  template: `
    <div class="grading-panel">
      <h3>Submit Student Grade</h3>
      <button (click)="onSubmit({ courseId: 'C101', grade: 'A' })">
        Submit Grade (Protected by exhaustMap)
      </button>
    </div>
  `
})
export class GradeSubmissionComponent {
  // Inject the manager service
  private gradeManager = inject(GradeSubmissionManager) as GradeSubmissionManager;

  onSubmit(payload: any) {
    // Pushing into the Subject safely drops rapid double-clicks
    this.gradeManager.triggerSubmit(payload);
  }
}