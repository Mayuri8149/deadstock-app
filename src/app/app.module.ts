import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    AuthServiceConfig,
    LinkedinLoginProvider
} from "angular-6-social-login";
// SocialLoginModule
import { BnNgIdleService } from 'bn-ng-idle'; // import bn-ng-idle service
// import { JwSocialButtonsModule } from 'jw-angular-social-buttons';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { ChartsModule } from 'ng2-charts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxMatIntlTelInputModule } from 'ngx-mat-intl-tel-input';
import { PpBreadcrumbsModule } from 'pp-breadcrumbs';
import { environment } from 'src/environments/environment';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AssetProvenanceSetupComponent } from './asset-provenance-setup/asset-provenance-setup.component';
import { AssetTracebilitySetupComponent } from './asset-tracebility-setup/asset-tracebility-setup.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { PartnerRegistrationComponent } from './partner-registration/partner-registration.component';
import { AddCommentComponent } from './dialogs/add-comment/add-comment.component';
import { AlertDialogComponent } from './dialogs/alert-dialog/alert-dialog.component';
import { ConfimationDialogComponent } from './dialogs/confimation-dialog/confimation-dialog.component';
import { ErrorDialogComponent } from './dialogs/error-dialog/error-dialog.component';
import { SendMailComponent } from './dialogs/send-mail/send-mail.component';
import { ViewDialogComponent } from './dialogs/view-dialog/view-dialog.component';
import { AutoFocusModule } from "./directives/auto-focus.module";
import { MmYyyyFormatDirective } from './directives/mm-yyyy-format.directive';
import { NoRightClickDirective } from './directives/no-right-click.directive';
import { OnEnterKeyDirective } from './directives/on-enter-key.directive';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { EprDashboardComponent } from './epr-dashboard/epr-dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { Globals } from './globals';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ImageService } from './image.service';
import { HttpConfigInterceptor } from './interceptor/httpconfig.interceptor';
import { LoginHistoryComponent } from './login-history/login-history.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material-module';
import { OrganizationRegistrationComponent } from './organization-registration/organization-registration.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PartnerEditComponent } from './partners/partner-edit/partner-edit.component';
import { ResendOtpComponent } from './resend-otp/resend-otp.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SearchCategoriesComponent } from './search-categories/search-categories.component';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { ConfirmDialogService } from './services/confirm-dialog.service';
import { DataService } from './services/data.service';
import { SnackbarService } from './services/snackbar.service';
import { PageSidebarComponent } from './sidebar/page-sidebar/page-sidebar.component';
import { SidebarComponent } from './sidebar/sidebar/sidebar.component';
import { TraceabilityBlockchainComponent } from './traceability-blockchain/traceability-blockchain.component';
import { TraceabilityComponent } from './traceability/traceability.component';
import { DynamicAddTransIntegratedComponent } from './trans-type-list/dynamic-add-trans-integrated/dynamic-add-trans-integrated.component';
import { MonthDatePickerComponent } from './trans-type-list/dynamic-add-trans-integrated/month-date-picker/month-date-picker.component';
import { PurchaseOrderModalComponent } from './trans-type-list/dynamic-add-trans-integrated/purchase-order-modal/purchase-order-modal.component';
import { YearDatePickerComponent } from './trans-type-list/dynamic-add-trans-integrated/year-date-picker/year-date-picker.component';
import { TransactionPdfPublicViewComponent } from './transaction-pdf-public-view/transaction-pdf-public-view.component';
import { MetamaskModalComponent } from './metamask-modal/metamask-modal.component';
import { ViewNftComponent } from './view-nft/view-nft.component';

export function tokenGetter() {
    return localStorage.getItem('access_token');
}

export function getAuthServiceConfigs() {
    let config = new AuthServiceConfig(
        [
            {
                id: LinkedinLoginProvider.PROVIDER_ID,
                provider: new LinkedinLoginProvider("1098828800522-m2ig6bieilc3tpqvmlcpdvrpvn86q4ks.apps.googleusercontent.com")
            },
        ]
    );
    return config;
}

@NgModule({
    declarations: [
        AppComponent,
        PageNotFoundComponent,
        HeaderComponent,
        PageSidebarComponent,
        HomeComponent,
        LoginComponent,
        OrganizationRegistrationComponent,
        ForgotPasswordComponent,
        AccessDeniedComponent,
        ErrorDialogComponent,
        SidebarComponent,
        ResetPasswordComponent,
        ConfimationDialogComponent,
        ViewDialogComponent,
        AddCommentComponent,
        LoginHistoryComponent,
        SendMailComponent,
        AlertDialogComponent,
        MmYyyyFormatDirective,
        PartnerRegistrationComponent,
        NoRightClickDirective,
        ChangepasswordComponent,
        AssetTracebilitySetupComponent,
        AssetProvenanceSetupComponent,
        OnEnterKeyDirective,
        EmailVerificationComponent,
        ResendOtpComponent,
        PartnerEditComponent,
        DynamicAddTransIntegratedComponent,
        PurchaseOrderModalComponent,
        TransactionPdfPublicViewComponent,
        SearchCategoriesComponent,
        HomeComponent,
        TraceabilityComponent,
        PurchaseOrderModalComponent,
        EprDashboardComponent,
        MonthDatePickerComponent,
        YearDatePickerComponent,
        TraceabilityBlockchainComponent,
        ViewNftComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        HttpClientModule,
        FontAwesomeModule,
        FlexLayoutModule,
        // SocialLoginModule,
        MatProgressBarModule,
        // JwSocialButtonsModule,
        PpBreadcrumbsModule,
        
        RecaptchaFormsModule,
        RecaptchaModule,
        NgxMatIntlTelInputModule,
        AutoFocusModule,
        MatRadioModule,
        ChartsModule,
        ModalModule.forRoot(),
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter
            }
        }),
        MatAutocompleteModule,
        Ng2SearchPipeModule
    ],
    exports: [
        MatProgressBarModule,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    providers: [
        BnNgIdleService,
        AuthService,
        ApiService,
        ConfirmDialogService,
        SnackbarService,
        DataService,
        ImageService,
        DatePipe,
        MetamaskModalComponent,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpConfigInterceptor,
            multi: true
        },
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
        Globals,
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { showError: true }
        },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatPaginator, useValue: {} },
        {
            provide: AuthServiceConfig,
            useFactory: getAuthServiceConfigs
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }