import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSerializer } from '@angular/router';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { AssetProvenanceSetupComponent } from './asset-provenance-setup/asset-provenance-setup.component';
import { AssetTracebilitySetupComponent } from './asset-tracebility-setup/asset-tracebility-setup.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { PartnerRegistrationComponent } from './partner-registration/partner-registration.component';
import { CustomUrlSerializer } from './CustomUrlSerializer';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { EprDashboardComponent } from './epr-dashboard/epr-dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomeComponent } from './home/home.component';
import { LoginHistoryComponent } from './login-history/login-history.component';
import { LoginComponent } from './login/login.component';
import { Entity } from './modals/entity';
import { Role } from './modals/role';
import { OrganizationRegistrationComponent } from './organization-registration/organization-registration.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PartnerEditComponent } from './partners/partner-edit/partner-edit.component';
import { ResendOtpComponent } from './resend-otp/resend-otp.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SearchCategoriesComponent } from './search-categories/search-categories.component';
import { AuthGuard } from './services/auth-guard';
import { TraceabilityBlockchainComponent } from './traceability-blockchain/traceability-blockchain.component';
import { TraceabilityComponent } from './traceability/traceability.component';
import { DynamicAddTransIntegratedComponent } from './trans-type-list/dynamic-add-trans-integrated/dynamic-add-trans-integrated.component';
import { PurchaseOrderModalComponent } from './trans-type-list/dynamic-add-trans-integrated/purchase-order-modal/purchase-order-modal.component';
import { TransactionPdfPublicViewComponent } from './transaction-pdf-public-view/transaction-pdf-public-view.component';
import { ViewNftComponent } from './view-nft/view-nft.component';

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'forgotPassword', component: ForgotPasswordComponent },
    { path: 'registration', component: OrganizationRegistrationComponent },
    { path: 'email-verification/:id', component: EmailVerificationComponent },
    { path: 'partnerRegistration', component: PartnerRegistrationComponent },
    { path: 'resetPassword/:id', component: ResetPasswordComponent },
    { path: 'resendOtp', component: ResendOtpComponent },
    { path: 'purchaseOrderModal', component: PurchaseOrderModalComponent},
    
    { 
        path: 'searchCategories', 
        component: SearchCategoriesComponent,
        canActivate: [AuthGuard],
        data: { 
            roles: [
                Role.SysAdmin,  
                Role.SubAdmin           
                ],
            entity: [
                Entity.System
            ], 
            breadcrumbs: 'Link Transaction Type'
        },
    },
    { path: 'pdfView/:id', component: TransactionPdfPublicViewComponent },
    { 
        path: 'dashboard',
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
            breadcrumbs: 'Dashboard'
        },
        children: [
        ] 
    },
    { 
        path: 'home', 
        component: HomeComponent, 
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Admin,
                Role.Manager,
                Role.CorporateAdmin,             
                Role.SysAdmin,
                Role.SubAdmin
            ],
            entity: [
                Entity.Organization,
                Entity.Corporate,
                Entity.System
            ],
            breadcrumbs: ''
        }
    },
    {
        path: 'loginHistory',
        component: LoginHistoryComponent,
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Admin,
                Role.Manager,
                Role.CorporateAdmin,
            ],
            entity: [
                Entity.Organization,
                Entity.Corporate,
            ],
            breadcrumbs: 'Login History'
        }
    },
    {
        path: 'traceability',
        component: TraceabilityComponent,
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Admin,
            ],
            entity: [
                Entity.Organization,
            ],
            breadcrumbs: 'Traceability'
        }
    },
    {
        path: 'traceabilityBlockchain',
        component: TraceabilityBlockchainComponent,
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Admin,
            ],
            entity: [
                Entity.Organization,
            ],
            breadcrumbs: 'Traceability With Blockchain'
        }
    },
    {
        path: 'eprDashboard',
        component: EprDashboardComponent,
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Admin,
            ],
            entity: [
                Entity.Organization,
            ],
            breadcrumbs: 'EPR Dashboard'
        }
    },
    {
        path: 'assetTracebilitySetup',
        component: AssetTracebilitySetupComponent,
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.SysAdmin,
                Role.SubAdmin
            ],
            entity: [
                Entity.System
            ],
                breadcrumbs: 'Asset Tracebility Setup'
        }
    },
    {
        path: 'assetProvenanceSetup',
        component: AssetProvenanceSetupComponent,
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.SysAdmin,
                Role.SubAdmin
            ],
            entity: [
                Entity.System
            ],
                breadcrumbs: 'Asset Provenance Setup'
        }
    },   
    {
        path: 'changePass',
        component: ChangepasswordComponent,
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Admin,
                Role.Manager,
                Role.CorporateAdmin,
                Role.SysAdmin,
                Role.SubAdmin
            ],
            entity: [
                Entity.Organization,
                Entity.Corporate,
                Entity.System
            ],
            breadcrumbs: "Change Password"
        }
    },
    {
        path: 'partnerEdit',
        component: PartnerEditComponent,
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Admin,
                Role.Manager,
                Role.CorporateAdmin,
            ],
            entity: [
                Entity.Organization,
                Entity.Corporate,
            ]
        }
    },  
    {
        path: 'batchList',
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Manager,
                Role.Admin,
                Role.CorporateAdmin,
            ],
            entity: [
                Entity.Organization,
                Entity.Corporate,
            ],
        },
        children: [              
        ]
    },
    {
        path: 'organizationBatches',
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Manager,
                Role.Admin,
                Role.CorporateAdmin,
            ],
            entity: [
                Entity.Organization,
                Entity.Corporate,
            ],
        },
        children: []
    },
   
    
    {
        path: 'transTypeList',
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Manager,
            ],
            entity: [
                Entity.Organization,
                Entity.Corporate,
            ],
            breadcrumbs: 'Transaction Type List'	
        },
        children: [           
            {
                path: ':transtypeId/:batchId/addTransIntegrated',
                component: DynamicAddTransIntegratedComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: [
                        Role.Manager,
                        Role.Admin,
                       Role.CorporateAdmin,
                    ],
                    entity: [
                        Entity.Organization,
                        Entity.Corporate,
                    ],
                    breadcrumbs: 'Create Transaction'
                }
            },
            { 
                path: ':moduleId/:transtypeId/:transactionTypeName/batchesList',
                canActivate: [AuthGuard],
                data: {
                    roles: [
                        Role.Manager,
                        Role.Admin,
                        Role.CorporateAdmin,
                    ],
                    entity: [
                        Entity.Organization,
                        Entity.Corporate,
                    ],
                    breadcrumbs: 'Batches'
                },
                children: [   
                ]
            },            
        ]
    },
    {
        path: 'transTypeList?dashboard=yes',
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Manager,
                Role.Admin,
                Role.CorporateAdmin,
            ],
            entity: [
                Entity.Organization,
                Entity.Corporate,
            ],
            breadcrumbs: 'Transaction Type List'	
        },
        children: [           
            {
                path: ':transtypeId/:batchId/addTransIntegrated',
                component: DynamicAddTransIntegratedComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: [
                        Role.Manager,
                        Role.Admin,
                        Role.CorporateAdmin,
                    ],
                    entity: [
                        Entity.Organization,
                        Entity.Corporate,
                    ],
                    breadcrumbs: 'Create Transaction'
                }
            },
            {
                path: ':transtypeId/:batchId/addTransIntegrated/:create/:transactionDetailsId',
                component: DynamicAddTransIntegratedComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: [
                        Role.Manager,
                        Role.Admin,
                        Role.CorporateAdmin,
                    ],
                    entity: [
                        Entity.Organization,
                        Entity.Corporate,
                    ],
                    breadcrumbs: 'Create Transaction'
                }
            },
            { 
                path: ':moduleId/:transtypeId/:transactionTypeName/batchesList',
                canActivate: [AuthGuard],
                data: {
                    roles: [
                        Role.Manager,
                        Role.Admin,
                        Role.CorporateAdmin,
                    ],
                    entity: [
                        Entity.Organization,
                        Entity.Corporate,
                    ],
                    breadcrumbs: 'Batches'
                },
                children: [                   
                    
                ]
            },           
        ]
    },
    {
        path: 'transTypeList?dashboard=1',
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Manager,
                Role.Admin,
                Role.CorporateAdmin,
            ],
            entity: [
                Entity.Organization,
                Entity.Corporate,
            ],
            // breadcrumbs: 'Transaction Type List'
        },
        children: [            
            {
                path: ':transtypeId/:batchId/addTransIntegrated',
                component: DynamicAddTransIntegratedComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: [
                        Role.Manager,
                        Role.Admin,
                        Role.CorporateAdmin,
                    ],
                    entity: [
                        Entity.Organization,
                        Entity.Corporate,
                    ],
                    breadcrumbs: 'Create Transaction'
                }
            },
            {
                path: ':transtypeId/:batchId/addTransIntegrated/:create/:transactionDetailsId',
                component: DynamicAddTransIntegratedComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: [
                        Role.Manager,
                        Role.Admin,
                        Role.CorporateAdmin,
                    ],
                    entity: [
                        Entity.Organization,
                        Entity.Corporate,
                    ],
                    breadcrumbs: 'Create Transaction'
                }
            },
            { 
                path: ':moduleId/:transtypeId/:transactionTypeName/batchesList',
                canActivate: [AuthGuard],
                data: {
                    roles: [
                        Role.Manager,
                        Role.Admin,
                        Role.CorporateAdmin,
                    ],
                    entity: [
                        Entity.Organization,
                        Entity.Corporate,
                    ],
                    breadcrumbs: 'Batches'
                },
                children: []
            },           
        ]
    },
    {
        path: 'searchTransaction',
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
        },
        children: []
    },
    {
        path: 'VerifierHistory',
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
        },
        children: [  
            
        ]
    },
   
    { path: 'accessDenied', component: AccessDeniedComponent },
    {
        path: 'organizations',
        loadChildren: () => import('./organizations/organizations.module').then(m => m.OrganizationsModule)
    },
    {
        path: 'branches',
        loadChildren: () => import('./branches/branches.module').then(m => m.BranchesModule)        
    },
    {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
    },   
    {
        path: 'assetname',
        loadChildren: () => import('./asset-add/asset-name.module').then(m => m.AssetNameModule),
    },   
    {
        path: 'assetcategory',
        loadChildren: () => import('./asset-category/asset-category.module').then(m => m.AssetCategoryModule),
    },   
    {
        path: 'assetuom',
        loadChildren: () => import('./asset-uom/asset-uom.module').then(m => m.AssetUomModule),
    },  
    {
        path: 'assetsummary',
        loadChildren: () => import('./asset-summary-details/asset-summary.module').then(m => m.AssetSummaryModule),
    }, 
    {
        path: 'categorylayout',
        loadChildren: () => import('./categorylayout/categorylayout.module').then(m => m.CategoryLayoutModule),
    },
    {
        path: 'transactions',
        loadChildren: () => import('./transactions/transactions.module').then(m => m.TransactionsModule),
    },
    {
        path: 'partners',
        loadChildren: () => import('./invitepartners/invitepartners.module').then(m => m.InvitePartnersModule),
    },
    
    {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Admin,
                Role.CorporateAdmin,
                Role.SysAdmin,
                Role.Manager,
                Role.SubAdmin
            ],
            entity: [
                Entity.Organization,
                Entity.Corporate,
                Entity.System,
            ],
        }
    },
    {
        path: 'transactionTypes',
        loadChildren: () => import('./transaction-type/transaction-type.module').then(m => m.TransactionTypeModule),
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
        }
    },
    {
        path: 'partner',
        loadChildren: () => import('./partners/partner.module').then(m => m.PartnerModule)        
    },
    { 
        path: 'viewnft/:nftId',
        component: ViewNftComponent,
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
            breadcrumbs: 'NFT Details'
        },
        children: [
        ] 
    },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', relativeLinkResolution: 'legacy' })
    ],
    exports: [RouterModule],
    providers: [
        { provide: UrlSerializer, useClass: CustomUrlSerializer }]
})
export class AppRoutingModule { }