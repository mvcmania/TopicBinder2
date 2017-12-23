require('dotenv').config();
var mongoose = require('mongoose');
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
    console.log('err',err);
    console.log('doc',doc);
}); */
console.log(mongoose.Types.Decimal128.fromString("3.11758474136544"));

return 0; 
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
        console.log("Error ", error);
    }
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
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
    console.log(projectid);
    console.log(topicid);
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
            console.log(err);
            for (var res in result) {
                console.log('project>' + result[res]._id);
                console.log('count>' + result[res].count);
                for (var k in result[res].user) {
                    console.log(result[res].user[k]);
                }
            }
        });
};
getTopicAssignmentSummary('input.aiatA3', 339);*/