import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-partner-dashboard',
  templateUrl: './partner-dashboard.component.html',
  styleUrls: ['./partner-dashboard.component.css']
})
export class PartnerDashboardComponent implements OnInit {
  user;
  role;
  entity;
  constructor() { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));		
		this.role = this.user.reference.role;
		this.entity = this.user.reference.entity;
  }
}