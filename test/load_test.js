var assert = require("chai").assert; // node.js core module
var async = require('async');


describe('email',function(){

    var seneca = require('seneca')();
    seneca.use('..');

    describe('sendEmail',function(){
        it.skip('should send 10 emails in less than 5 seconds',function(done){
            this.timeout(5000);

            var emails = new Array(10);

            async.each(emails,
                function(item, callback){
                    var req =  {lpn:'email', cmd:'sendEmail', config:{
                        email:{
                            recipients:"test@linchpin.io",
                            body:"This is a massive email",
                            subject:"Massive email - Load Test"
                        }
                    }};

                    seneca.act(req, function(err,result){
                        assert.isNull(err);
                        console.log(result);
                        //assert.isUndefined(result);
                        callback(null);
                    });
                },
                function (err){
                    assert.isUndefined(err);
                    done();
            });
        })
    });
});