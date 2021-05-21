import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable()
export class AppConfigService {

    public appConfig: any;

    public constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        private injector: Injector
    ) { }

    public loadAppConfig(): Promise<void> {

        const browserMode: boolean = isPlatformBrowser(this.platformId);
        if (browserMode) {
            const storageConfig: string = localStorage.getItem('appConfig');
            if (storageConfig) {
                this.appConfig = JSON.parse(storageConfig);
            } else {
                const http: HttpClient = this.injector.get(HttpClient);
                // const configFile: string = isDevMode() ? '/assets/app-config.dev.json' : '/assets/app-config.json';
                const configFile: string = '/assets/app-config.json';
                return http.get(configFile).pipe(tap((data: any) => {
                    this.appConfig = data;
                    localStorage.setItem('appConfig', JSON.stringify(data))
                })).toPromise();
            }
        }

        return Promise.resolve();
    }
}
