import type { Routes } from '@angular/router';
import { StudentDashboardComponent } from './features/student-dashboard/student-dashboard.js';
import { InstructorCommandCenterComponent } from './features/instructor-command-center/instructor-command-center.js';

export const routes: Routes = [
  { path: 'dashboard', component: StudentDashboardComponent },
  { path: 'command-center', component: InstructorCommandCenterComponent },
  { 
    path: 'courses/:id', 
    loadComponent: () => import('./features/course-detail/course-detail.js').then(m => m.CourseDetailComponent) 
  },
  { path: '', redirectTo: 'command-center', pathMatch: 'full' }
];