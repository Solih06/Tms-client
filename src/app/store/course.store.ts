import { signalStore, withMethods, patchState } from '@ngrx/signals';
import { withEntities, removeEntity, setAllEntities, updateEntity } from '@ngrx/signals/entities';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, switchMap, auditTime, catchError, EMPTY } from 'rxjs';
import { CourseService } from '../services/course.service.js';
import { CourseHubService } from '../services/course-hub.service.js';
import { ToastService } from '../services/toast.service.js';

export interface Course {
  id: string;
  code: string;
  title: string;
  maxCapacity: number;
  status?: string;
}

export const CourseStore = signalStore(
  { providedIn: 'root' },
  withEntities<Course>(),
  withMethods((
    store, 
    svc = inject(CourseService), 
    hub = inject(CourseHubService),
    toast = inject(ToastService)
  ) => ({
    
    // Optimistic delete with automatic rollback on server error
    deleteCourse(id: string) {
      const previous = [...store.entities()]; // Snapshot current entities for rollback
      const deleteCourse = (svc as any).deleteCourse as ((id: string) => any) | undefined;

      patchState(store, removeEntity(id)); // Instant visual feedback

      if (!deleteCourse) {
        return;
      }

      deleteCourse.call(svc, id).pipe(
        catchError((err) => {
          patchState(store, setAllEntities(previous)); // Roll back store on failure
          toast.showError("Delete failed — the course has active enrollments.");
          return EMPTY;
        })
      ).subscribe();
    },

    // Live WebSocket updates via SignalR with rate-limiting (auditTime)
    initLiveUpdates: rxMethod<void>(
      pipe(
        tap(() => hub.start()),
        switchMap(() => hub.updates$),
        auditTime(100), // Collapse bursts: max 10 updates/second to prevent UI freezing
        tap((upd) => {
          patchState(
            store,
            updateEntity({ id: upd.courseId, changes: { status: upd.status } })
          );
        })
      )
    )

  }))
);