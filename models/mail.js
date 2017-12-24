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
      console.log(err)
    else
      console.log(info);
 } */


 module.exports.sendAssignmentNotification = function(to, data, template, cb){
    var mail = {
        from: 'noreply@topicbinder.com',
        to: to,
        subject: 'TopicBinder : Topics assigned!',
        template: template,
        context: data
    }
    transporter.sendMail(mail, cb);
 }