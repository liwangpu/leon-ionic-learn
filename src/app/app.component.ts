import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { combineLatest, from } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { UserProfileService } from './services';

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

    private startupMessaging(): void {
        let config = {
            token: localStorage.getItem('access_token'),
            refreshToken: localStorage.getItem('refresh_token'),
            tenantId: localStorage.getItem('tenantId'),
            identityId: localStorage.getItem('identityId'),
            employeeId: localStorage.getItem('employeeId'),
        };

        const configureMessaingPro = () => {
            return new Promise((res, rej) => {
                if (typeof cordova === 'undefined') { return rej('需要在app中运行才能启动服务') }
                cordova.plugins.Messaging.configure(JSON.stringify(config), () => {
                    res(null);
                }, err => {
                    rej(err);
                });
            });
        };

        const startupMessaingPro = () => {
            return new Promise((res, rej) => {
                cordova.plugins.Messaging.startup("param", () => {
                    res(null);
                }, err => {
                    rej(err);
                });
            });
        };

        configureMessaingPro().then(startupMessaingPro).then(() => this.showMessage(`服务启动成功`), err => this.showMessage(`服务启动失败:${err}`));
    }

    private async showMessage(msg: string): Promise<void> {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }

}
