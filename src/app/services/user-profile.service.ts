import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, pipe, UnaryFunction } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { IdentityService } from './identity.service';


@Injectable()
export class UserProfileService {

    private _profile$: BehaviorSubject<{ [key: string]: any }> = new BehaviorSubject<{[p: string]: any}>(null);

    public constructor(
        private identitySrv: IdentityService
    ) { }

    public get profile$(): Observable<{ [key: string]: any }> {
        return this._profile$.asObservable();
    }

    public async getProfile(tenantId?: string): Promise<{ [key: string]: any }> {
        const lastProfile: { [key: string]: any } = this._profile$.getValue();
        if (lastProfile && (!tenantId || lastProfile.tenantId === tenantId)) {
            return Promise.resolve(lastProfile);
        }
        await this.updateToken(tenantId);
        return this.identitySrv.identityProfile().pipe(this.transferProfile()).toPromise();
    }

    public async updateProfile(tenantId: string): Promise<{ [key: string]: any }> {
        await this.updateToken(tenantId);
        return this.identitySrv.identityProfile().pipe(this.transferProfile()).toPromise();
    }

    private async updateToken(tenantId: string): Promise<void> {
        if (!tenantId) {
            return;
        }
        let res: { access_token: string; refresh_token: string } = await this.identitySrv.refreshToken(tenantId).toPromise();
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
    }

    private transferProfile(): UnaryFunction<Observable<{ [key: string]: any }>, Observable<{ [key: string]: any }>> {
        return pipe(map(res => {
            // tslint:disable-next-line: prefer-immediate-return
            let profile: { [key: string]: any } = {
                identityId: res.identityId,
                employeeId: res.employeeId,
                employeeName: res.name,
                roleIds: res.roleIds ? res.roleIds.split(',') : [], departmentIds: res.departmentIds ? res.departmentIds?.split(',') : [], name: res.name, tenantId: res.tenantId,
                isTenantAdmin: res.isTenantAdmin,
                isPlatformAdmin: res.isPlatformAdmin
            };
            return profile;
        }), switchMap(profile =>
            this.identitySrv.queryTenantList().pipe(map(ts => {
                let tenant: any = ts.find(t => t.id === profile.tenantId);
                return { ...profile, tenantName: tenant.name };
            }))), tap(profile => this._profile$.next(profile)));
    }

}
