import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
	providedIn: 'root'
})
export class SidebarService {

	public sidenav: MatSidenav;

	constructor() { }

	public setSidenav(sidenav: MatSidenav) {
		this.sidenav = sidenav;
	}

	public close() {
		this.sidenav.close();
	}

	public toggle(): void {
		this.sidenav.toggle();
	}
}