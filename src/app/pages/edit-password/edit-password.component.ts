import {Component, inject} from '@angular/core';
import {InputFieldComponent} from '@/shared/components/input/input-field.component';
import {LabelComponent} from '@/shared/components/label/label.component';
import {ButtonComponent} from "@/shared/components/button/button.component";
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-edit-password',
    imports: [InputFieldComponent, LabelComponent, ButtonComponent, FormsModule],
    templateUrl: './edit-password.component.html',
    styleUrl: './edit-password.component.css',
})
export class EditPasswordComponent {

    private http = inject(HttpClient);
    private api = 'http://localhost:5270';
    private route: ActivatedRoute = inject(ActivatedRoute);

    username = '';
    password = '';
    confirmPassword = '';
    role = '6';
    id = '';

    options = [
        {value: '0', label: 'Super Admin'},
        {value: '1', label: 'Admin'},
        {value: '2', label: 'Student'},
        {value: '3', label: 'Teacher'},
        {value: '4', label: 'Accountant'},
        {value: '5', label: 'Librarian'},
        {value: '6', label: 'User'},
    ];

    passwordError = true;
    confirmPasswordError = true;

    get isSubmitDisabled(): boolean {
        return this.passwordError || this.confirmPasswordError;
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

    handlePasswordErrorChange(isError: boolean): void {
        this.passwordError = isError;
    }

    handleConfirmPasswordErrorChange(isError: boolean): void {
        this.confirmPasswordError = isError;
    }

    onSubmit() {
        this.http.patch(`${this.api}/api/users/update-password`, {
            id: this.id,
            password: this.password,
        }).subscribe({
            next: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'User updated successfully!',
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
