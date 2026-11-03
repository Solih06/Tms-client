import type { Routes } from '@angular/router';
import { StudentDashboardComponent } from './features/student-dashboard/student-dashboard.js';
export const routes: Routes = [
  { path: 'dashboard', component: StudentDashboardComponent },
  { 
    path: 'courses/:id', 
    loadComponent: () => import('./features/course-detail/course-detail.js').then(m => m.CourseDetailComponent) 
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];