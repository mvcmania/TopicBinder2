'use strict';
//var moment = require('moment');
exports.len = function (json) {
    return Object.keys(json).length;
};
exports.section = function (name, options) {
    if (!this._sections) this._sections = {};
    this._sections[name] = options.fn(this);
    return null;
};

/*module.exports = function dateFormat(date, format) {
    return moment(date).format(format);
};*/