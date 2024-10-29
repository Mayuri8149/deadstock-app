import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PpBreadcrumbsModule } from 'pp-breadcrumbs';
import { MaterialModule } from '../material-module';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { ListTransactionTypeComponent } from '../transaction-type/list-transaction-type/list-transaction-type.component';
import { AddTransactionTypeComponent } from './add-transaction-type/add-transaction-type.component';
import { AssetCategoryComponent } from './asset-category/asset-category.component';
import { LinkTransactionTypeComponent } from './link-transaction-type/link-transaction-type.component';
import { ListLinkTransactionTypeComponent } from './list-link-transaction-type/list-link-transaction-type.component';
import { ViewfieldsComponent } from './list-transaction-type/viewfields/viewfields.component';
import { TransactionTypeRoutingModule } from './transaction-type-routing.module';

@NgModule({
  declarations: [    
    AddTransactionTypeComponent,
    ListTransactionTypeComponent,
    ViewfieldsComponent,
    LinkTransactionTypeComponent,
    ListLinkTransactionTypeComponent,
    AssetCategoryComponent
  ],
  imports: [
    CommonModule,
    TransactionTypeRoutingModule,
    FontAwesomeModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    PpBreadcrumbsModule,
    
  ],
  providers: [
    AuthService,
    ApiService,
    SnackbarService,
  ]
})
export class TransactionTypeModule { }
