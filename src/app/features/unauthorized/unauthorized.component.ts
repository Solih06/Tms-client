import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="unauthorized-container" style="padding: 4rem; text-align: center; font-family: sans-serif;">
      <h1 style="color: #991b1b; font-size: 2.5rem; margin-bottom: 1rem;">Access Denied</h1>
      <p style="color: #4b5563; font-size: 1.1rem; margin-bottom: 2rem;">
        You do not have the required permissions (Instructor or Admin role) to view this dashboard.
      </p>
      <a routerLink="/" style="padding: 0.75rem 1.5rem; background: #2563eb; color: white; border-radius: 6px; text-decoration: none; font-weight: bold;">
        Return to Home
      </a>
    </div>
  `
})
export class UnauthorizedComponent {}