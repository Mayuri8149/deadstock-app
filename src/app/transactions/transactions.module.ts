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
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionViewComponent } from './transactions-final/transaction-view/transaction-view.component';
import { TransactionsFinalComponent } from './transactions-final/transactions-final.component';
import { PartnersOrderComponent } from '../partners/partners-order/partners-order.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    TransactionViewComponent,
    TransactionsFinalComponent,
    PartnersOrderComponent
  ],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
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
export class TransactionsModule { }
