import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import * as queryString from 'query-string';
import { Observable } from 'rxjs';
import { API_GATEWAY } from '../tokens';

@Injectable()
export class MessagingService {

    public constructor(
        @Inject(API_GATEWAY)
        private gateway: string,
        private httpClient: HttpClient
    ) { }

    public getAliase(employeeId: string): Observable<string> {
        let info = { type: 'user', info: employeeId };
        return this.httpClient.get<string>(`${this.gateway}/message/alias?bizObjId=${JSON.stringify(info)}`);
    }

    public sendMessage(title: string, message: string, link?: string) {
        let info = { title, content: message, link };
        let data = {
            sender: {
                type: "user",
                info: "11111"
            },
            receiver: {
                type: "user",
                info: localStorage.getItem('employeeId')
            },
            message: {
                type: "plain",
                info: JSON.stringify(info)
            },
            options: {
                notSaveInBox: false
            }
        };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('tenantId', localStorage.getItem('tenantId'));
        // let options = new RequestOptions({ headers: headers });
        return this.httpClient.post<void>(`${this.gateway}/message/send`, data, {
            headers: {
                'Content-Type': 'application/json',
                'tenantId': localStorage.getItem('tenantId')
            }
        });
    }
}
