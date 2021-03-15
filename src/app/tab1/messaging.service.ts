import { Injectable } from '@angular/core';

import { Plugin, Cordova, IonicNativePlugin } from '@ionic-native/core';

@Plugin(
    {
        pluginName: 'messaging',
        plugin: 'com.cxist.notification',
        pluginRef: 'cordova.plugins.messaging',
        repo: '',
        platforms: ['Android']
    }
)

@Injectable()
export class messaging extends IonicNativePlugin {

    @Cordova()
    startService(arg1: string, arg2: number): Promise<any> { return; }
}