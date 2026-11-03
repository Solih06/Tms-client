import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.js';

export interface TmsUser {
  displayName: string;
  role: string;
  roles?: string[];
}

export interface LoginRequest {
  username?: string;
  email?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/auth`;

  // Reactive signal representing the currently authenticated user
  currentUser = signal<TmsUser | null>(null);

  // Authenticate user: server sets the HttpOnly tms_auth cookie automatically
  async login(credentials: LoginRequest): Promise<void> {
    await firstValueFrom(
      this.http.post<void>(`${this.base}/login`, credentials, {
        withCredentials: true
      })
    );

    // Fetch the authenticated user profile using the cookie session
    await this.loadUserProfile();
  }

  // Load user profile via Cookie session
  async loadUserProfile(): Promise<void> {
    try {
      const user = await firstValueFrom(
        this.http.get<TmsUser>(`${this.base}/me`, {
          withCredentials: true
        })
      );
      this.currentUser.set(user);
    } catch {
      this.currentUser.set(null);
    }
  }

  // Check if the current user possesses a specific role (for route guards)
  hasRole(role: string): boolean {
    const user = this.currentUser();
    if (!user) return false;

    // Check primary role or roles array
    if (user.role === role) return true;
    if (user.roles && user.roles.includes(role)) return true;

    return false;
  }

  // Clear session on logout
  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post<void>(`${this.base}/logout`, {}, {
          withCredentials: true
        })
      );
    } catch {
      // Ignore network errors on logout
    } finally {
      this.currentUser.set(null);
    }
  }
}