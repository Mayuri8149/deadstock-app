import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOfBranchesComponent } from './list-of-branches/list-of-branches.component';
import { Entity } from '../modals/entity';
import { Role } from '../modals/role';
import { AuthGuard } from '../services/auth-guard';
import { BranchAddComponent } from './list-of-branches/branch-add/branch-add.component';


const routes: Routes = [
    {
        path:'branches',redirectTo:"/listofBranches"
    },
    { 
      path: 'listofBranches', 
      canActivate: [AuthGuard],
      data: { 
        roles: [
            Role.Admin,
            Role.Manager,    
        ],
        entity: [
            Entity.Organization,
            Entity.Corporate,
        ],
            breadcrumbs: 'Branches'
      },
        children: [  
            { path:'',                
              component: ListOfBranchesComponent 
            },
            { 
                path: 'branchAdd', 
                component: BranchAddComponent, 
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
                        breadcrumbs: 'Branch Add'
                }
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchesRoutingModule { }
