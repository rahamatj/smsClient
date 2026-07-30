import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { AppSidebarComponent } from '@/shared/layout/app-sidebar/app-sidebar.component';
import { BackdropComponent } from '@/shared/layout/backdrop/backdrop.component';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from '@/shared/layout/app-header/app-header.component';

@Component({
    selector: 'app-layout',
    imports: [
        CommonModule,
        RouterModule,
        AppHeaderComponent,
        AppSidebarComponent,
        BackdropComponent
    ],
    templateUrl: './dashboard.component.html',
})

export class DashboardComponent {
    readonly isExpanded$;
    readonly isHovered$;
    readonly isMobileOpen$;

    constructor(public sidebarService: SidebarService) {
        this.isExpanded$ = this.sidebarService.isExpanded$;
        this.isHovered$ = this.sidebarService.isHovered$;
        this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
    }

    get containerClasses() {
        return [
            'flex-1',
            'transition-all',
            'duration-300',
            'ease-in-out',
            (this.isExpanded$ || this.isHovered$) ? 'xl:ml-[290px]' : 'xl:ml-[90px]',
            this.isMobileOpen$ ? 'ml-0' : ''
        ];
    }

}