import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import * as fromService from './services';
import { API_GATEWAY } from './tokens';
import { environment } from '@env/environment';
import { AppConfigService } from './services';

const appInitializerFn: Function = (appConfig: AppConfigService) =>
    () => appConfig.loadAppConfig();

const apiGatewayFn: Function = (configSrv: AppConfigService) => `${configSrv.appConfig?.apiGateway}`;

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [
        fromService.IdentityService,
        fromService.UserProfileService,
        fromService.UserProfileProviderService,
        fromService.MessagingService,
        fromService.MessageOpsatService,
        AppConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFn,
            multi: true,
            deps: [AppConfigService]
        },
        {
            provide: API_GATEWAY,
            useFactory: apiGatewayFn,
            deps: [AppConfigService]
        },
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: fromService.ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: fromService.AuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
