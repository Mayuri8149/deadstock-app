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
import { AssetCategoryRoutingModule } from './asset-category-routing.module';
import { AssetCategoryComponent } from './asset-category.component';
import { ViewAssetCategoryComponent } from './view-asset-category/view-asset-category.component';
import { AssetCategoryUpdateComponent } from './asset-category-update/asset-category-update.component';

@NgModule({
  declarations: [    
    AssetCategoryComponent,    
    ViewAssetCategoryComponent,
    AssetCategoryUpdateComponent,
  ],
  imports: [
    CommonModule,
    AssetCategoryRoutingModule,
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
export class AssetCategoryModule { }
