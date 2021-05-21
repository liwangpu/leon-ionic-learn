import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import * as fromService from '../services';
import { Router } from '@angular/router';
import { parseUrl } from 'query-string';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

    public form: FormGroup;
    private returnUrl: string;
    public constructor(
        private identitySrv: fromService.IdentityService,
        private toastController: ToastController,
        private router: Router,
        fb: FormBuilder
    ) {
        this.form = fb.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]]
        });
    }

    public ngOnInit(): void {
        let { query } = parseUrl(this.router.url) as any;
        this.returnUrl = query.return;
        let lastLoginStr = localStorage.getItem('latest_login');
        if (lastLoginStr) {
            this.form.patchValue(JSON.parse(lastLoginStr));
        }
    }

    public async login(): Promise<void> {
        try {
            const res: any = await this.identitySrv.login(this.form.value).toPromise();
            localStorage.setItem('latest_login', JSON.stringify(this.form.value));
            localStorage.setItem('access_token', res.access_token);
            localStorage.setItem('refresh_token', res.refresh_token);
            localStorage.setItem('expires_in', res.expires_in);
            const toast = await this.toastController.create({
                message: '登陆成功',
                duration: 2000
            });
            toast.present();
            await this.router.navigateByUrl(this.returnUrl ? decodeURIComponent(this.returnUrl) : '/');
        } catch (err: any) {
            console.log('err:', err);
            const toast = await this.toastController.create({
                message: '账户名或者密码有误',
                duration: 2000
            });
            toast.present();
        }

    }
}
