import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Entity } from '../modals/entity';
import { Role } from '../modals/role';
import { AuthGuard } from '../services/auth-guard';
import { CategoryAddComponent } from './category-add/category-add.component';
import { SubCategoryAddComponent } from './category-add/sub-category-add/sub-category-add.component';
import { SubSubCategoryAddComponent } from './category-add/sub-category-add/sub-sub-category-add/sub-sub-category-add.component';


const routes: Routes = [
  { 
    path: 'categoryAdd',         
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
        breadcrumbs: 'Industry Add'
    },
    children: [
        {
            path: '',                
            component: CategoryAddComponent,
        },
        { 
            path: 'subCategoryAdd/:id/:name', 
            data: {
                breadcrumbs: 'Category Add',
            },
            children:[
                {
                    path: '',                
                    component: SubCategoryAddComponent, 
                },
                {
                    path: 'subSubCategoryAdd/:subId/:subSubId/:catname/:subcatname', 
                    component: SubSubCategoryAddComponent ,    
                    data: {
                        breadcrumbs: 'Module Add',
                    }
                }
            ]
        },             
    ] 
}, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategorylayoutRoutingModule { }