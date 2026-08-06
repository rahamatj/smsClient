import { Component } from '@angular/core';
import {ComponentCardComponent} from "@/shared/components/component-card/component-card.component";
import { TeachersTableComponent } from "@/pages/users/teachers/all-teachers/teachers-table/teachers-table.component";

@Component({
    selector: 'app-all-teachers',
    imports: [
        ComponentCardComponent,
        TeachersTableComponent
    ],
    templateUrl: './all-teachers.component.html',
    styleUrls: ['./all-teachers.component.css'],
})
export class AllTeachersComponent {

}
