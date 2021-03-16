import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

declare let cordova: any;

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

    public constructor(private platform: Platform) {
    }

    public async ngOnInit(): Promise<void> {

    }

}
