import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Entity } from '../modals/entity';
import { Role } from '../modals/role';
import { AuthGuard } from '../services/auth-guard';
import { AssetCategoryComponent } from './asset-category.component';
import { ViewAssetCategoryComponent } from './view-asset-category/view-asset-category.component';
import { AssetCategoryUpdateComponent } from './asset-category-update/asset-category-update.component';

const routes: Routes = [ 
    {
        path: '',
        component: AssetCategoryComponent,
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Admin
            ],
            entity: [
                Entity.Organization
            ],
            breadcrumbs: 'Asset Category'
        }
    },
    {
        path: 'addAssetCategory',
        component: AssetCategoryComponent,
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Admin
            ],
            entity: [
                Entity.Organization
            ],
            breadcrumbs: 'Asset Category'
        }
    },
    
    {
        path: 'viewAssetCategory',
        canActivate: [AuthGuard],
        data: { 
            roles: [
                Role.Admin
            ],
            entity: [
                Entity.Organization
            ],
                breadcrumbs: 'View AssetCategory List'
        },
        children: [
            {
              path:'',             
              component: ViewAssetCategoryComponent,
            },
            {
                path: 'editAssetCategory/:id', 
                component: AssetCategoryUpdateComponent, 
                canActivate: [AuthGuard],
                data: { 
                  roles: [
                      Role.Admin
                  ],
                  entity: [
                      Entity.Organization
                  ],
                        breadcrumbs: 'Update Asset Category'
                }
              }
            
        ]
    }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetCategoryRoutingModule { }
