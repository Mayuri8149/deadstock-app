import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Entity } from '../modals/entity';
import { Role } from '../modals/role';
import { AuthGuard } from '../services/auth-guard';
import { UserProfileComponent } from '../users/user-profile/user-profile.component';
import { UsersListComponent } from '../users/users-list/users-list.component';
import { AddAgencyUserComponent } from './users-list/add-agency-user/add-agency-user.component';
import { AddPartnerUserComponent } from './users-list/add-partner-user/add-partner-user.component';
import { UserAccessComponent } from './users-list/user-access/user-access.component';
import { UserAddComponent } from './users-list/user-add/user-add.component';
import { UserEditComponent } from './users-list/user-edit/user-edit.component';
import { UsersDetailComponent } from './users-list/users-detail/users-detail.component';

const routes: Routes = [
  {   
      path: 'myProfile', 
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
          breadcrumbs: 'My Profile'
      },
      children:[
        { 
            path:'',
            component: UserProfileComponent 
        },        
        { 
            path: 'userDetail/:userId', 
            component: UsersDetailComponent, 
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
                breadcrumbs: 'User Details'
            }    
          }
      ]
  },
    {
        path: 'userList',
        canActivate: [AuthGuard],
        data: {
            roles: [
                Role.Admin,
                Role.SubAdmin,
                Role.SysAdmin,
                Role.CorporateAdmin,
            ],
            entity: [
                Entity.Organization,
                Entity.Corporate,
                Entity.System
            ],
            breadcrumbs: 'Users'
        },
        children: [
            {
                path: '',
                component: UsersListComponent,
            },
            {
                path: 'userAdd',
                component: UserAddComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: [
                        Role.Admin,
                        Role.SubAdmin,
                        Role.SysAdmin,
                    ],
                    entity: [
                        Entity.Organization,
                        Entity.System
                    ],
                    breadcrumbs: 'Add User'
                }
            },
            {
                path: 'userEdit/:userId',
                component: UserEditComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: [
                        Role.SysAdmin,
                        Role.SubAdmin,
                        Role.Admin,
                        Role.CorporateAdmin,
                    ],
                    entity: [
                        Entity.Organization,
                        Entity.Corporate,
                        Entity.System
                    ],
                    breadcrumbs: 'Edit User'
                }
            },
            {
                path: 'addPartnerUser',
                component: AddPartnerUserComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: [                       
                        Role.CorporateAdmin,
                    ],
                    entity: [
                        Entity.Corporate,
                    ],
                    breadcrumbs: 'Add User'
                }
            },
            {
                path: 'AddAgencyUser',
                component: AddAgencyUserComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: [
                        Role.Admin,
                        Role.SubAdmin,
                        Role.SysAdmin,
                        Role.CorporateAdmin,
                    ],
                    entity: [
                        Entity.Organization,
                        Entity.Corporate,
                        Entity.System
                    ],
                    breadcrumbs: 'Add User'
                }
                
            },
              {
                path: 'useracess/:id',
                component: UserAccessComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: [
                        Role.Admin,
                        Role.SubAdmin,
                        Role.CorporateAdmin
                    ],
                    entity: [
                        Entity.Organization,
                        Entity.Corporate,
                        Entity.System
                    ],
                    breadcrumbs: 'User Access'
                }
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule { }