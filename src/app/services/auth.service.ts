import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap, BehaviorSubject, catchError, throwError } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "@/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasValidToken(),
  );

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  login(username: string, password: string): Observable<any> {

    console.log(`[AuthService] Attempting login for user: ${username}`);

    return this.http
      .post<any>(`${environment.apiUrl}/api/auth/login`, {
        username,
        password,
      })
      .pipe(
        tap((res) => {

          console.log(`[AuthService] Login response for user ${username}:`, res);

          if (res.accessToken && res.refreshToken) {
            localStorage.setItem("accessToken", res.accessToken);
            localStorage.setItem("refreshToken", res.refreshToken);
            localStorage.setItem("userId", res.user.userId || "");

            // Extract expiry from token or use provided value
            const expiryTime =
              this.getTokenExpiry(res.accessToken) ||
              (res.expiresIn
                ? parseInt(res.expiresIn, 10)
                : Math.floor(Date.now() / 1000) + 3600);
            localStorage.setItem("tokenExpiry", expiryTime.toString());

            // Store user data with role
            if (res.user) {
              localStorage.setItem("user", JSON.stringify(res.user));
            } else {
              console.warn('[AuthService] No user data in login response');
            }

            this.isAuthenticatedSubject.next(true);
          } else {
            console.error('[AuthService] Login response missing tokens:', { 
              hasAccessToken: !!res.accessToken,
              hasRefreshToken: !!res.refreshToken
            });
          }
        }),
      );
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem("refreshToken");
    const userId = localStorage.getItem("userId");

    if (!refreshToken || !userId) {
      console.error('[AuthService] Missing refresh token or user ID');
      this.logout();
      return new Observable((observer) => {
        observer.error("No refresh token or user ID available");
      });
    }

    return this.http
      .post<any>(`${environment.apiUrl}/api/auth/refreshtoken`, {
        userId: userId,
        refreshToken: refreshToken,
      })
      .pipe(
        tap((res) => {
          
          if (res.accessToken) {
            localStorage.setItem("accessToken", res.accessToken);

            // Update refresh token if provided
            if (res.refreshToken) {
              localStorage.setItem("refreshToken", res.refreshToken);
            }

            // Extract expiry from token or use provided value
            const expiryTime =
              this.getTokenExpiry(res.accessToken) ||
              (res.expiresIn
                ? parseInt(res.expiresIn, 10)
                : Math.floor(Date.now() / 1000) + 3600);
            localStorage.setItem("tokenExpiry", expiryTime.toString());

            this.isAuthenticatedSubject.next(true);
          } else {
            console.error('[AuthService] Refresh response missing access token');
            throw new Error("No access token in refresh response");
          }
        }),
        catchError((err) => {
          console.error('[AuthService] Token refresh error:', err);
          this.logout();
          return throwError(() => err);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("user");
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(["/"]);
  }

  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  private hasValidToken(): boolean {
    const accessToken = localStorage.getItem("accessToken");
    return !!accessToken;
  }

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  isTokenExpired(): boolean {
    const expiry = localStorage.getItem("tokenExpiry");
    if (!expiry) {
      return true;
    }

    // Check if token is expired (with 1 minute buffer)
    const expiryTime = parseInt(expiry, 10) * 1000; // Convert to milliseconds
    const currentTime = new Date().getTime();
    const bufferTime = 60000; // 1 minute buffer

    return currentTime > expiryTime - bufferTime;
  }

  /**
   * Extract expiry time from JWT token
   * JWT tokens have format: header.payload.signature
   * The payload contains an 'exp' claim with expiry in seconds
   */
  private getTokenExpiry(token: string): number | null {
    try {
      if (!token) return null;

      const parts = token.split(".");
      if (parts.length !== 3) {
        console.warn("Invalid JWT token format");
        return null;
      }

      // Decode the payload (second part)
      const payload = JSON.parse(atob(parts[1]));

      // Return expiry time in seconds (JWT uses seconds)
      if (payload.exp) {
        return payload.exp;
      }

      return null;
    } catch (error) {
      console.error("Error extracting token expiry:", error);
      return null;
    }
  }
}

// export class MyComponent {
//   constructor(private authService: AuthService) {}

//   onRefresh() {
//     this.authService.refreshToken().subscribe(
//       (error) => console.error("Refresh failed:", error),
//     );
//   }
// }
