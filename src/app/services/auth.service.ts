import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  login(username: string, password: string) {
    return this.http.post<any>(
      `${environment.apiUrl}/api/auth/login`,
      {
        username,
        password
      }
    ).pipe(
      tap(res => {
        localStorage.setItem('token', res.accessToken);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}