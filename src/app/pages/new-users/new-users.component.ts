import {Component, inject} from '@angular/core';
import {InputFieldComponent} from '@/shared/components/input/input-field.component';
import {LabelComponent} from '@/shared/components/label/label.component';
import {SelectComponent} from "@/shared/components/select/select.component";
import {ButtonComponent} from "@/shared/components/button/button.component";
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import Swal from 'sweetalert2';
import { environment } from "@/environments/environment";

@Component({
    selector: 'app-new-users',
    imports: [InputFieldComponent, LabelComponent, SelectComponent, ButtonComponent, FormsModule],
    templateUrl: './new-users.component.html',
    styleUrls: ['./new-users.component.css'],
})
export class NewUsersComponent {

    private http = inject(HttpClient);
    private api = environment.apiUrl;

    username = '';
    password = '';
    confirmPassword = '';
    role = '6';

    options = [
        {value: '0', label: 'Super Admin'},
        {value: '1', label: 'Admin'},
        {value: '2', label: 'Student'},
        {value: '3', label: 'Teacher'},
        {value: '4', label: 'Accountant'},
        {value: '5', label: 'Librarian'},
        {value: '6', label: 'User'},
    ];

    usernameError = true;
    passwordError = true;
    confirmPasswordError = true;

    get hasPasswordMismatch(): boolean {
        if (!this.password || !this.confirmPassword) {
            return false;
        }

        return this.password !== this.confirmPassword;
    }

    get isSubmitDisabled(): boolean {
        return this.usernameError
            || this.passwordError
            || this.confirmPasswordError
            || this.hasPasswordMismatch
            || !this.username.trim()
            || !this.password.trim()
            || !this.confirmPassword.trim();
    }

    handleUsernameChange(value: string | number): void {
        this.username = value.toString();
    }

    handlePasswordChange(value: string | number): void {
        this.password = value.toString();
    }

    handleConfirmPasswordChange(value: string | number): void {
        this.confirmPassword = value.toString();
    }

    handleUsernameErrorChange(isError: boolean): void {
        this.usernameError = isError;
    }

    handlePasswordErrorChange(isError: boolean): void {
        this.passwordError = isError;
    }

    handleConfirmPasswordErrorChange(isError: boolean): void {
        this.confirmPasswordError = isError;
    }

    onSubmit() {
        this.http.post(`${this.api}/api/users/create`, {
            username: this.username,
            password: this.password,
            role: Number(this.role),
        }).subscribe({
            next: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'User created successfully!',
                });
            },
            error: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Something went wrong!',
                });
            }
        })
    }
}
