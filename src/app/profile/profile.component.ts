import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppMessageTopicEnum } from '../enums';
import * as fromService from '../services';
import { MessageOpsatService } from '../services';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

    public name: string;
    public tenant: string;

    public constructor(
        private profileSrv: fromService.UserProfileService,
        private opsat: MessageOpsatService,
        private router: Router
    ) {

    }
    public ngOnInit(): void {
        this.profileSrv.profile$.subscribe(profile => {
            this.name = profile.employeeName;
            this.tenant = profile.tenantName;
        });
    }

    public logout(): void {
        localStorage.removeItem('latest_login');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('appConfig');
        this.router.navigateByUrl('/login');
        this.opsat.publish(AppMessageTopicEnum.logout);
    }

}
