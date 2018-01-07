require('dotenv').config();
var path = require('path');
//var app = require('express');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
//var exphbs = require('express-handlebars');
var hbs = require('nodemailer-express-handlebars');


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASS
        }
});
transporter.use('compile', hbs({
    viewEngine : 'handlebars',
    viewPath : "./views/notification",
    extName : '.handlebars'
}));


/* function (err, info) {
    if(err)
      C.logger.info(err)
    else
      C.logger.info(info);
 } */


 module.exports.sendEmail = function(to, data, subject, template, cb){
    var mail = {
        from: 'noreply@topicbinder.com',
        to: to,
        subject: subject,//'TopicBinder : Topics assigned!',
        template: template,
        context: data
    }
    transporter.sendMail(mail, cb);
 }
/*  module.exports.sendResetPassword = function(to, data, template, cb){
    var mail = {
        from: 'noreply@topicbinder.com',
        to: to,
        subject: 'TopicBinder Password Reset',
        template: template,
        context: data
    }
    transporter.sendMail(mail, cb);
 }
 module.exports.sendPasswordConfirmation = function(to, data, template, cb){
    var mail = {
        from: 'noreply@topicbinder.com',
        to: to,
        subject: 'Your password has been changed',
        template: template,
        context: data
    }
    transporter.sendMail(mail, cb);
 } */