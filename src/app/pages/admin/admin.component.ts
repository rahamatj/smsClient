import { Component } from '@angular/core';
import { ComponentCardComponent } from '@/shared/components/component-card/component-card.component';
import { BasicTableComponent } from "@/shared/components/basic-table/basic-table.component";

@Component({
  selector: 'app-admin',
  imports: [ComponentCardComponent, BasicTableComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {

}
