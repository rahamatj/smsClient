import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/api/auth/login`,
      {
        username,
        password
      }
    ).pipe(
      tap(res => {
        if (res.accessToken && res.refreshToken) {
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
          localStorage.setItem('tokenExpiry', res.expiresIn || '3600'); // Store expiry in seconds
          
          // Store user data with role
          if (res.user) {
            localStorage.setItem('user', JSON.stringify(res.user));
          }
          
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      this.logout();
      return new Observable(observer => {
        observer.error('No refresh token available');
      });
    }

    return this.http.post<any>(
      `${environment.apiUrl}/api/auth/refreshtoken`,
      { refreshToken }
    ).pipe(
      tap(res => {
        if (res.accessToken) {
          localStorage.setItem('accessToken', res.accessToken);
          
          // Update refresh token if provided
          if (res.refreshToken) {
            localStorage.setItem('refreshToken', res.refreshToken);
          }
          
          // Update expiry if provided
          if (res.expiresIn) {
            localStorage.setItem('tokenExpiry', res.expiresIn);
          }
          
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/sign-in']);
  }

  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  private hasValidToken(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isTokenExpired(): boolean {
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) {
      return true;
    }

    // Check if token is expired (with 1 minute buffer)
    const expiryTime = parseInt(expiry, 10) * 1000; // Convert to milliseconds
    const currentTime = new Date().getTime();
    const bufferTime = 60000; // 1 minute buffer

    return currentTime > expiryTime - bufferTime;
  }
}