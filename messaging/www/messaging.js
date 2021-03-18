var exec = require('cordova/exec');

exports.configure = function (arg0, success, error) {
    exec(success, error, 'Messaging', 'configure', [arg0]);
};

exports.startup = function (arg0, success, error) {
    exec(success, error, 'Messaging', 'startup', [arg0]);
};
