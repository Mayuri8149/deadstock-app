import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PpBreadcrumbsModule } from 'pp-breadcrumbs';
import { MaterialModule } from '../material-module';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { PartnerDashboardComponent } from './partner-dashboard/partner-dashboard.component';
import { PartnerDetailsComponent } from './partner-details/partner-details.component';
import { PartnerUpdateComponent } from './partner-details/partner-update/partner-update.component';
import { PartnerListComponent } from './partner-list/partner-list.component';
import { PartnerRoutingModule } from './partner-routing.module';

@NgModule({
  declarations: [
    PartnerDashboardComponent,
    PartnerDetailsComponent,
    PartnerUpdateComponent,
    PartnerListComponent,
  ],
  imports: [
    
    CommonModule,
    PartnerRoutingModule,
    FontAwesomeModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    PpBreadcrumbsModule,
    Ng2SearchPipeModule,
    ModalModule.forRoot(),
  ],  
  providers: [
    AuthService,
    ApiService,
    SnackbarService
  ]
})
export class PartnerModule { }
