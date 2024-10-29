import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Entity } from '../modals/entity';
import { Role } from '../modals/role';
import { AuthGuard } from '../services/auth-guard';
import { PartnerDashboardComponent } from './partner-dashboard/partner-dashboard.component';
import { PartnerDetailsComponent } from './partner-details/partner-details.component';
import { PartnerUpdateComponent } from './partner-details/partner-update/partner-update.component';
import { PartnerListComponent } from './partner-list/partner-list.component';

const routes: Routes = [
  { 
    path: 'partnerDashboard', 
    component: PartnerDashboardComponent, 
    canActivate: [AuthGuard],
    data: { 
            roles: [
                Role.CorporateAdmin,
                Role.Admin,
                Role.Manager,
            ],
            entity: [
                Entity.Corporate,
                Entity.Organization,
            ],
            breadcrumbs: ''
    }
  },
  { 
    path: 'partnersList', 
    component: PartnerListComponent, 
    canActivate: [AuthGuard],
    data: { 
            roles: [
                Role.SysAdmin,
                Role.SubAdmin,
                Role.Admin,
            ],
            entity: [
              Entity.System
               ],
          breadcrumbs: 'Entity List'
    }
},

  { 
      path: 'partnerDetails', 
      canActivate: [AuthGuard],
      data: { 
              roles: [
                  Role.SysAdmin,
                  Role.CorporateAdmin,   
                  Role.SubAdmin,
                  Role.Admin          
              ],
              entity: [
                  Entity.System,
                  Entity.Corporate,
                  Entity.Organization,
              ],
              breadcrumbs: 'Entity Details'
      },
      children:[
        {
          path: '',          
          component: PartnerDetailsComponent
        },
        { 
          path: 'partnerUpdate/:corpId', 
          component: PartnerUpdateComponent, 
          data: { 
                  roles: [
                      Role.CorporateAdmin,
                      Role.Admin,                 
                  ],
                  entity: [
                      Entity.Corporate,
                      Entity.Organization,
                  ],
                  breadcrumbs: 'Entity Update' 
          }
      }
      ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerRoutingModule { }
