import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { AppMessageTopicEnum } from '../enums';
import { MessageOpsatService } from './message-opsat.service';
import { UserProfileService } from './user-profile.service';

@Injectable()
export class UserProfileProviderService implements Resolve<any>  {

    public constructor(
        private profileSrv: UserProfileService,
        private opsat: MessageOpsatService
    ) { }

    public async getProfile(): Promise<any> {
        return this.profileSrv.getProfile();
    }


    public async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        const profile = await this.getProfile();
        localStorage.setItem('employeeId', profile.employeeId);
        localStorage.setItem('identityId', profile.identityId);
        localStorage.setItem('tenantId', profile.tenantId);
        this.opsat.publish(AppMessageTopicEnum.profileReady);
        return profile;
    }
}
