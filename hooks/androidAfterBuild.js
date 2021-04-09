const convert = require('xml-js');
const fs = require('fs');

const androidManifestPath = 'platforms/android/app/src/main/AndroidManifest.xml';
// const androidManifestPath = './AndroidManifest.xml';
// 测试使用
// const androidTestManifestPath = './AndroidManifestTest.xml';

const xml = fs.readFileSync(androidManifestPath, 'utf8');
const androidManifest = convert.xml2js(xml, { compact: true, spaces: 4 });
let application = androidManifest.manifest.application;
let services = application.service ? (Array.isArray(application.service) ? application.service : [application.service]) : [];
let receivers = application.receiver ? (Array.isArray(application.receiver) ? application.receiver : [application.receiver]) : [];
// mirror 消息推送前台服务
let mirrorNotificationForegroundServiceName = '.service.MirrorMESService';
let mirrorNotificationStartRceiverServiceName = '.service.StartReceiver';

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

if (!services.some(s => s._attributes['android:name'] === mirrorNotificationStartRceiverServiceName)) {
    let mirrorNotificationStartRceiver = {
        _attributes: {
            'android:enabled': 'true',
            'android:exported': 'false',
            'android:name': mirrorNotificationStartRceiverServiceName
        }
    };
    let intentFilter = {};
    intentFilter.action = {
        _attributes: {
            'android:name': 'android.intent.action.BOOT_COMPLETED'
        }
    }
    mirrorNotificationStartRceiver['intent-filter'] = intentFilter;
    receivers.push(mirrorNotificationStartRceiver);
}

// console.log('androidManifest', androidManifest);
application._attributes = {
    ...application._attributes,
    'android:name': '.MainApplication',
    'tools:ignore': 'AllowBackup',
    'tools:targetApi': 'n'
};
application.service = services;
application.receiver = receivers;

androidManifest.manifest._attributes = {
    ...androidManifest.manifest._attributes,
    'xmlns:tools': 'http://schemas.android.com/tools'
};

const result = convert.js2xml(androidManifest, { compact: true, ignoreComment: true, spaces: 4 });
fs.writeFileSync(androidManifestPath, result);
// 测试使用
// fs.writeFileSync(androidTestManifestPath, result);
