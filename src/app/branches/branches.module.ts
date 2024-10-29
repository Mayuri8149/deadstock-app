import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PpBreadcrumbsModule } from 'pp-breadcrumbs';
import { ListOfBranchesComponent } from './list-of-branches/list-of-branches.component';
import { MaterialModule } from '../material-module';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { BranchAddComponent } from './list-of-branches/branch-add/branch-add.component';
import { BranchesRoutingModule } from './branches-routing.module';

@NgModule({
  declarations: [
    ListOfBranchesComponent,
    BranchAddComponent
  ],
  imports: [
    CommonModule,
    BranchesRoutingModule,    
    FontAwesomeModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    PpBreadcrumbsModule,
    Ng2SearchPipeModule
  ],
  providers: [
    AuthService,
    ApiService,
    SnackbarService,
    DatePipe
  ]
})
export class BranchesModule { }
