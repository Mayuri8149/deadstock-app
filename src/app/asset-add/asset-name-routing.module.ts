import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Entity } from '../modals/entity';
import { Role } from '../modals/role';
import { AuthGuard } from '../services/auth-guard';
import { AssetAddComponent } from './asset-add.component';
import { AssetUpdateComponent } from './view-asset/asset-update/asset-update.component';
import { ViewAssetComponent } from './view-asset/view-asset.component';

const routes: Routes = [
    {
      path: '',
      component: AssetAddComponent,
      canActivate: [AuthGuard],
      data: { 
          roles: [
              Role.Admin
          ],
          entity: [
              Entity.Organization
          ],
              breadcrumbs: 'Add Asset'
      },
  }, 
  {
    path: 'addAsset',
    component: AssetAddComponent,
    canActivate: [AuthGuard],
    data: { 
        roles: [
            Role.Admin
        ],
        entity: [
            Entity.Organization
        ],
            breadcrumbs: 'Add Asset'
    },
}, 
{
  path: 'viewAsset',
  canActivate: [AuthGuard],
  data: { 
      roles: [
          Role.Admin
      ],
      entity: [
          Entity.Organization
      ],
          breadcrumbs: 'View Asset'
  },
  children: [
      {
        path:'',             
        component: ViewAssetComponent,
      },
      { 
          path: 'editAsset/:id/:assetListId', 
          component: AssetUpdateComponent, 
          canActivate: [AuthGuard],
          data: { 
            roles: [
                Role.Admin
            ],
            entity: [
                Entity.Organization
            ],
                  breadcrumbs: 'Update Asset'
          }
      }    
  ]
},   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetNameRoutingModule { }
