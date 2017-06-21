'use strict';


/**
* Notice: Error only (P)SUBSCRIBE / (P)UNSUBSCRIBE / PING / QUIT allowed in this context
* Because client is subscribe mode, cannot issue any commands other than subscribe, psubscribe, unsubscribe, punsubscribe.
*/

var {RedisClient} = require('../');
var client      = new RedisClient();
var pub         = new RedisClient();



// pub/sub
client.subscribe('redisChat1', (e, reply) => {
	console.log(reply)

	pub.publish('redisChat1', '"Hello world"', (e, reply) => {
		console.log(reply)
	});

	client.command('get test', (e, ret) => {
		console.log(e.message)
	})
})


client.on('message', reply => {
	console.log(reply[1])
})
