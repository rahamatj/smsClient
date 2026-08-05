import { Component } from '@angular/core';
import {ComponentCardComponent} from "@/shared/components/component-card/component-card.component";
import { AdminsTableComponent } from "@/pages/users/admins/all-admins/admins-table/admins-table.component";

@Component({
  selector: 'app-all-admins',
    imports: [
        ComponentCardComponent,
        AdminsTableComponent
    ],
  templateUrl: './all-admins.component.html',
  styleUrls: ['./all-admins.component.css'],
})
export class AllAdminsComponent {

}
