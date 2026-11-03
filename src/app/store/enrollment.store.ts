import { computed, inject } from '@angular/core';
import type { Signal } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { signalStore, withComputed, withMethods, patchState, withState } from '@ngrx/signals';
import { withEntities, setAllEntities, updateEntity } from '@ngrx/signals/entities';
import { HttpClient } from '@angular/common/http';
import type { Course } from '../models/course.model.ts';

export interface Enrollment {
  id: string;
  studentName: string;
  courseTitle: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export const EnrollmentStore = signalStore(
  { providedIn: 'root' }, // Singleton store across the app
  withState({ 
    isLoading: false, 
    error: null as string | null 
  }),
  withEntities<Enrollment>(),
  withComputed((store: { entities: Signal<Enrollment[]> }) => ({
    // Automatically recalculates whenever entities change in the store
    pendingCount: computed(() => 
      store.entities().filter(e => e.status === 'Pending').length
    ),
  })),
  withMethods((store, http = inject(HttpClient)) => {
    const apiUrl = 'https://localhost:5166/api/enrollments';

    return {
      // Load all enrollments
      loadEnrollments: () => {
        patchState(store, { isLoading: true, error: null });
        http.get<Enrollment[]>(apiUrl).pipe(
          catchError(err => {
            patchState(store, { isLoading: false, error: err.message });
            return EMPTY;
          })
        ).subscribe(rows => patchState(store, setAllEntities(rows), { isLoading: false }));
      },

      // Optimistic update with rollback on server failure
      approveEnrollment: (id: string) => {
        patchState(store, updateEntity({ id, changes: { status: 'Approved' } }));
        http.post(`${apiUrl}/${id}/approve`, {}).pipe(
          catchError(() => {
            patchState(store, updateEntity({ id, changes: { status: 'Pending' } }));
            patchState(store, { error: 'Failed to approve enrollment on server' });
            return EMPTY;
          })
        ).subscribe();
      }
    };
  })
);