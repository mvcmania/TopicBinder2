var fse = require('fs-extra');
var path = require('path');
var datasetPath = path.join('../../resources','DATASETS');

fse.readdir(datasetPath, function(err, files){
    console.log(files);
});
//var mongoose = require('mongoose');
/* var bcrypt = require('bcryptjs');
bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash('ube12312017', salt, function (err, hash) {
        C.logger.info(hash);
    });
}); */
/* var path = require('path');
var async = require('async');
var fse = require('fs-extra');
var srcMap= {
            'C:\\Users\\OSF\\Documents\\Projects\\TopicBinder2\\projects\\fub04\\CREFILES\\parsed\\CR93E1':'C:\\Users\\OSF\\Documents\\Projects\\TopicBinder2\\projects\\fub04\\CREFILES\\unparsed',
             'C:\\Users\\OSF\\Documents\\Projects\\TopicBinder2\\projects\\fub04\\CREFILES\\parsed\\CR93E10':'C:\\Users\\OSF\\Documents\\Projects\\TopicBinder2\\projects\\fub04\\CREFILES\\unparsed' };
var p = 'C:\\Users\\OSF\\Documents\\Projects\\TopicBinder2\\projects\\fub04\CREFILES\\unparsed';
 var cb= function(err){
    C.logger.info('Cb res', err);
};
//var mp = src.map(function(srcItem){ return path.basename(srcItem);});
async.mapValues(srcMap,
function(file, key, cb){
    C.logger.info('key =',key);
    C.logger.info('file =',file);
    var basename = path.basename(key);
    C.logger.info('basename =',path.join(file, basename));
    fse.move(key, path.join(file, basename),{ overwrite: true },cb);
}, function(err, result){
  C.logger.info('Result =',result);
  C.logger.info('err =',err);
}); */
/* var fs = require('fs');
if(fs.existsSync('projects/fub04')){
    C.logger.info('Directory exists');
}
if(fs.existsSync('projects/fub044')){
    C.logger.info('Directory exists 2');
}
 */
/* var json2csv = require('json2csv');
var myData = [
    {"name":"Erkan",
    "lastname":"Cipil"},
    {"name":"Zeynep",
    "lastname":"Cipil"}
];
csv = json2csv({ data: myData, del :' ', quotes: '', hasCSVColumnTitle: false });
C.logger.info(csv);
 */
/* var dateFormat =  require('dateformat');
var now = new Date();
var formatDate = dateFormat(now, "ddmmyyyy_HH:MM:ss");
C.logger.info(formatDate); */
/* require('dotenv').config();
var path = require('path');
//var app = require('express');
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
    viewPath : path.join(__dirname, "views/notification"),
    extName : '.handlebars'
}));

var mail = {
    from: 'noreply@topicbinder.com',
    to: 'erkancipil@yandex.com',
    subject: 'Test Notification',
    template: 'assignmentnotification',
    context: {
        user: {
            name :"Erkan Cipil"
        }
    }
}

transporter.sendMail(mail, function (err, info) {
    if(err)
      C.logger.info(err)
    else
      C.logger.info(info);
 }); */
/* var db = mongoose.connect(process.env.MONGODB_URI,{
    useMongoClient : true,
    promiseLibrary: require('bluebird')
});
var Pool = require('./models/pool');
 var p = new Pool({
        topic_id :400,
        project:'test',
        document_id :'ABCDE'
    });
Pool.createPoolItems([p], function(err,doc){
    C.logger.info('err',err);
    C.logger.info('doc',doc);
}); */
/* C.logger.info(mongoose.Types.Decimal128.fromString("3.11758474136544"));
mongoose.Types.Decimal128.
return 0;  */
/*var sendgrid = require("sendgrid");
var helper = sendgrid.mail;
var fromEmail = new helper.Email("support@topicbinder.com");
var toEmail = new helper.Email("erkncpl@gmail.com");
var subject = "Test email from send grid";
var content = new helper.Content("text/html", "<p></p>");
var mail = new helper.Mail(fromEmail, subject, toEmail, content);
var templateID = mail.setTemplateId(process.env.SENDGRID_TEMPLATE_ID);
var personalization = new helper.Personalization();
var section = new helper.Substitution("%name%", "Erkan Cipil"),
    section2 = new helper.Substitution("%nooftopic%", "36");
personalization.addSubstitution(section);
personalization.addSubstitution(section2);
personalization.addTo(toEmail);
mail.addPersonalization(personalization);
var sg = sendgrid(process.env.SENDGRID_API_KEY);
var request = sg.emptyRequest({
    method: "POST",
    path: '/v3/mail/send',
    body: mail.toJSON()
});
sg.API(request, function(error, response) {
    if (error) {
        C.logger.info("Error ", error);
    }
    C.logger.info(response.statusCode);
    C.logger.info(response.body);
    C.logger.info(response.headers);
});*/

/*var mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;

var assignSchema = mongoose.Schema({
    "document_id": {
        type: String,
        default: null,
        required: true
    },
    "is_related": {
        type: Boolean,
        default: false
    },
    "topic_id": {
        type: Number,
        default: null,
        required: true
    },
    "user_id": {
        type: String,
        default: null,
        required: true
    },
    "project": {
        type: String,
        default: null,
        required: true
    }
}, { collection: "atamalar" });
var Assign = mongoose.model('atamalar', assignSchema);
var getTopicAssignmentSummary = function(projectid, topicid) {
    C.logger.info(projectid);
    C.logger.info(topicid);
    Assign.aggregate([
            { $match: { "topic_id": topicid } },
            {
                $group: {
                    _id: "$user_id",
                    count: { $sum: 1 }
                }
            },
            { $lookup: { "from": "kullanicilar", "localField": "_id", "foreignField": "_id", "as": "user" } },
            {
                $project: { "user": { name: "$user.name", emai: "$user.email" }, "count": "$count", "_id": "$_id" }
            }
            //{ $project: { "count": "$count", "_id": "$_id" } }
        ],
        function(err, result) {
            C.logger.info(err);
            for (var res in result) {
                C.logger.info('project>' + result[res]._id);
                C.logger.info('count>' + result[res].count);
                for (var k in result[res].user) {
                    C.logger.info(result[res].user[k]);
                }
            }
        });
};
getTopicAssignmentSummary('input.aiatA3', 339);*/