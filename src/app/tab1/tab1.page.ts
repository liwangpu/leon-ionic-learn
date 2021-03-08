import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

    public constructor(
        private navCtl: NavController,
        private router: Router,
        private acr: ActivatedRoute
    ) { }

    public goto(name: string) {
        if (name === 'student') {
            // this.navCtl.navigateForward('');
            this.router.navigate(['./student'], { relativeTo: this.acr });
        } else {
            this.router.navigate(['./teacher'], { relativeTo: this.acr });
        }

      
        // this.router.navigateByUrl('/tabs/tab1/home/student');
    }

}
