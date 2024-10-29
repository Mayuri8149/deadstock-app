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
import { AssetUomRoutingModule } from './asset-uom-routing.module';
import { AssetUomComponent } from './asset-uom.component';
import { UomUpdateComponent } from './uom-update/uom-update.component';
import { ViewAssetUomComponent } from './view-asset-uom/view-asset-uom.component';

@NgModule({
  declarations: [ 
    AssetUomComponent,
    ViewAssetUomComponent,
    UomUpdateComponent,   
  ],
  imports: [
    CommonModule,
    AssetUomRoutingModule,
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
export class AssetUomModule { }
