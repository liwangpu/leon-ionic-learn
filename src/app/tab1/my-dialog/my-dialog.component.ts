import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-my-dialog',
    templateUrl: './my-dialog.component.html',
    styleUrls: ['./my-dialog.component.scss'],
})
export class MyDialogComponent implements OnInit {

    constructor(
        private modalController: ModalController
    ) { }

    ngOnInit() { }

    close() {
        this.modalController.dismiss();
    }

}
