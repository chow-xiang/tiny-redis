'use strict';

var EventEmiter   = require('events');
var net           = require('net');
var RedisParser = require('redis-parser');
// var {formatReply} = require('../lib');

class RedisClient extends EventEmiter{

	constructor (host='127.0.0.1', port=6379, cb){

		super();

		this._connected = false;
		this._cmdQueue  = [];

		// init connection
		this.redisCnt = net.connect({host, port}, () => {
			this._connected = true;
			this.sendCommonQueue();
		})
		// options 
		// this.redisCnt.setKeepAlive(true, 0);
		// this.redisCnt.setNoDelay(true);
		// this.redisCnt.setTimeout(10000, () => {  });
		this.redisCnt.on('error', this.connectError);
		this.redisCnt.on('close', () => { this._connected = false });
		this.redisCnt.on('data', ret => { this._parser.execute(ret); });

		// init parser
		this._parser = new RedisParser({
			returnError: this.returnError.bind(this),
		    returnReply: this.returnReply.bind(this)
		});
	}
	// connect error
	connectError (err){
		this._connected = false;
	}
	// returnError
	returnError (err) {
		this._cmdQueue.shift();
	}
	// push reply
	returnReply (reply){
		var cmd = this._cmdQueue.shift();
		cmd.cb && cmd.cb(reply);
	}
	// push cmd
	commond (cmd, cb) {
		this._cmdQueue.push({cmd, cb});
	}
	// send cmd queue
	sendCommonQueue (){
		for(var i=0;i<this._cmdQueue.length;i++){
			var cmd = this._cmdQueue[i];
			this.redisCnt.write(`${cmd.cmd}\r\n`);
		}
	}
}


module.exports = RedisClient;


