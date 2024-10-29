import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Entity } from '../modals/entity';
import { Role } from '../modals/role';
import { AuthGuard } from '../services/auth-guard';
import { AssetSummaryDetailComponent } from './asset-summary-detail.component';
import { ViewAssetTranscationComponent } from './view-transcation/view-asset-transcation.component';

const routes: Routes = [ 
    {
        path: '',
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Admin,
                Role.Manager,
                Role.CorporateAdmin
            ],
            entity: [
                Entity.Organization,
                Entity.Corporate
            ],
            breadcrumbs: 'Asset Summary'
        },
        children: [
            {
              path:'',             
              component: AssetSummaryDetailComponent, 
            },
          { 
            path: 'ViewAssetTranscation/:transactionid/:transactionEntity/:provenance/:eprAssetSummary', 
            component: ViewAssetTranscationComponent,
            canActivate: [AuthGuard],
            data: { 
                roles: [
                    Role.Admin,
                    Role.Manager,
                    Role.CorporateAdmin
                ],
                entity: [
                    Entity.Organization,
                    Entity.Corporate
                ],
                    breadcrumbs: 'Asset Summary details'
            }
        },
        ]        
    },

    {
        path: 'assetSummaryDetail',
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Admin,
                Role.Manager,
                Role.CorporateAdmin
            ],
            entity: [
                Entity.Organization,
                Entity.Corporate
            ],
            breadcrumbs: 'Asset Summary'
        },
        children: [
            {
              path:'',             
              component: AssetSummaryDetailComponent, 
            },
          { 
            path: 'ViewAssetTranscation/:transactionid/:transactionEntity/:provenance/:eprAssetSummary', 
            component: ViewAssetTranscationComponent,
            canActivate: [AuthGuard],
            data: { 
                roles: [
                    Role.Admin,
                    Role.Manager,
                    Role.CorporateAdmin
                ],
                entity: [
                    Entity.Organization,
                    Entity.Corporate
                ],
                    breadcrumbs: 'Asset Summary details'
            }
        },
        ]        
    },
    
    {
        path: 'eprAssetSummaryDetail',
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Admin,
                Role.Manager,
                Role.CorporateAdmin
            ],
            entity: [
                Entity.Organization,
                Entity.Corporate
            ],
            breadcrumbs: 'EPR Asset Summary'
        },
        children: [
            {
              path:'',             
              component: AssetSummaryDetailComponent, 
            },
          { 
            path: 'eprViewAssetTranscation/:transactionid/:transactionEntity/:provenance/:eprAssetSummary', 
            component: ViewAssetTranscationComponent,
            canActivate: [AuthGuard],
            data: { 
                roles: [
                    Role.Admin,
                    Role.Manager,
                    Role.CorporateAdmin
                ],
                entity: [
                    Entity.Organization,
                    Entity.Corporate
                ],
                    breadcrumbs: 'EPR Asset Summary details'
            }
        },
        ]        
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetSummaryRoutingModule { }
