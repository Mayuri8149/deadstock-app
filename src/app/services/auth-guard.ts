import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {

	constructor(private authService: AuthService,
				public router: Router) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean  {
		const allowedRoles: any = route.data.roles;
		const allowedEntity: any = route.data.entity;		
		const isAuthorized = this.authService.isAuthorized(allowedRoles,allowedEntity);
		if (!isAuthorized) {
			this.router.navigate(['/accessDenied']);
			return false;
		}
		return isAuthorized;
	}
}