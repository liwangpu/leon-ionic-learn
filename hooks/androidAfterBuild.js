const convert = require('xml-js');
const fs = require('fs');

const androidManifestPath = 'platforms/android/app/src/main/AndroidManifest.xml';
const xml = fs.readFileSync(androidManifestPath, 'utf8');
const androidManifest = convert.xml2js(xml, { compact: true, spaces: 4 });
let application = androidManifest.manifest.application;
let services = application.service ? (Array.isArray(application.service) ? application.service : [application.service]) : [];
// mirror 消息推送前台服务
let mirrorNotificationForegroundServiceName = 'com.cxist.mirror.message.MirrorMESService';

if (!services.some(s => s._attributes['android:name'] === mirrorNotificationForegroundServiceName)) {
    let mirrorNotificationForegroundService = {
        _attributes: {
            'android:enabled': 'true',
            'android:exported': 'false',
            'android:name': mirrorNotificationForegroundServiceName
        }
    };
    services.push(mirrorNotificationForegroundService);
}
application.service = services;

const result = convert.js2xml(androidManifest, { compact: true, ignoreComment: true, spaces: 4 });
fs.writeFileSync(androidManifestPath, result);
