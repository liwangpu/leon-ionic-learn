import { Injectable, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

// @dynamic
export function topicFilter(topic: string): any {
    return filter((x: { topic: string; data: any }) => x.topic === topic);
}

// @dynamic
export function topicFilters(...topics: Array<string>): any {
    return filter((x: { topic: string; data: any }) => topics.indexOf(x.topic) > -1);
}

// @dynamic
export function topicExpressionFilter(expression: (topic: string) => boolean): any {
    return filter((x: { topic: string; data: any }) => expression(x.topic));
}

// @dynamic
export const dataMap: any = map((ms: { topic: string; data?: any }) => ms.data);

// @dynamic
export const topicMap: any = map((ms: { topic: string; data?: any }) => ms.topic);

@Injectable()
export class MessageOpsatService implements OnDestroy {

    private _message$: Subject<{ topic: string; data: any }> = new ReplaySubject<{ topic: string; data: any }>(10);

    public get message$(): Observable<{ topic: string; data: any }> {
        return this._message$.asObservable();
    }

    public ngOnDestroy(): void {
        this._message$.complete();
        this._message$.unsubscribe();
    }

    public publish(topic: string, data?: any): void {
        this._message$.next({ topic, data });
    }
}
