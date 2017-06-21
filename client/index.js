'use strict';

var EventEmiter    = require('events');
var net            = require('net');
var clientHandlers = require('../lib/handler/client');

class RedisClient extends EventEmiter{

	constructor (
		host='127.0.0.1', 
		port=6379, 
		cb,
		handlers = clientHandlers
	){

		super();

		// property
		this._cmds      = [];    // 缓存的cmd
		this.address    = `${host}:${port}`;
		this._connected = false; // 是否在链接
		var {dataHandler, connectError, connectClose}  = handlers;

		// init connection
		this.redisCnt = net.connect({host, port}, () => {
			cb && cb(this);
			this._connected = true;
			this._cmds.forEach(cmd => this.redisCnt.write(`${cmd.cmd}\r\n`)); // 发送缓存的cmd
		});

		// options 
		this.redisCnt.setKeepAlive(true, 0);
		this.redisCnt.setNoDelay(true);
		// this.redisCnt.setTimeout(10000, () => {  });

		this.redisCnt.on('data', dataHandler(this));
		this.redisCnt.on('error', connectError(this));
		this.redisCnt.on('close', connectClose(this));
	}
	// push cmd
	command (cmd, cb) {
		var readyState = this.redisCnt.readyState;
		this._cmds.push({cmd, cb});

		if(this._connected){ // 已链接情况下，直接发送指令
			this.redisCnt.write(`${cmd}\r\n`);
		}
	}
	// sub
	subscribe(cmd, cb) {
		this.command(`subscribe ${cmd}`, cb);
	}
	// pub
	publish(cmd, msg, cb){
		this.command(`publish ${cmd} ${msg}`, cb);
	}
}

module.exports = RedisClient;
