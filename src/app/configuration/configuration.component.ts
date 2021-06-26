import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

const devEnv = "https://d-gateway-xcloud.cxist.cn/web";
const testEnv = "https://t-gateway-xcloud.cxist.cn/web";
const shandongEnv = "http://123.232.107.115:11008";


@Component({
    selector: 'app-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurationComponent implements OnInit {

    public env: string;
    public constructor(
    ) { }

    public ngOnInit() {
        this.env = localStorage.getItem('appConfig');
    }

    public useConfig(): void {
        localStorage.setItem('appConfig', this.env);
        localStorage.removeItem('latest_login');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('expires_in');
        location.href = '/';
    }

    public presetEnv(v: string): void {
        let env: any = {};
        switch (v) {
            case 'test':
                env.apiGateway = testEnv;
                break;
            case 'shandong':
                env.apiGateway = shandongEnv;
                break;
            default:
                env.apiGateway = devEnv;
                break;
        }
        this.env = JSON.stringify(env);
    }

}
