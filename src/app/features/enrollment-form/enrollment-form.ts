import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="enrollment-form">
      <h3>Course Enrollment</h3>
      
      <div class="form-group">
        <label for="studentId">Student ID</label>
        <input id="studentId" formControlName="studentId" placeholder="e.g. STU-1234" />
        @if (form.controls.studentId.touched && form.controls.studentId.invalid) {
          <span class="error">Valid Student ID is required (format: STU-XXXX).</span>
        }
      </div>

      <div class="form-group">
        <label for="term">Term</label>
        <select id="term" formControlName="term">
          <option value="Fall 2026">Fall 2026</option>
          <option value="Spring 2027">Spring 2027</option>
        </select>
      </div>

      <div class="form-group">
        <label for="notes">Backup Notes / Choices</label>
        <textarea id="notes" formControlName="notes" placeholder="Enter backup choices or comments..."></textarea>
      </div>

      <button type="submit">Confirm Enrollment</button>
    </form>
  `,
  styles: [`
    .enrollment-form { display: flex; flex-direction: column; gap: 1rem; max-width: 400px; padding: 1.5rem; border: 1px solid #ddd; border-radius: 8px; font-family: sans-serif; background: #fff; }
    .form-group { display: flex; flex-direction: column; gap: 0.3rem; }
    input, select, textarea { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
    .error { color: #dc3545; font-size: 0.85rem; }
    button { padding: 0.7rem 1rem; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
    button:hover { background: #218838; }
  `]
} )
export class EnrollmentFormComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    studentId: ['', [Validators.required, Validators.pattern('^STU-[0-9]{4}$')]],
    term: ['Fall 2026', Validators.required],
    notes: ['']
  });

  submit() {
    if (this.form.valid) {
      // getRawValue() ensures disabled fields are included
      console.log('Payload:', this.form.getRawValue());
      alert('Enrollment submitted successfully! Check console for payload.');
    } else {
      this.form.markAllAsTouched(); // Force red validation outlines on invalid fields
    }
  }
}