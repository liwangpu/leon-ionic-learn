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

}
