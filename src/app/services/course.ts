import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Course } from '../models/course.model.js';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:5166/api/courses';

  getAll() {
    return this.http.get<Course[]>(this.apiUrl);
  }
}