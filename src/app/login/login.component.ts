import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import * as fromService from '../services';
import { Router } from '@angular/router';
import { parseUrl } from 'query-string';
import { TenantSelectComponent } from '../tenant-select/tenant-select.component';

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
        private userProfileService: fromService.UserProfileService,
        private toastController: ToastController,
        private modalCtrl: ModalController,
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
            await this.selectTenant();
            await this.router.navigateByUrl('/');
        } catch (err: any) {
            console.log('err:', err);
            const toast = await this.toastController.create({
                message: '账户名或者密码有误',
                duration: 2000
            });
            toast.present();
        }
    }

    public configApp(): void {
        this.router.navigateByUrl('/configuration');
    }

    public presetUser(us: string): void {
        let user: any;
        switch (us) {
            case 'Leon':
                user = { username: 'leon', password: 'wqj199139' };
                break;
            case '何工':
                user = { username: 'hechangjun', password: 'Cxist666' };
                break;
            case '关工':
                user = { username: 'guanshuwei', password: 'Cxist666' };
                break;
            default:
                break;
        }
        if (user) {
            this.form.patchValue(user);
            this.login();
        }

    }

    private async selectTenant(): Promise<void> {
        const modal: HTMLIonModalElement = await this.modalCtrl.create({ component: TenantSelectComponent });
        modal.present();
        let { data: tenantId } = await modal.onWillDismiss();
        if (!tenantId) {
            localStorage.removeItem('latest_login');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('expires_in');
            return;
        }
        await this.userProfileService.updateProfile(tenantId);
    }

}
