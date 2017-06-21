'use strict';

var EventEmiter = require('events');
var RedisClient = require('./');
var handlers    = require('../lib/handler/cluster');

class ClusterClient extends EventEmiter{
	constructor (redisConfs){

		super();

		this._cmds            = [];    // 缓存的cmd
		this.allConnected     = false;
		handlers.errorHandler = handlers.errorHandler(this);

		// this._clients

		Promise
		.all(redisConfs.map(connect))
		.then(clients => {
			this.allConnected = true;
			this._clients     = clients;
			this._getDefalut  = getDefault(this._clients);

			// 发送缓存的cmd
			this._cmds.forEach(cmd => {
				var client = this._getDefalut();
				client.command(cmd.cmd, cmd.cb);
			}); 
		})
	}
	// push cmd
	command (cmd, cb) {
		if(!this.allConnected){
			this._cmds.push({cmd, cb});
		}else{
			var client = this._getDefalut();
			client.command(cmd, cb);
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

module.exports = ClusterClient;

/*
* connect
*/
function connect(conf){
	var {host, port, cb} = conf;
	return new Promise((res, rej) => {
		return new RedisClient(
			host, 
			port, 
			function(client){
				cb && cb(client);
				res(client);
			},
			handlers
		);
	})
}

/*
* 获取cluster的默认client
*/
function getDefault (clients) {
	return function (){
		return clients.find(client => client._connected);
	}
}
