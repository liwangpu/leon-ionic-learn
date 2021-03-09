import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

    constructor(
        private router: Router
    ) { }

    open() {
        // this.navCtl.navigateForward('/tabs/tab2/my-detail');
        this.router.navigateByUrl('/tabs/tab3/my-detail');
    }

}
