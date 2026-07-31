import {Component, inject} from '@angular/core';
import {InputFieldComponent} from '@/shared/components/input/input-field.component';
import {LabelComponent} from '@/shared/components/label/label.component';
import {SelectComponent} from "@/shared/components/select/select.component";
import {ButtonComponent} from "@/shared/components/button/button.component";
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import Swal from 'sweetalert2';

@Component({
    selector: 'app-new-users',
    imports: [InputFieldComponent, LabelComponent, SelectComponent, ButtonComponent, FormsModule],
    templateUrl: './new-users.component.html',
    styleUrl: './new-users.component.css',
})
export class NewUsersComponent {
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

    handleUsernameChange(value: string | number) {
        console.log('handleUsernameChange', value);

        this.username = value.toString();
        this.usernameError = this.username.trim() === '';
    }

    handlePasswordChange(value: string | number) {
        console.log('handlePasswordChange', value);

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
        console.log('handleSubmit', this.role);

        this.http.post(`${this.api}/api/users/new`, {
            username: this.username,
            password: this.password,
            role: Number(this.role),
        }).subscribe({
            next: (data) => {
                // this.transactionData = [...data];
                // console.log("data", data);

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'User created successfully!',
                });
            },
            error: (err) => {
                // console.error(err);

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Something went wrong!',
                });
            }
        })

        // console.log('handleSubmit', this.role);
    }
}
