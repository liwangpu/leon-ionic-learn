var exec = require('cordova/exec');

exports.startup = function (arg0, success, error) {
    exec(success, error, 'Messaging', 'startup', [arg0]);
};

exports.shutdown = function (arg0, success, error) {
    exec(success, error, 'Messaging', 'shutdown', [arg0]);
};
