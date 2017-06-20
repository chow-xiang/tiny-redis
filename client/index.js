'use strict';

var EventEmiter   = require('events');
var net           = require('net');
var RedisParser   = require('redis-parser');
var {formatReply} = require('../lib');

class RedisClient extends EventEmiter{

	constructor (host='127.0.0.1', port=6379, cb){

		super();

		this._connected = false;
		this._cmds  = [];

		// init connection
		this.redisCnt = net.connect({host, port}, () => {
			this._connected = true;
			
			// 缓存的cmd
			this._cmds.forEach(cmd => { this.redisCnt.write(`${cmd.cmd}\r\n`) });
		})

		// init parser
		this._parser = new RedisParser({
			returnError: this.returnError.bind(this),
		    returnReply: this.returnReply.bind(this)
		});

		// options 
		// this.redisCnt.setKeepAlive(true, 0);
		// this.redisCnt.setNoDelay(true);
		// this.redisCnt.setTimeout(10000, () => {  });

		this.redisCnt.on('error', this.connectError);
		this.redisCnt.on('close', this.redisClose);
		this.redisCnt.on('data', this.getData(this));
	}
	// get data
	getData (client){
		return function (ret) {
			client._parser.execute(ret);
		}
	}
	// redis close
	redisClose (){
		this._connected = false
	}
	// connect error
	connectError (err){
		this._connected = false;
	}
	// returnError
	returnError (err) {
		this._cmds.shift();
	}
	// push reply
	returnReply (reply){
		if(reply[0] == 'message'){
			reply.shift();
			this.emit('message', reply)
		}else{
			var cmd = this._cmds.shift();
			cmd.cb && cmd.cb(reply);
		}
	}
	// push cmd
	command (cmd, cb) {

		var readyState = this.redisCnt.readyState;
		this._cmds.push({cmd, cb});

		if(this._connected && readyState == 'open'){ // 如果已连接直接发送
			this.redisCnt.write(`${cmd}\r\n`);
		}
	}

	subscribe(cmd, cb) {
		this.command(`subscribe ${cmd}`, cb);
	}

	publish(cmd, msg, cb){
		this.command(`publish ${cmd} ${msg}`, cb);
	}
}


module.exports = RedisClient;


