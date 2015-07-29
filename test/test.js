var assert = require("chai").assert; // node.js core module

describe('email',function(){

    var seneca = require('seneca')();
    seneca.use('..');

    describe('sendEmail',function(){
        it('should send and email using mandrill',function(done){
            this.timeout(3000);
            var req =  {lpn:'email', cmd:'sendEmail', config:{
                email:{
                    recipients:{name:"Isaac",emails:["isaac@linchpin.io"]},
                    body:"this is a test",
                    subject:"this is a subject"
                }
            }};

            seneca.act(req, function(err,result){
                assert.isNull(err);
                assert.equal(result.status,"sent");
                done();
            });
        })
    });

    describe('about',function(){
        it('should return notification properties',function(done){
            seneca.act( {lpn:'email', cmd:'about'}, function(err,result){
                console.log( '%j', result );
                assert.isObject(result,'result is an object');
                assert.equal(result.name,'email','name is email');
                done();
            });
        })
    });


    describe('list',function(){
        it('should return a command\'s json schema',function(done){
            seneca.act({lpn:'email',cmd:'list'}, function(err,list){
                console.log('%j',list);
                assert.isObject(list,'list is object');
                done();
            });
        });
    });
});