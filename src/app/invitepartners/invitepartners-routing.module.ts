import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Entity } from '../modals/entity';
import { Role } from '../modals/role';
import { AuthGuard } from '../services/auth-guard';
import { InvitepartnersComponent } from './invitepartners.component';
import { PartnerUpdateComponent } from '../partners/partner-list/partner-update/partner-update.component';
import { partnerListComponent } from './partnerList/partnerList.component';
import { SendInvitationComponent } from './send-invitation/send-invitation.component';
import { PartnerSuperUsersComponent } from './partner-super-users/partner-super-users.component';

const routes: Routes = [ 
  
{ path: 'invitepartners',
canActivate: [AuthGuard],
data: {
    breadcrumbs:'Invite Partner',
    roles: [
        Role.Admin,
        Role.CorporateAdmin,
    ],
    entity: [
        Entity.Corporate,
        Entity.Organization
    ],
},
children: [
    {
        path: '',
        component: InvitepartnersComponent,
    },
    {
        path: 'sendinvitation',
        component: SendInvitationComponent,
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
            breadcrumbs: 'Invite Partner'
        }
    },
    { 
        path: 'partnerUpdates/:corporateId/:isBlockchainService', 
        component: PartnerUpdateComponent,
        canActivate: [AuthGuard],
        data: { 
            roles: [
                Role.SysAdmin,
                Role.SubAdmin,
                Role.Admin,
                Role.Manager,
                Role.CorporateAdmin
            ],
            entity: [
                Entity.System,
                Entity.Organization,
                Entity.Corporate
            ],
                breadcrumbs: 'Fabric Configuration'
        }
    }
]
}, 
{ path: 'partnerList',
canActivate: [AuthGuard],
data: {
    breadcrumbs:'Partner List',
    roles: [
        Role.Admin,
        Role.CorporateAdmin,
    ],
    entity: [
        Entity.Corporate,
        Entity.Organization
    ],
},
children: [
    {
        path: '',
        component: partnerListComponent,
    },
    {
        path: 'sendinvitation',
        component: SendInvitationComponent,
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
            breadcrumbs: 'Partner List'
        }
    },
    { 
        path: 'partnerUpdates/:corporateId/:isBlockchainService', 
        component: PartnerUpdateComponent,
        canActivate: [AuthGuard],
        data: { 
            roles: [
                Role.SysAdmin,
                Role.SubAdmin,
                Role.Admin,
                Role.Manager,
                Role.CorporateAdmin
            ],
            entity: [
                Entity.System,
                Entity.Organization,
                Entity.Corporate
            ],
                breadcrumbs: 'Fabric Configuration'
        }
    }
]
},
{
    path: 'superusers',
    component: PartnerSuperUsersComponent,
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
        breadcrumbs: 'Partner Super Users'
    }
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvitePartnersRoutingModule { }