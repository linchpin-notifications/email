var assert = require("chai").assert; // node.js core module
var async = require('async');
var rnd = require("randomstring");


describe('email',function(){

    var seneca = require('seneca')();
    seneca.use('..');

    describe('sendEmail',function(){
        it('should send 50 emails in less than 5 seconds',function(done){
            this.timeout(5000);

            var emails = new Array(50);
            var id = rnd.generate(7);

            console.log("Running with id " + id);

            async.each(emails,
                function(item, callback){
                    var req =  {lpn:'email', cmd:'sendEmail', config:{
                        email:{
                            recipients:"isaac@linchpin.io",
                            body:"This is a massive email",
                            subject:"Massive email - Load Test " + id
                        }
                    }};

                    seneca.act(req, function(err,result){
                        assert.isNull(err);
                        console.log("%j",result);
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
