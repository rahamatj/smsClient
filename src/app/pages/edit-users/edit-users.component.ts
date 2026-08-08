import {Component, inject} from '@angular/core';
import {InputFieldComponent} from '@/shared/components/input/input-field.component';
import {LabelComponent} from '@/shared/components/label/label.component';
import {SelectComponent} from "@/shared/components/select/select.component";
import {ButtonComponent} from "@/shared/components/button/button.component";
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { environment } from "@/environments/environment";

@Component({
    selector: 'app-edit-users',
    imports: [InputFieldComponent, LabelComponent, SelectComponent, ButtonComponent, FormsModule],
    templateUrl: './edit-users.component.html',
    styleUrl: './edit-users.component.css',
})
export class EditUsersComponent {

    private http = inject(HttpClient);
    private api = environment.apiUrl;
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
            || !this.username.trim()
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

    handleRoleChange(value: string | number): void {
        this.role = value.toString();
    }

    onSubmit() {
        this.http.put(`${this.api}/api/users/update`, {
            id: this.id,
            username: this.username,
            role: Number(this.role),
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

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id') ?? '';
        this.http.get(`${this.api}/api/admins/edit/${this.id}`).subscribe({
            next: (data: any) => {
                const user = Array.isArray(data) ? data[0] : (data?.user ?? data);

                this.username = this.toFieldValue(user?.username ?? user?.userName);
                this.role = this.toFieldValue(user?.role, '6');
            },
            error: err => {
                console.error(err);
            }
        })
    }

    private toFieldValue(value: unknown, fallback = ''): string {
        if (value === null || value === undefined) {
            return fallback;
        }

        return value.toString();
    }
}
