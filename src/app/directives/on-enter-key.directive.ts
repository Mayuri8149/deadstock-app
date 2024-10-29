import { Directive, HostListener } from '@angular/core';

@Directive({
  	selector: '[apponEnterKey]'
})
export class OnEnterKeyDirective {
    onEnterKey: boolean;
    onEnterKeyHandler: any;
    onEnterKeyParams: any;  

	@HostListener("keypress", ["$event"])
	public eventHandler(event: KeyboardEvent): void {
		if (this.onEnterKey && event.which === 13) {
			this.onEnterKeyHandler(this.onEnterKeyParams);
			event.preventDefault();
		}
	}
  	constructor() { }
}