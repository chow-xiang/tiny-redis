'use strict';

var RedisParser = require('redis-parser');
var {errorHandler, replyHandler} = require('../handler/client');

class ClientParser extends RedisParser{
    constructor(client){
        super({
            returnError: errorHandler(client),
            returnReply: replyHandler(client)
        });
    }
}

module.exports  = ClientParser;

