import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Course } from '../models/course.model.js';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  getAll() {
    throw new Error('Method not implemented.');
  }
  private http = inject(HttpClient);
  // Pointing to your hardened .NET 10 API endpoint
  private apiUrl = 'https://localhost:5001/api/courses';

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }
}