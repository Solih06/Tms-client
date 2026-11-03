import { Routes } from '@angular/router';
import { InstructorCommandCenterComponent } from './features/instructor-command-center/instructor-command-center';
import { instructorGuard } from './guards/instructor.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'instructor/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'instructor/dashboard',
    component: InstructorCommandCenterComponent,
    canActivate: [instructorGuard] // Protected by Exercise 7
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/unauthorized/unauthorized').then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    redirectTo: 'instructor/dashboard'
  }
];