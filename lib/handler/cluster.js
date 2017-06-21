'use strict';

const MOVED_MATCH = /MOVED\s*(\d*)\s*(\S*)\s*(\d*)/;
var RedisParser   = require('redis-parser');

exports.dataHandler  = dataHandler;
exports.connectError = connectError;
exports.connectClose = connectClose;
exports.errorHandler = errorHandler;


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
function errorHandler(cluster){
    return function (client){
        return function(err){
            var msg = err.message;
            var movedMsg = MOVED_MATCH.exec(msg);

            if(movedMsg){ // 如果是cluster
                var [msg, slot, address] = movedMsg;
                // 缓存slot信息

                // 去除掉命令
                var cmd = client._cmds.shift();

                // 查找正确的client
                var abClient = cluster._clients.find(c => c.address == address);
                abClient.command(cmd.cmd, cmd.cb);

            }else{
                var cmd = client._cmds.shift();
                cmd.cb && cmd.cb(err);
            }
        }
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


