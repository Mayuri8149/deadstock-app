import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorDialogService } from 'src/app/services/error-dialog.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
declare var require: any;
const arrayToTree  = require('array-to-tree');
@Component({
  selector: 'app-tree-chart',
  templateUrl: './tree-chart.component.html',
  styleUrls: ['./tree-chart.component.css']
})
export class TreeChartComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  faHandPointLeft = faHandPointLeft;
  options: Observable<any>;
  url: string;
  urls: String
  loginUser: any;
  orgId: any;
  arr1 = [];
  arr2 = []
  arr3= [];
  result = [];
  cloneOrders=[]
  dashboard: boolean = false;
  curPage:any=1;
	orgPerPage:any=5;
  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    public errorDialogService: ErrorDialogService,
    public router: Router,
    private authService: AuthService
    ) {}

  ngOnInit(): void {
    this.loginUser = JSON.parse(sessionStorage.getItem("user"));
		if (typeof this.loginUser.timeZone === 'undefined' || this.loginUser.timeZone == null || this.loginUser.timeZone == '') {
			this.loginUser.timeZone = 'Asia/Kolkata'
		}

    this.subscriptions.push(this.route.queryParams.subscribe((params) => {
			let that = this;
			var queryData = params['dashboard'];
			if(queryData == 1) {
				that.dashboard = true;
        this.orgId = this.loginUser.reference.organizationId;
			}else{
        this.orgId = this.route.snapshot.params['id'];
			}
		}));
    this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['instPerPage'];
    this.getTreeData(); 
    
  }

  getTreeData(){
    var params = new HttpParams();
    params = params.append('pagesize', "100");
		params = params.append('page', "1");
    params = params.append('organizationId', this.orgId);
    
    params = params.append('status', 'approved');
    this.url = environment.baseUrl +"/api/v1/invitepartner/getPartnersByOrgId?"+params

    let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'x-api-token': this.authService.getAccessToken()
		});

    this.options = this.http
      .get<any>(this.url, { headers: headers,responseType: 'json' })
      .pipe(
        map((data) => {
        if(data.data.partners.partners.length > 0){
          var mainArr = data.data.partners.partners;
          var dataArr = [];
          var newArr = [];
          var parentField = [];
          var lenCnt = mainArr.length;
          for(var i = 0; i < lenCnt; i++){ 
              newArr[i] = {
                name:mainArr[i].entityName,
                entityType:mainArr[i].corporate.entityType,
                parent:mainArr[i].partnerEntity,
                _id:mainArr[i].childEntity,
              };
            dataArr.push(newArr[i]);
          }
          var length = dataArr.unshift({"entityType":mainArr[0].organization.entityType,"name":mainArr[0].organization.name,"parent":null,"_id":mainArr[0].organizationId}); 
            var treeArr = arrayToTree(dataArr, {
            parentProperty: 'parent',
            customID: '_id'
          });

          this.arr1 = treeArr
          return {
            tooltip: {
              trigger: 'item',
              triggerOn: 'mousemove',
              formatter: function (params) {
                if(params.data.entityType != undefined){
                  return `${params.data.entityType}`;
                }else{
                  return ``;
                }
              }
            },
            series: [
              {
                type: 'tree',
                data: [treeArr[0]],
                top: '1%',
                left: '22%',
                bottom: '1%',
                right: '20%',
                symbolSize: 7,
                label: {
                  position: 'left',
                  verticalAlign: 'middle',
                  align: 'right',
                  fontSize: 13,
                  width:'auto'
                },
                leaves: {
                  label: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left',
                  },
                },
                expandAndCollapse: false,
                animationDuration: 550,
                animationDurationUpdate: 750,
              },
            ],
          };
        }else{
          var dataMsg = {
            reason: "No Partner Added!",
            status: ''
          };
          this.errorDialogService.openDialog(dataMsg);
        }
        }),
      );
  }
  goBack() {
    this.router.navigate(['organizations/OrganizationsList'],{ queryParams: { currentPage: this.curPage, instPerPage: this.orgPerPage}});
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  };
}

function equals(item: any, val: any) {
  throw new Error('Function not implemented.');
}