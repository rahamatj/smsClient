import {CommonModule} from '@angular/common';
import {Component, OnInit, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface User {
    id: string;
    username: string;
    role: string;
}

@Component({
    selector: 'app-basic-table',
    imports: [
        CommonModule,
    ],
    templateUrl: './basic-table.component.html',
    styles: ``
})
export class BasicTableComponent {
    private http = inject(HttpClient);
    private api = 'http://localhost:5270';

    transactionData: User[] = [];

    ngOnInit(): void {
        this.http.get<User[]>(`${this.api}/api/users/admins`).subscribe({
            next: (data) => {
                this.transactionData = [...data];
            },
            error: (err) => {
                console.error(err);
            }
        })
    }

    currentPage = 1;
    itemsPerPage = 5;

    get totalPages(): number {
        return Math.ceil(this.transactionData.length / this.itemsPerPage);
    }

    get currentItems(): User[] {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return this.transactionData.slice(start, start + this.itemsPerPage);
    }

    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }

    handleViewMore(item: User) {
        // logic here
        console.log('View More:', item);
    }

    handleDelete(item: User) {
        // logic here
        console.log('Delete:', item);
    }

    getBadgeColor(status: string): 'success' | 'warning' | 'error' {
        if (status === 'Success') return 'success';
        if (status === 'Pending') return 'warning';
        return 'error';
    }
}
