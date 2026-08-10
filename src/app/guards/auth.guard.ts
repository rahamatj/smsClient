import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.isLoggedIn()) {
      console.warn('User not logged in, redirecting to home page');
      this.router.navigate(['/unauthorized']);
      return false;
    }

    // Check for required roles if specified in route data
    const requiredRoles = route.data['roles'] as Array<string>;
    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = this.getUserRole();
      
      if (!userRole) {
        console.error('No user role found');
        this.router.navigate(['/unauthorized']);
        return false;
      }
      
      // Case-insensitive role matching
      const hasRequiredRole = requiredRoles.some(
        role => role.toLowerCase() === userRole.toLowerCase()
      );
      
      if (!hasRequiredRole) {
        console.error(`User role '${userRole}' does not match required roles:`, requiredRoles);
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    return true;
  }

  private getUserRole(): string | null {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const role = user.role || user.Role || null;
        return role;
      } else {
        console.warn('No user data found in localStorage, trying to extract from JWT token');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    
    // Fallback: extract role from JWT token
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const role = payload.role || payload.Role || null;
        return role;
      } catch (error) {
        console.error('Error extracting role from JWT token:', error);
      }
    }
    
    return null;
  }
}
