import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { first, map } from 'rxjs/operators';
import { IdentityService, UserProfileService } from '../services';

interface ITenant {
    id: string;
    name: string;
}

@Component({
    selector: 'app-tenant-select',
    templateUrl: './tenant-select.component.html',
    styleUrls: ['./tenant-select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantSelectComponent implements OnInit {

    public tenants: Array<ITenant>;
    public selectedTenantId: string;
    public profile: { [key: string]: any };

    public constructor(
        protected injector: Injector,
        private modalCtrl: ModalController,
        private identitySrv: IdentityService,
        private userProfileService: UserProfileService,
        private cdr: ChangeDetectorRef
    ) {
    }

    public async ngOnInit(): Promise<void> {
        await this.getUserProfile();
        this.tenants = await this.identitySrv.queryTenantList().pipe(
            map(tenants => tenants.map(t => ({ id: t.id, name: t.shortName || t.name })))).toPromise();
        this.cdr.markForCheck();
    }

    public selectTenant(id: string): void {
        this.selectedTenantId = id;
    }

    public saveTenant(): void {
        // tslint:disable-next-line: no-floating-promises
        this.modalCtrl.dismiss(this.selectedTenantId, 'ok');
    }

    public cancel(): void {
        // tslint:disable-next-line: no-floating-promises
        this.modalCtrl.dismiss(this.selectedTenantId, 'cancel');
    }

    private async getUserProfile(): Promise<void> {
        this.profile = await this.userProfileService.profile$.pipe(first()).toPromise();
    }

}
