import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxMatIntlTelInputModule } from 'ngx-mat-intl-tel-input';
import { PpBreadcrumbsModule } from 'pp-breadcrumbs';
import { MaterialModule } from '../material-module';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { OrganizationDetailsComponent } from './organization-details/organization-details.component';
import { OrganizationUpdateComponent } from './organization-details/organization-update/organization-update.component';
import { OrganizationUpdatesComponent } from './organizations-list/organization-updates/organization-updates.component';
import { OrganizationsListComponent } from './organizations-list/organizations-list.component';
import { TreeChartComponent } from './organizations-list/tree-chart/tree-chart.component';
import { OrganizationsModuleListComponent } from './organizations-module-list/organizations-module-list.component';
import { ViewAssetCategoriesComponent } from './organizations-module-list/view-asset-categories/view-asset-categories.component';
import { ViewTransactionTypeComponent } from './organizations-module-list/view-transaction-type/view-transaction-type.component';
import { AssetCategoryUpdateComponent } from './organizations-partner-list/asset-category-update/asset-category-update.component';
import { AssetCategoryComponent } from './organizations-partner-list/asset-category/asset-category.component';
import { PartnerListComponent } from './organizations-partner-list/organizations-partner-list.component';
import { ViewPartnerTransactionTypeComponent } from './organizations-partner-list/view-transaction-type/view-transaction-type.component';
import { OrganizationsRoutingModule } from './organizations-routing.module';

export function chartModule(): any {
  return import('echarts');
}
@NgModule({
  imports: [
    
    Ng2SearchPipeModule,
    CommonModule,
    OrganizationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MaterialModule,
    PpBreadcrumbsModule,
    NgxMatIntlTelInputModule,
    ModalModule.forRoot(),
    NgxEchartsModule.forRoot({
      echarts: chartModule
    }),
   ],
    declarations: [
      OrganizationDetailsComponent,
      OrganizationUpdatesComponent,
      OrganizationsModuleListComponent,
      ViewTransactionTypeComponent,
      ViewAssetCategoriesComponent,
      OrganizationUpdateComponent,
      OrganizationsListComponent,
      PartnerListComponent,
      ViewPartnerTransactionTypeComponent,
      AssetCategoryComponent,
      AssetCategoryUpdateComponent,
      TreeChartComponent
                  ],
    providers: [
        AuthService,
        ApiService,
        SnackbarService,
      ]
})

export class OrganizationsModule { }
