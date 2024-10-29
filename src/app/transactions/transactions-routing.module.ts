import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Entity } from '../modals/entity';
import { Role } from '../modals/role';
import { AuthGuard } from '../services/auth-guard';
import { TransactionViewComponent } from './transactions-final/transaction-view/transaction-view.component';
import { TransactionsFinalComponent } from './transactions-final/transactions-final.component';
import { PartnersOrderComponent } from '../partners/partners-order/partners-order.component';

const routes: Routes = [ 
 {
        path: 'transactions',
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Manager,
            ],
            entity: [
                Entity.Organization,
                Entity.Corporate,
            ],
            breadcrumbs: 'Transactions'
        },
        children: [
            {
                path: '',
                component: TransactionsFinalComponent,
            },
            {
                path: 'transactionView/:transactionId',
                component: TransactionViewComponent,
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
                    breadcrumbs: 'View Transaction'
                }
            },
            {
                path: 'transactionView/:transactionId/:transactionType',
                component: TransactionViewComponent,
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
                }
            },
        ]
    },
    {
        path: 'transactions?dashboard=1',
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
            {
                path: '',
                component: TransactionsFinalComponent,
            },
            {
                path: ':transactionId',
                component: TransactionViewComponent,
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
                    breadcrumbs: 'View Transaction'
                }
            },           
        ]
    },
    {
        path: 'partnersOrder',
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Admin,
                Role.CorporateAdmin
            ],
            entity: [
                Entity.Organization,
                Entity.Corporate
            ],
            breadcrumbs: 'Partners Order'
        },
        children: [
            {
                path: '',
                component: PartnersOrderComponent,
            },
            {
                path: ':transactionId/:transactionType',
                component: TransactionViewComponent,
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
                    breadcrumbs: 'View Transaction'
                }
            },
        ]
    }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }