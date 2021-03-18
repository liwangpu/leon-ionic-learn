import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import * as fromService from './services';
import { API_GATEWAY } from './tokens';
import { environment } from '@env/environment';

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
        { provide: API_GATEWAY, useValue: environment.apiServer },
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: fromService.ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: fromService.AuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
