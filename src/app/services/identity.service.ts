import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import * as queryString from 'query-string';
import { Observable } from 'rxjs';
import { API_GATEWAY } from '../tokens';

export interface IIdentityToken {
    access_token: string;
    expires_in: number;
    token_type: string;
    refresh_token: string;
    scope: string;
    uuid?: string;
}

@Injectable()
export class IdentityService {

    private uri: string = `${this.gateway}`;
    public constructor(
        @Inject(API_GATEWAY)
        private gateway: string,
        private httpClient: HttpClient
    ) { }

    public login(account: { username: string; password: string }): Observable<IIdentityToken> {
        let url: string = `${this.uri}/ids/connect/token`;

        const body: FormData = new FormData();
        body.set('grant_type', 'password');
        body.set('client_id', 'server');
        body.set('username', account.username);
        body.set('password', account.password);
        return this.httpClient.post<IIdentityToken>(url, body);
    }

    public identityProfile(): Observable<any> {
        let url: string = `${this.uri}/ids/Identity/Profile`;
        return this.httpClient.get<any>(url);
    }

    public queryTenantList(queryParam: any = {}): Observable<Array<any>> {
        const queryPart: string = queryString.stringify(queryParam);
        return this.httpClient.get<any>(`${this.uri}/ids/Identity/tenant?${queryPart}`);
    }

    public refreshToken(tenantId?: string): Observable<{ access_token: string; refresh_token: string }> {
        let refreshToken: string = localStorage.getItem('refresh_token');
        const body: FormData = new FormData();
        body.set('grant_type', 'refresh_token');
        body.set('client_id', 'server');
        body.set('refresh_token', refreshToken);

        if (tenantId) {
            body.set('tenantId', tenantId);
        }

        return this.httpClient.post<IIdentityToken>(`${this.uri}/ids/connect/token`, body);
    }
}
