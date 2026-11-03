import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.js';

export interface CreateEnrollmentRequest {
  courseId: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  enrolledAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/enrollments`;

  create(request: CreateEnrollmentRequest): Observable<Enrollment> {
    return this.http.post<Enrollment>(this.base, request);
  }
}