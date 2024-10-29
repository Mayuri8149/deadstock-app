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
import { AssetAddComponent } from './asset-add.component';
import { AssetNameRoutingModule } from './asset-name-routing.module';
import { ViewAssetComponent } from './view-asset/view-asset.component';
import { AssetUpdateComponent } from './view-asset/asset-update/asset-update.component';

@NgModule({
  declarations: [
    AssetAddComponent,
    ViewAssetComponent,
    AssetUpdateComponent,
  ],
  imports: [
    CommonModule,
    AssetNameRoutingModule,
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
export class AssetNameModule { }
