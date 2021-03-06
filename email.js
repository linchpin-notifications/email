var config = require('./config');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(config.mandrill.api_key);
var schemas = require('./commands');
var Handlebars = require('handlebars');

var service = {
    "name": "email",
    "label": "Email",
    "description": "Email notification",
    "private": true,
    "form_options": null,
    "is_oauth": false,
    "logo": "//linchpin-web-assets.s3.amazonaws.com/v1/notifications/email/email-logo.png",
    "server_notification": true
};

module.exports = function(options) {
    var lpis = this;

    lpis.add({lpn:'email',cmd:'about'},about);
    lpis.add({lpn:'email',cmd:'list'},list);

    lpis.add({lpn:'email',cmd:'sendEmail'},sendEmail);
    lpis.add({lpn:'email',cmd:'sendEmailHandlebars'},sendEmailHandlebars);
    lpis.add({lpn:'email',cmd:'rateLimitExceeded'},rateLimitExceeded);

    return {
        name:'email'
    };


    function sendEmail(args, done){
        var email = args.config.email;

        if(!email.hasOwnProperty("recipients")){
            return done("Missing recipients");
        } else if(!email.hasOwnProperty("body")){
            return done("Missing body");
        }

        var to = getEmailArray(email);

        send({
            message: {
                to: to,
                from_email: config.email.from,
                subject: email.subject,
                html: email.body
            }
        }, done);
    }

    function sendEmailHandlebars(args, done){
        var email = args.config.email;
        var event = args.event;

        if(!email.hasOwnProperty("recipients")){
            return done("Missing recipients");
        } else if(!email.hasOwnProperty("body")){
            return done("Missing body");
        }

        if(event != undefined){
            var template = Handlebars.compile(email.body);
            email.body = template(event);
        }

        var to = getEmailArray(email);

        send({
            message: {
                to: to,
                from_email: config.email.from,
                subject: email.subject,
                html: email.body
            }
        }, done);

    }

    function rateLimitExceeded(args, done){
        var email = args.config.email;

        if(!email.hasOwnProperty("recipients")){
            return done("Missing recipients");
        }

        var to = getEmailArray(email);

        send({
            message: {
                to: to,
                from_email: config.email.from,
                subject: "'): Too many events triggering alert!",
                template_name: "rate-limit-exceeded"
            }
        }, done);
    }

    function send(email, callback){

        email.async = true;
        console.log('sending email - %j',email);

        var start = new Date();
        mandrill_client.messages.send(email, function(result)
        {
            var end = new Date() - start;
            var out = {status:"sent",response:result, time:end};
            callback(null, out);
        });
    }

    function getEmailArray(email){
        var recipients = [];

        email.recipients.emails.forEach(function(item){
            recipients.push({email:item});
        });

        return recipients;
    }


    function about (args, done ){
        return done(null,service);
    }

    function list (args, done){
        return done(null, schemas);
    }
};

