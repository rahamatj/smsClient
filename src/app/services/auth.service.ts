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
    return this.http
      .post<any>(`${environment.apiUrl}/api/auth/login`, {
        username,
        password,
      })
      .pipe(
        tap((res) => {
          const normalized = this.normalizeAuthResponse(res);
          if (!normalized.accessToken) {
            throw new Error("Login response missing access token");
          }

          localStorage.setItem("accessToken", normalized.accessToken);

          if (normalized.refreshToken) {
            localStorage.setItem("refreshToken", normalized.refreshToken);
          } else {
            localStorage.removeItem("refreshToken");
          }

          if (normalized.userId) {
            localStorage.setItem("userId", normalized.userId);
          } else {
            localStorage.removeItem("userId");
          }

          const expiryTime =
            this.getTokenExpiry(normalized.accessToken) ||
            this.getExpiresAt(normalized.expiresIn);
          localStorage.setItem("tokenExpiry", expiryTime.toString());

          if (normalized.user) {
            localStorage.setItem("user", JSON.stringify(normalized.user));
          } else {
            localStorage.removeItem("user");
          }

          this.isAuthenticatedSubject.next(true);
        }),
      );
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem("refreshToken");
    const userId = localStorage.getItem("userId");

    if (!refreshToken) {
      console.error('[AuthService] Missing refresh token');
      this.logout();
      return new Observable((observer) => {
        observer.error("No refresh token available");
      });
    }

    const refreshPayload: { refreshToken: string; userId?: string } = {
      refreshToken,
    };
    if (userId) {
      refreshPayload.userId = userId;
    }

    return this.http
      .post<any>(`${environment.apiUrl}/api/auth/refreshtoken`, refreshPayload)
      .pipe(
        tap((res) => {
          const normalized = this.normalizeAuthResponse(res);
          if (!normalized.accessToken) {
            console.error('[AuthService] Refresh response missing access token');
            throw new Error("No access token in refresh response");
          }

          localStorage.setItem("accessToken", normalized.accessToken);

          if (normalized.refreshToken) {
            localStorage.setItem("refreshToken", normalized.refreshToken);
          }

          if (normalized.userId) {
            localStorage.setItem("userId", normalized.userId);
          }

          if (normalized.user) {
            localStorage.setItem("user", JSON.stringify(normalized.user));
          }

          const expiryTime =
            this.getTokenExpiry(normalized.accessToken) ||
            this.getExpiresAt(normalized.expiresIn);
          localStorage.setItem("tokenExpiry", expiryTime.toString());

          this.isAuthenticatedSubject.next(true);
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

  private getExpiresAt(expiresIn: unknown): number {
    if (typeof expiresIn === "number" && Number.isFinite(expiresIn)) {
      return Math.floor(Date.now() / 1000) + expiresIn;
    }

    if (typeof expiresIn === "string") {
      const parsed = parseInt(expiresIn, 10);
      if (!Number.isNaN(parsed)) {
        return Math.floor(Date.now() / 1000) + parsed;
      }
    }

    return Math.floor(Date.now() / 1000) + 3600;
  }

  private normalizeAuthResponse(res: any): {
    accessToken: string | null;
    refreshToken: string | null;
    expiresIn: unknown;
    user: any | null;
    userId: string | null;
  } {
    const source = res?.data ?? res?.result ?? res;
    const user = source?.user ?? source?.User ?? null;

    const accessToken =
      source?.accessToken ??
      source?.token ??
      source?.jwtToken ??
      source?.access_token ??
      null;
    const refreshToken =
      source?.refreshToken ??
      source?.refresh_token ??
      null;

    const userIdRaw =
      source?.userId ??
      user?.userId ??
      user?.id ??
      user?.Id ??
      null;

    return {
      accessToken: typeof accessToken === "string" && accessToken ? accessToken : null,
      refreshToken: typeof refreshToken === "string" && refreshToken ? refreshToken : null,
      expiresIn: source?.expiresIn ?? source?.expires_in ?? null,
      user,
      userId: userIdRaw !== null && userIdRaw !== undefined ? String(userIdRaw) : null,
    };
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
