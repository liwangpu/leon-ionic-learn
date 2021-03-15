var exec = require('cordova/exec');

exports.coolMethod = function (arg0, success, error) {
    exec(success, error, 'messaging', 'coolMethod', [arg0]);
};
