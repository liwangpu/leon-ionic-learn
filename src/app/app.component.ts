import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { combineLatest, from } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { MessagingService, UserProfileService } from './services';

declare let cordova: any;

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

    private subs = new SubSink();
    public constructor(
        private platform: Platform,
        private userProfile: UserProfileService,
        private messagingSrv: MessagingService,
        private toastController: ToastController
    ) {
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public async ngOnInit(): Promise<void> {
        this.subs.sink = combineLatest([
            this.userProfile.profile$.pipe(filter(p => p ? true : false)),
            from(this.platform.ready())
        ]).pipe(take(1)).subscribe(() => this.startupMessaging());
    }

    private async startupMessaging(): Promise<void> {
        let config = {
            token: localStorage.getItem('access_token'),
            expiresIn: localStorage.getItem('expires_in'),
            refreshToken: localStorage.getItem('refresh_token'),
            tenantId: localStorage.getItem('tenantId'),
            identityId: localStorage.getItem('identityId'),
            employeeId: localStorage.getItem('employeeId'),
            aliase: undefined,
        };

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
            await startupMessaingPro();
            this.showMessage(`服务启动成功`);
        } catch (err) {
            this.showMessage(`服务启动失败:${err}`);
        }
    }

    private async showMessage(msg: string): Promise<void> {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }

}
