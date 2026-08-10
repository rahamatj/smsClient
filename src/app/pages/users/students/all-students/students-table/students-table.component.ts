import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {ButtonComponent} from '@/shared/components/ui/button/button.component';
import {TableDropdownComponent} from '@/shared/components/common/table-dropdown/table-dropdown.component';
import {HttpClient} from '@angular/common/http';
import { UserRole } from '@/shared/enums/role';
import {RouterLink} from "@angular/router";
import Swal from 'sweetalert2';
import { environment } from "@/environments/environment";

interface StudentUser {
    id?: string;
    username: string;
    role: number;
}

@Component({
    selector: 'app-students-table',
    imports: [
        CommonModule,
        ButtonComponent,
        TableDropdownComponent,
        RouterLink,
    ],
    templateUrl: './students-table.component.html',
    styles: ``,
})
export class StudentsTableComponent {

    http : HttpClient = inject(HttpClient);
    api : string = environment.apiUrl;

    search = '';

    students : any[] = [];
    filteredStudents: any[] = [];

    currentPage = 1;
    itemsPerPage = 5;

    student : any = {};
    id : string = '';


    editStudent(id: string) {
        this.http.get(`${this.api}/api/students/edit/${id}`).subscribe({
            next: (data: any) => {
                this.students = data;
            },
            error: err => {
                console.error(err);
            }
        });
    }

    deleteStudent(id: string) {
        Swal.fire({
            title: 'Delete User?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                this.http.delete(`${this.api}/api/students/delete/${id}`).subscribe({
                    next: () => {
                        // this.students = [...this.students.filter(student => student.id !== id)];

                        Swal.fire(
                            'Deleted!',
                            'User deleted successfully.',
                            'success'
                        );

                        this.getAllStudents();

                    },
                    error: () => {
                        Swal.fire(
                            'Error',
                            'Failed to delete the user.',
                            'error'
                        );
                    }
                });
            }
        });
    }

    handleSearch(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.search = value.trim().toLowerCase();
        this.applyFilters();
    }

    getAllStudents() {
        this.http.get(`${this.api}/api/students`).subscribe({
            next: (data: any) => {

                this.students = Array.isArray(data) ? data : [];
                this.applyFilters();
            },
            error: err => {
                console.error(err);
            }
        });
    }

    ngOnInit() {
        this.getAllStudents();
    }

    get totalPages(): number {
        const pages = Math.ceil(this.filteredStudents.length / this.itemsPerPage);
        return pages || 1;
    }

    get currentItems() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredStudents.slice(start, start + this.itemsPerPage);
    }

    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }

    handleDelete(id : string) {

    }

    private applyFilters(): void {
        if (!this.search) {
            this.filteredStudents = [...this.students];
        } else {
            this.filteredStudents = this.students.filter((student) => {
                const username = student.username?.toLowerCase() ?? '';
                const roleName = UserRole[student.role]?.toLowerCase() ?? '';
                return username.includes(this.search) || roleName.includes(this.search);
            });
        }

        this.currentPage = 1;
    }

    protected readonly UserRole = UserRole;
}