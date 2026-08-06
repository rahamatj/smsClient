import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {ButtonComponent} from '@/shared/components/ui/button/button.component';
import {TableDropdownComponent} from '@/shared/components/common/table-dropdown/table-dropdown.component';
import {HttpClient} from '@angular/common/http';
import { UserRole } from '@/shared/enums/role';
import {RouterLink} from "@angular/router";
import Swal from 'sweetalert2';

interface AdminUser {
    id?: string;
    username: string;
    role: number;
}

@Component({
    selector: 'app-admins-table',
    imports: [
        CommonModule,
        ButtonComponent,
        TableDropdownComponent,
        RouterLink,
    ],
    templateUrl: './admins-table.component.html',
    styles: ``,
})
export class AdminsTableComponent {

    http : HttpClient = inject(HttpClient);
    api : string = 'http://localhost:5270';

    search = '';

    admins : any[] = [];
    filteredAdmins: any[] = [];

    currentPage = 1;
    itemsPerPage = 5;

    admin : any = {};
    id : string = '';


    editAdmin(id: string) {
        this.http.get(`${this.api}/api/admins/edit/${id}`).subscribe({
            next: (data: any) => {
                this.admin = data;
            },
            error: err => {
                console.error(err);
            }
        });
    }

    deleteAdmin(id: string) {
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
                this.http.delete(`${this.api}/api/admins/delete/${id}`).subscribe({
                    next: () => {
                        // this.admins = [...this.admins.filter(admins => admins.id !== id)];

                        Swal.fire(
                            'Deleted!',
                            'User deleted successfully.',
                            'success'
                        );

                        this.getAllAdmins();

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

    getAllAdmins() {
        this.http.get(`${this.api}/api/admins`).subscribe({
            next: (data: any) => {
                this.admins = Array.isArray(data) ? data : [];
                this.applyFilters();
            },
            error: err => {
                console.error(err);
            }
        });
    }

    ngOnInit() {
        this.getAllAdmins();
    }

    get totalPages(): number {
        const pages = Math.ceil(this.filteredAdmins.length / this.itemsPerPage);
        return pages || 1;
    }

    get currentItems() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredAdmins.slice(start, start + this.itemsPerPage);
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
            this.filteredAdmins = [...this.admins];
        } else {
            this.filteredAdmins = this.admins.filter((admin) => {
                const username = admin.username?.toLowerCase() ?? '';
                const roleName = UserRole[admin.role]?.toLowerCase() ?? '';
                return username.includes(this.search) || roleName.includes(this.search);
            });
        }

        this.currentPage = 1;
    }

    protected readonly UserRole = UserRole;
}