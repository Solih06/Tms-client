import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.js';
import type { Course } from '../models/course.model.js';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/courses`;

  // Matches your previous method name used in the component rxResource
  getAll(): Observable<Course[]> {
    return this.http.get<Course[]>(this.base);
  }

  // Alias if any component calls getCourses()
  getCourses(): Observable<Course[]> {
    return this.getAll();
  }

  // Required for store optimistic delete actions
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}