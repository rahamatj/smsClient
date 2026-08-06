import {Component, inject} from '@angular/core';
import {InputFieldComponent} from '@/shared/components/input/input-field.component';
import {LabelComponent} from '@/shared/components/label/label.component';
import {SelectComponent} from "@/shared/components/select/select.component";
import {ButtonComponent} from "@/shared/components/button/button.component";
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

interface Admin {
    username: string;
    role: string;
}

@Component({
    selector: 'app-edit-users',
    imports: [InputFieldComponent, LabelComponent, SelectComponent, ButtonComponent, FormsModule],
    templateUrl: './edit-admins.component.html',
    styleUrl: './edit-admins.component.css',
})
export class EditAdminsComponent {

    private http = inject(HttpClient);
    private api = 'http://localhost:5270';
    private route: ActivatedRoute = inject(ActivatedRoute);

    admin: Admin = { username: '', role: '' };
    username = '';
    password = '';
    confirmPassword = '';
    role = '1';
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

    handleUsernameErrorChange(isError: boolean): void {
        this.usernameError = isError;
    }

    handleRoleChange(value: string | number): void {
        this.role = value.toString();
    }

    onSubmit() {
        this.http.put(`${this.api}/api/users/admins/update`, {
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
                const admin: Admin = {
                    username: data.username,
                    role: data.role,
                };

                console.log("Admin", admin);
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
