'use strict';
//var moment = require('moment');
exports.len = function (json) {
    if(json)
        return Object.keys(json).length;
    else return 0;
    //return Object.keys(json).length;
};
exports.section = function (name, options) {
    if (!this._sections) this._sections = {};
    this._sections[name] = options.fn(this);
    return null;
};

/*module.exports = function dateFormat(date, format) {
    return moment(date).format(format);
};*/
exports.eq = function(a, b, options){
    if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters")
    if (a != b) {
        return options.inverse(this)
    } else {
        return options.fn(this)
    }
};
exports.gt = function( a, b ){
	var next =  arguments[arguments.length-1];
	return (a > b) ? next.fn(this) : next.inverse(this);
};
