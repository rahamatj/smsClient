import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Angular Ecommerce Dashboard | TailAdmin';

  authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.refreshToken().subscribe({
      next: (res) => {
      },
      error: (err) => {
        console.error('[AppComponent] Token refresh failed', err);
      }
    });
  }
}
