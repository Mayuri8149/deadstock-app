import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Entity } from '../modals/entity';
import { Role } from '../modals/role';
import { AuthGuard } from '../services/auth-guard';
import { AssetUomComponent } from './asset-uom.component';
import { UomUpdateComponent } from './uom-update/uom-update.component';
import { ViewAssetUomComponent } from './view-asset-uom/view-asset-uom.component';

const routes: Routes = [ 
    {
        path: '',
        component: AssetUomComponent,
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Admin
            ],
            entity: [
                Entity.Organization
            ],
            breadcrumbs: 'Asset UOM'
        }
    },     
    {
        path: 'addAssetUOM',
        component: AssetUomComponent,
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Admin
            ],
            entity: [
                Entity.Organization
            ],
            breadcrumbs: 'Asset UOM'
        }
    },    
          
    {
        path: 'viewAssetUOM',
        canActivate: [AuthGuard],
        data: { 
            roles: [
                Role.Admin
            ],
            entity: [
                Entity.Organization
            ],
                breadcrumbs: 'View Asset UOM'
        },
        children: [
            {
              path:'',             
              component: ViewAssetUomComponent, 
            },
            { 
                path: 'editUOM/:id', 
                component: UomUpdateComponent, 
                canActivate: [AuthGuard],
                data: { 
                  roles: [
                      Role.Admin
                  ],
                  entity: [
                      Entity.Organization
                  ],
                        breadcrumbs: 'Update UOM'
                }
              }           
        ]
    }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetUomRoutingModule { }
