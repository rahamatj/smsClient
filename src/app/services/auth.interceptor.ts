import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from './auth.service';

/**
 * Functional HTTP interceptor to handle authentication.
 * 
 * Features:
 * - Automatically adds access token to all HTTP requests
 * - Handles 401 Unauthorized responses by refreshing the token
 * - Queues requests while token is being refreshed
 * - Prevents infinite refresh loops
 * - Logs all authentication events for debugging
 */

// Shared state for token refresh queue
let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  // Skip adding token to auth endpoints
  if (isAuthEndpoint(request)) {
    return next(request).pipe(
      catchError(error => handleError(error))
    );
  }

  // Add access token to request if it exists
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    request = addToken(request, accessToken);
  }

  return next(request).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        console.warn('[AuthInterceptor] Received 401 Unauthorized response');
        return handle401Error(request, next, authService);
      }
      return handleError(error);
    })
  );
};

/**
 * Adds Bearer token to request Authorization header
 */
function addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Handles 401 Unauthorized errors by refreshing the token
 */
function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap(() => {
        isRefreshing = false;
        const newAccessToken = localStorage.getItem('accessToken');
        if (!newAccessToken) {
          throw new Error('No access token available after refresh');
        }

        // Notify queued requests about the new token
        refreshTokenSubject.next(newAccessToken);

        // Retry the original request with new token
        return next(addToken(request, newAccessToken));
      }),
      catchError((error) => {
        isRefreshing = false;
        console.error('[AuthInterceptor] Token refresh failed:', error);

        // Logout user and redirect to sign-in
        authService.logout();

        return throwError(() => new Error('Token refresh failed. Please login again.'));
      }),
      finalize(() => {
        // Ensure isRefreshing is reset even if something goes wrong
        isRefreshing = false;
      })
    );
  } else {
    // Token refresh is already in progress, queue this request

    return refreshTokenSubject.pipe(
      // Wait for token to be available (not null)
      filter(token => token != null),
      // Only take the first emission
      take(1),
      // Retry request with new token
      switchMap((token) => {
        return next(addToken(request, token!));
      }),
      // If queued request fails after retry, log out
      catchError((error) => {
        console.error('[AuthInterceptor] Queued request failed:', error);
        authService.logout();
        return throwError(() => error);
      })
    );
  }
}

/**
 * Check if the request is for authentication endpoints (skip token addition)
 */
function isAuthEndpoint(request: HttpRequest<any>): boolean {
  return request.url.includes('/api/auth/login') ||
         request.url.includes('/api/auth/refreshtoken') ||
         request.url.includes('/api/auth/signup');
}

/**
 * Handle HTTP errors
 */
function handleError(error: any): Observable<never> {
  if (error instanceof HttpErrorResponse) {
    console.error(`[AuthInterceptor] HTTP Error ${error.status}:`, error.error);
  } else {
    console.error('[AuthInterceptor] Error:', error);
  }
  return throwError(() => error);
}
