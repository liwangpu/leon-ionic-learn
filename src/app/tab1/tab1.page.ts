import { Component, Injectable } from '@angular/core';
import { messaging } from './messaging.service';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

    public constructor(
        private messaging: messaging
    ) {

    }

    public startMessagingService(): void {
        // alert(JSON.stringify(typeof window['cordova']));
        this.messaging.startService(null, null);

    }
}
