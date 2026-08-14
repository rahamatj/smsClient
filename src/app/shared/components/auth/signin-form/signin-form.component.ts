import {Component, inject} from '@angular/core';
import {LabelComponent} from '../../form/label/label.component';
import {CheckboxComponent} from '../../form/input/checkbox.component';
import {ButtonComponent} from '../../ui/button/button.component';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '@/services/auth.service';
import {Router} from '@angular/router';
import {InputFieldComponent} from "@/shared/components/input/input-field.component";

@Component({
    selector: 'app-signin-form',
    imports: [
        LabelComponent,
        CheckboxComponent,
        ButtonComponent,
        InputFieldComponent,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        InputFieldComponent
    ],
    templateUrl: './signin-form.component.html',
    styles: ``,
    standalone: true
})
export class SigninFormComponent {
    username = '';
    password = '';

    private authService = inject(AuthService);
    private router = inject(Router);

    showPassword = false;
    isChecked = false;
    isLoading = false;
    errorMessage = '';

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    onSignIn() {
        console.log("okay");

        this.errorMessage = '';

        this.isLoading = true;
        const username = this.username ?? '';
        const password = this.password ?? '';

        this.authService.login(username, password)
            .subscribe({
                next: (response) => {
                    console.log(response);

                    this.isLoading = false;
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    this.isLoading = false;
                    console.error('Login failed:', error);
                    this.errorMessage = error?.error?.message || 'Login failed. Please try again.';
                }
            });
    }

    handleUsernameChange(value: string | number): void {
        this.username = value as string;
    }

    handlePasswordChange(value: string | number): void {
        this.password = value as string;
    }
}
