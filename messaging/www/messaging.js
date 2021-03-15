var exec = require('cordova/exec');

exports.startService = function (arg0, success, error) {
    exec(success, error, 'messaging', 'startService', [arg0]);
};
