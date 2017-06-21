'use strict';

var RedisParser = require('redis-parser');

exports.dataHandler  = dataHandler;
exports.connectError = connectError;
exports.connectClose = connectClose;
// exports.errorHandler = errorHandler;
// exports.replyHandler = replyHandler;

/*
* data handler
*/
function dataHandler(client){

    var parser = new RedisParser({
        returnError: errorHandler(client),
        returnReply: replyHandler(client)
    });

    return function(chunk){
        parser.execute(chunk);
    }
}


/*
* return error handler
*/
function errorHandler(client){
    return function(err){
        var cmd = client._cmds.shift();
        cmd.cb && cmd.cb(err);
    }
}

/*
* return reply handler
*/
function replyHandler(client){
    return function(reply){
        if(reply[0] == 'message'){
            reply.shift();
            client.emit('message', reply);
        }else{
            var cmd = client._cmds.shift();
            cmd.cb && cmd.cb(null, reply);
        }
    }
}

/*
* connect error
*/
function connectError(client){
	return function(err){
		console.error(err.stack);
		client._connected = false;
	}
}


/*
* connect close
*/
function connectClose(client){
	return function(){
		console.error(`${client.address} is closed.`);
		client._connected = false;
	}
}
