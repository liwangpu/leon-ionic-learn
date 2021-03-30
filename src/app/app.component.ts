import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { delay } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { AppMessageTopicEnum } from './enums';
import { MessageOpsatService, MessagingService, topicFilter } from './services';
import { environment } from '@env/environment';

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
        private messagingSrv: MessagingService,
        private opsat: MessageOpsatService,
        private toastController: ToastController
    ) {
        this.subs.sink = this.opsat.message$.pipe(topicFilter(AppMessageTopicEnum.profileReady), delay(200)).subscribe(() => {
            // let employeeId = localStorage.getItem('employeeId');
            // console.log('employeeId:', employeeId);
            this.startupMessaging();
        });

        this.subs.sink = this.opsat.message$.pipe(topicFilter(AppMessageTopicEnum.logout)).subscribe(() => {
            this.shutdownMessaging();
        });
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public ngOnInit(): void {
        //
    }

    private async startupMessaging(): Promise<void> {
        let config = {
            gateway: environment.apiServer,
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
