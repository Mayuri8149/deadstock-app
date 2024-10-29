import {
	BreakpointObserver,
	Breakpoints,
	BreakpointState
} from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from 'src/app/modals/user';
import { AuthService } from 'src/app/services/auth.service';
import { SidebarService } from './sidebar.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
	private subscriptions: Subscription[] = [];
	isUserLogin: UserModel;
	show: Boolean = false;
	@ViewChild('sidenav') drawer: any;
	public selectedItem : string = '';
	public isHandset$: Observable<boolean> = this.breakpointObserver
	  .observe(Breakpoints.Handset)
	  .pipe(map((result: BreakpointState) => result.matches));  

	constructor(public authService: AuthService,
		private breakpointObserver: BreakpointObserver,
				public sidebarService: SidebarService) {
					this.subscriptions.push(this.authService.currentUser
						.subscribe((user) => {
							this.isUserLogin = user;
						}))
				}
	ngOnInit() {
	}

	openDropdown() {
		if(!this.show) {
			this.show = true;
		} else {
			this.show = false;
		}
	}

	logout() {
		this.authService.logout();
	}

	close() {
		this.sidebarService.close();
	}
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}