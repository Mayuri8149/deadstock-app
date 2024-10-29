import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PpBreadcrumbsModule } from 'pp-breadcrumbs';
import { MaterialModule } from '../material-module';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { AssetSummaryRoutingModule } from './asset-summary-routing.module';
import { AssetSummaryDetailComponent } from './asset-summary-detail.component';
import { ViewAssetTranscationComponent } from './view-transcation/view-asset-transcation.component';

@NgModule({
  declarations: [    
    AssetSummaryDetailComponent,
    ViewAssetTranscationComponent
  ],
  imports: [
    CommonModule,
    AssetSummaryRoutingModule,
    FontAwesomeModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
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
export class AssetSummaryModule { }
