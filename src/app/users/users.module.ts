import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxMatIntlTelInputModule } from 'ngx-mat-intl-tel-input';
import { PpBreadcrumbsModule } from 'pp-breadcrumbs';
import { MaterialModule } from '../material-module';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { UserProfileComponent } from '../users/user-profile/user-profile.component';
import { UserAddComponent } from '../users/users-list/user-add/user-add.component';
import { UserEditComponent } from '../users/users-list/user-edit/user-edit.component';
import { UsersListComponent } from '../users/users-list/users-list.component';
import { AddAgencyUserComponent } from './users-list/add-agency-user/add-agency-user.component';
import { AddPartnerUserComponent } from './users-list/add-partner-user/add-partner-user.component';
import { UserAccessComponent } from './users-list/user-access/user-access.component';
import { UsersDetailComponent } from './users-list/users-detail/users-detail.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [
    UsersListComponent,
    UserAddComponent,
    UserEditComponent,
    UserProfileComponent,    
    AddPartnerUserComponent,
    AddAgencyUserComponent,
    UsersDetailComponent,
    UserAccessComponent
  ],
  imports: [
    
    CommonModule,
    UsersRoutingModule,
    FontAwesomeModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    PpBreadcrumbsModule,
    NgxMatIntlTelInputModule,
    ModalModule.forRoot(),
  ],
  providers: [
    AuthService,
    ApiService,
    SnackbarService
  ]
})
export class UsersModule { }