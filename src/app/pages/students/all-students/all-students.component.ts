import { Component } from '@angular/core';
import { ComponentCardComponent } from '@/shared/components/component-card/component-card.component';
import { AdminsTableComponent } from "@/pages/admins/all-admins/admins-table/admins-table.component";

@Component({
    selector: 'app-all-students',
    imports: [ComponentCardComponent, AdminsTableComponent],
    templateUrl: './all-students.component.html',
    styleUrl: './all-students.component.css',
})
export class AllStudentsComponent {

}