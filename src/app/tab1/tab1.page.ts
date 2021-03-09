import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { MyDialogComponent } from './my-dialog/my-dialog.component';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

    public constructor(
        public modalController: ModalController
    ) { }

    public async open(): Promise<void> {
        const modal = await this.modalController.create({
            component: MyDialogComponent,
            cssClass: 'my-custom-class'
        });
        return await modal.present();
    }

}
