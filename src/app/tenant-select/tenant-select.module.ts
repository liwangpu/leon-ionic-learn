import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TenantSelectComponent } from './tenant-select.component';

@NgModule({
    declarations: [ TenantSelectComponent ],
    imports: [
        IonicModule,
        CommonModule
    ]
})
export class TenantSelectModule {
}
