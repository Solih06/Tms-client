import { signalStore, withMethods, patchState } from '@ngrx/signals';
import { withEntities, removeEntity, setAllEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, exhaustMap, tap, catchError, EMPTY } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { CourseService } from '../services/course.service.js';
import { ToastService } from '../services/toast.service.js';
import { EnrollmentService } from '../services/enrollment.service.js';
import type { Course } from '../models/course.model.js';

export const CourseStore = signalStore(
  { providedIn: 'root' },
  withEntities<Course>(),
  withMethods((
    store,
    svc = inject(CourseService),
    enrollmentSvc = inject(EnrollmentService),
    toast = inject(ToastService)
  ) => ({
    
    // Enrollment Mutation using exhaustMap to prevent double-clicks
    enrollCourse: rxMethod<string>(
      pipe(
        exhaustMap((courseId) =>
          enrollmentSvc.create({ courseId }).pipe(
            tap({
              next: () => {
                toast.showSuccess('Successfully enrolled in course!');
              },
              error: (err: HttpErrorResponse) => {
                const errorMsg = err.error?.detail || 'Enrollment failed.';
                toast.showError(errorMsg);
              },
            }),
            catchError(() => EMPTY),
          ),
        ),
      ),
    ),

    // Optimistic Delete with automatic state rollback on failure
    deleteCourse: rxMethod<string>(
      pipe(
        exhaustMap((id) => {
          const previousState = store.entities(); // Snapshot state for rollback
          
          patchState(store, removeEntity(id));    // Instant optimistic removal

          return svc.delete(id).pipe(
            catchError((err: HttpErrorResponse) => {
              patchState(store, setAllEntities(previousState)); // Rollback on failure
              
              const errorMessage = err.error?.detail || 'Delete failed — the course has active enrollments.';
              toast.showError(errorMessage);
              
              return EMPTY;
            }),
          );
        }),
      ),
    ),

  }))
);