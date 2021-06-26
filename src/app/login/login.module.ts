import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { TenantSelectModule } from '../tenant-select/tenant-select.module';

@NgModule({
    declarations: [LoginComponent],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LoginRoutingModule,
        TenantSelectModule
    ]
})
export class LoginModule { }
