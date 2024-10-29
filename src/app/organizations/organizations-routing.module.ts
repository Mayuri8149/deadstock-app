import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Entity } from '../modals/entity';
import { Role } from '../modals/role';
import { AuthGuard } from '../services/auth-guard';
import { OrganizationDetailsComponent } from './organization-details/organization-details.component';
import { OrganizationUpdateComponent } from './organization-details/organization-update/organization-update.component';
import { OrganizationUpdatesComponent } from './organizations-list/organization-updates/organization-updates.component';
import { OrganizationsListComponent } from './organizations-list/organizations-list.component';
import { TreeChartComponent } from './organizations-list/tree-chart/tree-chart.component';
import { OrganizationsModuleListComponent } from './organizations-module-list/organizations-module-list.component';
import { ViewAssetCategoriesComponent } from './organizations-module-list/view-asset-categories/view-asset-categories.component';
import { ViewTransactionTypeComponent } from './organizations-module-list/view-transaction-type/view-transaction-type.component';
import { AssetCategoryUpdateComponent } from './organizations-partner-list/asset-category-update/asset-category-update.component';
import { AssetCategoryComponent } from './organizations-partner-list/asset-category/asset-category.component';
import { PartnerListComponent } from './organizations-partner-list/organizations-partner-list.component';
import { ViewPartnerTransactionTypeComponent } from './organizations-partner-list/view-transaction-type/view-transaction-type.component';

const routes: Routes =  [
    {
        path: 'treeChart/:id',
        component: TreeChartComponent, 
        canActivate: [AuthGuard],
        data: {          
            roles: [
              Role.Admin,
              Role.SubAdmin              
            ],
            entity: [
              Entity.Organization
            ],
            breadcrumbs: 'Organizations Network'
        },
    },
    { 
        path: 'OrganizationsList', 
        canActivate: [AuthGuard],
        data: { 
                roles: [
                    Role.SysAdmin,
                    Role.SubAdmin
                ],
                entity: [
                  Entity.System
                   ],
              
              breadcrumbs: 'Organizations List'
        },
        children: [  
            {
              path:'',             
              component: OrganizationsListComponent, 
            },        
              {
                path: 'treeChart/:id',
                component: TreeChartComponent, 
                canActivate: [AuthGuard],
                data: {          
                    roles: [
                      Role.SysAdmin,
                      Role.SubAdmin             
                    ],
                    entity: [
                      Entity.System
                    ],
                    breadcrumbs: 'Organizations Network'
                },
            },
    { 
        path: 'organizationUpdates/:organizationId', 
        component: OrganizationUpdatesComponent,
        canActivate: [AuthGuard],
        data: { 
            roles: [
                Role.SysAdmin,
                Role.SubAdmin
            ],
            entity: [
                Entity.System
            ],
                breadcrumbs: 'Fabric Configuration'
        }
    },
    { 
        path: 'organizationUpdates/:organizationId/:isBlockchainService', 
        component: OrganizationUpdatesComponent,
        canActivate: [AuthGuard],
        data: { 
            roles: [
                Role.SysAdmin,
                Role.SubAdmin
            ],
            entity: [
                Entity.System
            ],
                breadcrumbs: 'Fabric Configuration'
        }
    },
    { 
        path: 'organizationDetails',
        canActivate: [AuthGuard],
        data: { 
                roles: [
                          Role.Admin,
                          Role.SysAdmin,
                          Role.SubAdmin  
                      ],
                      entity: [
                          Entity.Organization,
                          Entity.System  
                ],
                breadcrumbs: 'Organization Details'
            }
        },
          ]
    },
    { 
    path: 'organizationModuleList', 
    canActivate: [AuthGuard],
    data: { 
        roles: [
            Role.SysAdmin,
            Role.SubAdmin
        ],
        entity: [
            Entity.System,
            Entity.Organization
        ],
            breadcrumbs: 'Organization Module List'
    },
        children: [
            {
              path:'',             
              component: OrganizationsModuleListComponent, 
            },
            { 
                path: 'viewTransactionType/:referenceId/:organizationId', 
                component: ViewTransactionTypeComponent,
                canActivate: [AuthGuard],
                data: { 
                    roles: [
                        Role.SysAdmin,
                        Role.Admin,
                        Role.SubAdmin
                    ],
                    entity: [
                        Entity.System,
                        Entity.Organization
                    ],
                        breadcrumbs: 'View Transaction Type'
                }
            },
            {
                path: 'viewAssetCategories/:transactionId/:organizationId', 
                component: ViewAssetCategoriesComponent,
                canActivate: [AuthGuard],
                data: { 
                    roles: [
                        Role.SysAdmin,
                        Role.Admin,
                        Role.SubAdmin
                    ],
                    entity: [
                        Entity.System,
                        Entity.Organization
                    ],
                        breadcrumbs: 'View Asset Categories'
                }
            },
        ]
        
    },
    { 
        path: 'partnerList', 
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
                Entity.Corporate
            ],
                breadcrumbs: 'Partner Module List'
        },

        children: [
            {
              path:'',             
              component: PartnerListComponent, 
            },
            { 
                path: 'viewPartnerTransactionType/:transtypeId', 
                component: ViewPartnerTransactionTypeComponent,
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
                        Entity.Corporate
                    ],
                        breadcrumbs: 'View Transaction Type'
                }
            },
              { 
                path: 'addAssetCategory', 
                component: AssetCategoryComponent, 
                canActivate: [AuthGuard],
                data: { 
                  roles: [
                      Role.SubAdmin,
                      Role.Admin
                  ],
                  entity: [
                      Entity.Organization
                  ],
                        breadcrumbs: 'Add Asset Category'
                }
              },
            { 
                path: 'editAssetCategory/:id', 
                component: AssetCategoryUpdateComponent, 
                canActivate: [AuthGuard],
                data: { 
                  roles: [
                      Role.SubAdmin,
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
  { 
      path: 'organizationDetails',
      canActivate: [AuthGuard],
      data: { 
        roles: [
            Role.Admin,
            Role.SysAdmin,
            Role.SubAdmin  
        ],
        entity: [
            Entity.Organization,
            Entity.System  
        ],
              breadcrumbs: 'Organization Details'
      },
      children: [
          {
            path:'',             
            component: OrganizationDetailsComponent, 
          },
        { 
            path: 'organizationUpdate/:instId', 
            component: OrganizationUpdateComponent,
            canActivate: [AuthGuard],
            data: { 
                roles: [
                    Role.Admin,
                    Role.CorporateAdmin,
                ],
                entity: [
                    Entity.Organization,
                    Entity.Corporate,
                ],
                    breadcrumbs: 'Organization Update'
            }
        },
      ]
  }
];

@NgModule({
  imports: [
      RouterModule.forChild(routes)
      ],
    exports: [RouterModule]
})

export class OrganizationsRoutingModule { }