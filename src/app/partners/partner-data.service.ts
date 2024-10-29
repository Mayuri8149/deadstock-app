import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddCommentService } from '../dialogs/add-comment/add-comment.service';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
@Injectable({
	providedIn: 'root'
})
export class PartnerDataService {
	private subscriptions: Subscription[] = [];
	user;
	id;
	constructor(public http: HttpClient,
				private authService: AuthService,
				public apiService: ApiService,
				public addCommentService: AddCommentService,
				public route: ActivatedRoute,
				public router: Router
				) {
					this.authService.currentUser
						.subscribe((user) => {
							this.user = user;
						});
					this.id = this.route.snapshot.params['batchId'];
				}

	changeStatus(dialogData, data) {
		this.apiService.put(dialogData.url, data)
			.subscribe((response: any) => {
				if(response.success == true) {
					var partner = response.data.partner;
					var reviewers = partner.reviewers;
					var userId = this.user._id;
					for (var key in reviewers) {
						if(reviewers[key].userId === userId) {
							var currentReviewerStatus = reviewers[key].status;
							if(currentReviewerStatus == 'rejected') {
								this.addCommentService.openDialog(dialogData);
							}
						}
					};
					window.location.reload();
				}
			}); 
	};

	getPartners(url, params) {
		return this.apiService.get(url, params);
	}
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}