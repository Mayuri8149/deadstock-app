import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Entity } from '../modals/entity';
import { Role } from '../modals/role';
import { AuthGuard } from '../services/auth-guard';
import { AddTransactionTypeComponent } from '../transaction-type/add-transaction-type/add-transaction-type.component';
import { ListTransactionTypeComponent } from '../transaction-type/list-transaction-type/list-transaction-type.component';
import { AssetCategoryComponent } from './asset-category/asset-category.component';
import { LinkTransactionTypeComponent } from './link-transaction-type/link-transaction-type.component';
import { ListLinkTransactionTypeComponent } from './list-link-transaction-type/list-link-transaction-type.component';
import { ViewfieldsComponent } from './list-transaction-type/viewfields/viewfields.component';

const routes: Routes = [
  { 
      path: 'listTransactionType', 
      canActivate: [AuthGuard],
      data: { 
        roles: [
            Role.SysAdmin,
            Role.SubAdmin
        ],
        entity: [
            Entity.Organization,
            Entity.System
        ],         
            breadcrumbs: 'Transaction Type List'
      },
      children:[
        {
          path:'',
          component: ListTransactionTypeComponent, 
        },
        { 
          path: 'addTransactionType', 
          component: AddTransactionTypeComponent, 
          canActivate: [AuthGuard],
          data: { 
            roles: [
                Role.SysAdmin,
                Role.SubAdmin
            ],
            entity: [
                Entity.Organization,
                Entity.System
            ],
                  breadcrumbs: 'Add Transaction Type'
          }
        },
        { 
            path: 'addTransactionType/:id', 
            component: AddTransactionTypeComponent, 
            canActivate: [AuthGuard],
            data: { 
              roles: [
                  Role.CorporateAdmin,
                  Role.SysAdmin,
                  Role.SubAdmin
              ],
              entity: [
                  Entity.Corporate,
                  Entity.Organization,
                  Entity.System
                ],
                    breadcrumbs: 'Edit Transaction Type'
            }
          },
        { 
          path: ':transtypeId/viewFields', 
          component: ViewfieldsComponent, 
          canActivate: [AuthGuard],
          data: { 
            roles: [
                Role.CorporateAdmin,
                Role.Admin,
                Role.Manager,
                Role.SysAdmin,
                Role.SubAdmin
            ],
            entity: [
                Entity.Corporate,
                Entity.Organization,
                Entity.System
            ],
                  breadcrumbs: 'View Fields'
          }
        }      
      ]
      
  },
  
  { 
    path: 'linkTransactionType', 
    canActivate: [AuthGuard],
    data: { 
      roles: [
           Role.Admin,
           Role.SysAdmin,
           Role.CorporateAdmin,
           Role.SubAdmin
      ],
      entity: [
          Entity.Organization,
          Entity.System,
          Entity.Corporate,
      ],
            breadcrumbs: 'Organization Access' 
    },
    children:[
        {
          path:'',
          component: LinkTransactionTypeComponent,
        },
        { 
            path: 'listlinkTransactionType/:referenceId/view', 
            canActivate: [AuthGuard],
            data: { 
              roles: [
                  Role.SysAdmin,
                  Role.Admin,
                  Role.CorporateAdmin,
                  Role.SubAdmin
              ],
              entity: [
                  Entity.System,
                  Entity.Organization,
                  Entity.Corporate,
                 ],
                    breadcrumbs: 'Link Transcation Types List' 
            },
            children:[
                {
                  path:'',
                  component: ListLinkTransactionTypeComponent,
                },
                { 
                  path: 'addAssetCategory/:organizationId', 
                  component: AssetCategoryComponent, 
                  canActivate: [AuthGuard],
                  data: { 
                    roles: [
                        Role.SysAdmin,
                        Role.SubAdmin,
                        Role.Admin,
                        Role.CorporateAdmin,
                    ],
                    entity: [
                        Entity.System,
                        Entity.Organization,
                        Entity.Corporate
                    ],
                          breadcrumbs: 'Add Asset Category'
                  }
                }      
              ]
        },
    ]
},

  { 
    path: ':moduleId/:transtypeId/viewFields', 
    component: ViewfieldsComponent, 
    canActivate: [AuthGuard],
    data: { 
        roles: [
            Role.CorporateAdmin,
            Role.Admin,
            Role.Manager,         
        ],
        entity: [
            Entity.Corporate,
            Entity.Organization
        ],
    }
},
{ 
    path: 'transactionTypeName/viewFields', 
    component: ViewfieldsComponent, 
    canActivate: [AuthGuard],
    data: { 
        roles: [
            Role.CorporateAdmin,
            Role.Admin,
            Role.Manager,
        ],
        entity: [
            Entity.Corporate,
            Entity.Organization
        ],
    }
},
{ 
    path: 'viewFields', 
    component: ViewfieldsComponent, 
    canActivate: [AuthGuard],
    data: { 
        roles: [
            Role.CorporateAdmin,
            Role.Admin,
            Role.Manager,
        ],
        entity: [
            Entity.Corporate,
            Entity.Organization
        ],
    }
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionTypeRoutingModule { }