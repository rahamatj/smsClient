import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {ButtonComponent} from '@/shared/components/ui/button/button.component';
import {TableDropdownComponent} from '@/shared/components/common/table-dropdown/table-dropdown.component';
import {HttpClient} from '@angular/common/http';
import { UserRole } from '@/shared/enums/role';

interface AdminUser {
    id?: number;
    userId?: number | string;
    username: string;
    role: number;
}

@Component({
    selector: 'app-basic-table',
    imports: [
        CommonModule,
        ButtonComponent,
        TableDropdownComponent,
    ],
    templateUrl: './basic-table.component.html',
    styles: ``,
})
export class BasicTableComponent {

    http : HttpClient = inject(HttpClient);
    api : string = 'http://localhost:5270';

    search = '';

    admins: AdminUser[] = [];
    filteredAdmins: AdminUser[] = [];

    currentPage = 1;
    itemsPerPage = 5;

    handleSearch(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.search = value.trim().toLowerCase();
        this.applyFilters();
    }

    ngOnInit() {
        this.http.get(`${this.api}/api/users/admins`).subscribe({
            next: (data: any) => {
                this.admins = Array.isArray(data) ? data : [];
                this.applyFilters();
            },
            error: err => {
                console.error(err);
            }
        })
    }

    get totalPages(): number {
        const pages = Math.ceil(this.filteredAdmins.length / this.itemsPerPage);
        return pages || 1;
    }

    get currentItems(): AdminUser[] {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredAdmins.slice(start, start + this.itemsPerPage);
    }

    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }

    handleViewMore(item: AdminUser) {
        // logic here
        console.log('View More:', item);
    }

    handleDelete(item: AdminUser) {
        // logic here
        console.log('Delete:', item);
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