import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { MessagingService } from '../services';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

    public form: FormGroup;
    public constructor(
        private messageSrv: MessagingService,
        private toastController: ToastController,
        fb: FormBuilder
    ) {
        this.form = fb.group({
            message: ['这是一条测试消息'],
            link: [true]
        });
    }

    public ngOnInit(): void { }

    public sendMessage(): void {
        let { message, link } = this.form.value;
        this.messageSrv.sendMessage('标题', message, link ? 'https://www.baidu.com' : null).subscribe(() => {
            this.showMessage('消息发送成功');
        });
    }

    private async showMessage(msg: string, duration = 2000): Promise<void> {
        const toast = await this.toastController.create({
            message: msg,
            duration
        });
        toast.present();
    }

}
