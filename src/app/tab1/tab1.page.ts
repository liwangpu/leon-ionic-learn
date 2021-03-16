import { Component } from '@angular/core';

declare let cordova: any;

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

    public startMessagingService(): void {
        cordova.plugins.messaging.startService(null, () => {
            alert('前台服务启动成功');
        }, err => {
            alert('前台服务启动失败:' + err);
        });
    }
}
