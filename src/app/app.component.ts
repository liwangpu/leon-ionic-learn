import { Component, OnInit, ViewChild } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ToastController } from '@ionic/angular';
import { IonRouterOutlet, Platform } from '@ionic/angular';
const { App } = Plugins;


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

    @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;
    public constructor(
        private platform: Platform,
        // private routerOutlet: IonRouterOutlet,
        private toastController: ToastController
    ) {
        this.platform.backButton.subscribeWithPriority(-1, (processNextHandler) => {
            // if (!this.routerOutlet.canGoBack()) {
            //     App.exitApp();
            // }
            this.showMessage(-1);
        });

        this.platform.backButton.subscribeWithPriority(100, (processNextHandler) => {
            // if (!this.routerOutlet.canGoBack()) {
            //     App.exitApp();
            // }
            this.showMessage(100);
        });

        this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
            // if (!this.routerOutlet.canGoBack()) {
            //     App.exitApp();
            // }
            this.showMessage(10);
        });
    }

    private async showMessage(priority: number) {
        const toast = await this.toastController.create({
            message: `后退按钮被点击 priority:${priority}`,
            duration: 2000
        });
        toast.present();
    }

    public async ngOnInit(): Promise<void> {
        // const toast = await this.toastController.create({
        //     message: 'Your settings have been saved.',
        //     duration: 2000
        // });
        // toast.present();

        // console.log(1, this.routerOutlet);

    }

}
