import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as fromService from '../services';

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
        this.router.navigateByUrl('/login');
    }

}
