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
import { CategorylayoutRoutingModule } from './categorylayout-routing.module';
import { CategoryAddComponent } from './category-add/category-add.component';
import { SubCategoryAddComponent } from './category-add/sub-category-add/sub-category-add.component';
import { SubSubCategoryAddComponent } from './category-add/sub-category-add/sub-sub-category-add/sub-sub-category-add.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@NgModule({
  declarations: [    
    CategoryAddComponent,
    SubSubCategoryAddComponent,
    SubCategoryAddComponent,
  ],
  imports: [
    CommonModule,
    CategorylayoutRoutingModule,
    FontAwesomeModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    PpBreadcrumbsModule,
    
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
export class CategoryLayoutModule { }
