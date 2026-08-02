import {Component, inject} from '@angular/core';
import {InputFieldComponent} from '@/shared/components/input/input-field.component';
import {LabelComponent} from '@/shared/components/label/label.component';
import {SelectComponent} from "@/shared/components/select/select.component";
import {ButtonComponent} from "@/shared/components/button/button.component";
import {FormsModule} from "@angular/forms";
import {HttpClient, HttpParams} from "@angular/common/http";
import Swal from 'sweetalert2';

@Component({
    selector: 'app-new-users',
    imports: [InputFieldComponent, LabelComponent, SelectComponent, ButtonComponent, FormsModule],
    templateUrl: './new-users.component.html',
    styleUrl: './new-users.component.css',
})
export class NewUsersComponent {
    validators = [
        {
            type: 'required',
            message: 'Username is required.'
        },
        {
            type: 'minLength',
            value: 3,
            message: 'Username must be at least 3 characters.'
        }
    ];

    private http = inject(HttpClient);
    private api = 'http://localhost:5270';

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

    usernameError = false;
    passwordError = false;
    confirmPasswordError = false;
    roleError = false;
    usernameExistsError = false;

    // handleUsernameChange(value: string | number) {
    //     const params = new HttpParams()
    //         .set('username', value.toString());
    //
    //     this.http.get(`${this.api}/api/users/does-username-exist`, { params })
    //         .subscribe({
    //             next: (data: any) => {
    //                  this.username = value.toString();
    //                 this.usernameExistsError = data;
    //             },
    //             error: (err) => {
    //                 console.error(err);
    //             }
    //         })
    //
    //     this.usernameError = this.username.trim() === '';
    // }

    handlePasswordChange(value: string | number) {
        this.password = value.toString();
        this.passwordError = this.password.trim() === '';
    }

    handleConfirmPasswordChange(value: string | number) {
        this.confirmPassword = value.toString();
        this.confirmPasswordError = this.confirmPassword.trim() === '';
    }

    handleRoleChange(value: string | number) {
        this.role = value.toString();
        this.roleError = this.role.trim() === '';
    }

    onSubmit() {
        this.http.post(`${this.api}/api/users/new`, {
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
