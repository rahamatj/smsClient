import { Component } from '@angular/core';
import {ComponentCardComponent} from "@/shared/components/component-card/component-card.component";
import { StudentsTableComponent } from "@/pages/users/students/all-students/students-table/students-table.component";

@Component({
    selector: 'app-all-students',
    imports: [
        ComponentCardComponent,
        StudentsTableComponent
    ],
    templateUrl: './all-students.component.html',
    styleUrls: ['./all-students.component.css'],
})
export class AllStudentsComponent {

}
