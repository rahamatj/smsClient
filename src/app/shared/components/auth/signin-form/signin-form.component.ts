
import { Component, inject } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin-form',
  imports: [
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './signin-form.component.html',
  styles: ``,
  standalone: true
})
export class SigninFormComponent {
  private readonly localAdminUsername = 'admin1';
  private readonly localAdminPassword = '123456';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    username: ['admin1', [Validators.required]],
    password: ['123456', [
      Validators.required,
      Validators.minLength(6)
    ]]
  });

  showPassword = false;
  isChecked = false;
  isLoading = false;
  errorMessage = '';

  username = '';
  password = '';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    this.errorMessage = '';
    
    if (this.form.valid) {
      this.isLoading = true;
      const username = this.form.get('username')?.value || '';
      const password = this.form.get('password')?.value || '';

      if (username === this.localAdminUsername && password === this.localAdminPassword) {
        localStorage.setItem('accessToken', 'local-admin-session');
        localStorage.setItem('refreshToken', 'local-admin-refresh');
        localStorage.setItem('userId', '1');
        localStorage.setItem('tokenExpiry', Math.floor(Date.now() / 1000 + 86400).toString());
        localStorage.setItem('user', JSON.stringify({ userId: 1, username: this.localAdminUsername, role: 'Admin' }));
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
        return;
      }

      this.authService.login(username, password)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Login failed:', error);
            this.errorMessage = error?.error?.message || 'Login failed. Please try again.';
          }
        });

    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }
}
