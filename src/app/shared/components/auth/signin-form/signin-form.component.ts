
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

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [
      Validators.required,
      Validators.minLength(6)
    ]]
  });

  showPassword = false;
  isChecked = false;

  username = '';
  password = '';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    if (this.form.valid) {
      console.log('Form Values:', this.form.value);
      const username = this.form.get('username')?.value || '';
      const password = this.form.get('password')?.value || '';
      console.log('Username:', username);
      console.log('Password:', password);
      console.log('Keep logged in:', this.isChecked);

      this.authService.login(username, password)
        .subscribe({
          next: (response) => {
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Login failed:', error);
          }
        });

    } else {
      console.log('Form is invalid');
    }
  }
}
