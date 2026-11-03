import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLES_KEY = 'user_roles';

  // Retrieve JWT token for the HTTP interceptor
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Store token upon successful login
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Check if the user possesses a specific role (for the route guard)
  hasRole(role: string): boolean {
    const rolesJson = localStorage.getItem(this.ROLES_KEY);
    if (!rolesJson) return false;
    
    try {
      const roles: string[] = JSON.parse(rolesJson);
      return roles.includes(role);
    } catch {
      return false;
    }
  }

  // Set roles upon login
  setRoles(roles: string[]): void {
    localStorage.setItem(this.ROLES_KEY, JSON.stringify(roles));
  }

  // Clear session on logout
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLES_KEY);
  }
}