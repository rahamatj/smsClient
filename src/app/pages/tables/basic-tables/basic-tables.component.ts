import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { BasicTableThreeComponent } from '../../../shared/components/basic-table/basic-table-three.component';

@Component({
  selector: 'app-basic-tables',
  imports: [
    ComponentCardComponent,
    PageBreadcrumbComponent,
    BasicTableThreeComponent,
  ],
  templateUrl: './basic-tables.component.html',
  styles: ``
})
export class BasicTablesComponent {

}
