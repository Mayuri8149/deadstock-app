import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PpBreadcrumbsModule } from 'pp-breadcrumbs';
import { MaterialModule } from '../material-module';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { InvitePartnersRoutingModule } from './invitepartners-routing.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { InvitepartnersComponent } from './invitepartners.component';
import { PartnerUpdateComponent } from '../partners/partner-list/partner-update/partner-update.component';
import { partnerListComponent } from './partnerList/partnerList.component';
import { SendInvitationComponent } from './send-invitation/send-invitation.component';
import { PartnerSuperUsersComponent } from './partner-super-users/partner-super-users.component';


@NgModule({
  declarations: [  
    InvitepartnersComponent,  
    PartnerUpdateComponent,
    partnerListComponent,
    SendInvitationComponent,
    PartnerSuperUsersComponent
  ],
  imports: [
    CommonModule,
    InvitePartnersRoutingModule,
    FontAwesomeModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    PpBreadcrumbsModule,
    
    Ng2SearchPipeModule,    
    ModalModule.forRoot(),
  ],
  exports: [
    MatProgressBarModule,
  ],
  schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
      NO_ERRORS_SCHEMA
  ],
  providers: [
    AuthService,
    ApiService,
    SnackbarService,
  ]
})
export class InvitePartnersModule { }
