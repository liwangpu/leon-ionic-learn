import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { skip } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { MessagingService, UserProfileService } from './services';

declare let cordova: any;

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

    private messagingStarted: boolean;
    private subs = new SubSink();
    public constructor(
        private messagingSrv: MessagingService,
        private toastController: ToastController,
        private profileSrv: UserProfileService
    ) {
        this.subs.sink = this.profileSrv.profile$
            .pipe(skip(1))
            .subscribe(async (profile: any) => {
                if (!profile) {
                    if (this.messagingStarted) {
                        await this.shutdownMessaging();
                    }
                    return;
                }

                const appConfigStr = localStorage.getItem('appConfig');
                const appConfig = JSON.parse(appConfigStr);

                const config: { [key: string]: any } = {
                    gateway: appConfig.apiGateway,
                    token: localStorage.getItem('access_token'),
                    expiresIn: localStorage.getItem('expires_in'),
                    refreshToken: localStorage.getItem('refresh_token'),
                    tenantId: profile?.tenantId,
                    identityId: profile?.identityId,
                    employeeId: profile?.employeeId,
                    aliase: undefined,
                };
                await this.startupMessaging(config);
            });
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public ngOnInit(): void {
        window['__cordovaAppUrlChange'] = (link: string) => {
            alert(`url change: ${link}`);
        };
    }

    private async startupMessaging(config: { [key: string]: any }): Promise<void> {
        if (typeof cordova === 'undefined') {
            this.showMessage('当前应用不在手机端运行,前台服务将不会启动');
            return;
        }

        const startupMessaingPro = () => {
            return new Promise((res, rej) => {
                cordova.plugins.Messaging.startup(JSON.stringify(config), () => {
                    res(null);
                }, err => {
                    rej(err);
                });
            });
        };

        try {
            config.aliase = await this.messagingSrv.getAliase(config.employeeId).toPromise();
            console.log('config:', config.aliase);
            await startupMessaingPro();
            this.showMessage(`服务启动成功`);
        } catch (err) {
            this.showMessage(`服务启动失败:${err}`, 1000 * 60 * 2);
        }
    }

    private async shutdownMessaging(): Promise<void> {
        if (typeof cordova === 'undefined') {
            return;
        }

        const shutdownMessaingPro = () => {
            return new Promise((res, rej) => {
                cordova.plugins.Messaging.shutdown(null, () => {
                    res(null);
                }, err => {
                    rej(err);
                });
            });
        };

        try {
            await shutdownMessaingPro();
            this.showMessage(`服务停止成功`);
        } catch (err) {
            this.showMessage(`服务停止失败:${err}`, 1000 * 60 * 2);
        }
    }

    private async showMessage(msg: string, duration = 2000): Promise<void> {
        const toast = await this.toastController.create({
            message: msg,
            duration
        });
        toast.present();
    }

}
