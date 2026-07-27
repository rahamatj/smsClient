import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-red-600 mb-4">401</h1>
        <p class="text-2xl font-semibold text-gray-800 mb-2">Unauthorized</p>
        <p class="text-gray-600 mb-8">You don't have permission to access this resource.</p>
        <p class="text-gray-600 mb-8">Only Admins can access the dashboard.</p>
        <button
          (click)="goBack()"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/sign-in']);
  }
}
