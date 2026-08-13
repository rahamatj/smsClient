import { Component } from '@angular/core';
import { AuthPageLayoutComponent } from '@/shared/layout/auth-page-layout/auth-page-layout.component';
import { SigninFormComponent } from '@/shared/components/auth/signin-form/signin-form.component';


@Component({
  selector: 'app-sign-in',
  imports: [
    AuthPageLayoutComponent,
    SigninFormComponent,
  ],
  templateUrl: './sign-in.component.html',
})
export class SignInComponent {
    handleUsernameChange(value: string | number): void {
        console.log('Username changed:', value);
    }

    handlePasswordChange(value: string | number): void {
        console.log('Password changed:', value);
    }
}
