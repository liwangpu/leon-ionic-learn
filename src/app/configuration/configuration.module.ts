import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [ConfigurationComponent],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ConfigurationRoutingModule
    ]
})
export class ConfigurationModule { }
