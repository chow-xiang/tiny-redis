'use strict';

var RedisParser = require('redis-parser');
var {errorHandler, replyHandler} = require('../handler/cluster');

class ClusterParser extends RedisParser{
    constructor(cluster, client){
        super({
            returnError: errorHandler(cluster, client),
            returnReply: replyHandler(client)
        });
    }
}

module.exports  = ClusterParser;


