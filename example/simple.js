'use strict';

var RedisClient = require('../client');
var client      = new RedisClient();
var pub         = new RedisClient();

// set 
client.command('set test2 666', (e, reply) => {
	console.log('set test2 666:' + reply);
});

// get
client.command('get test2', (e, reply) => {
	console.log('get test2:' + reply);

	client.command('get test', (e, ret) => {
		console.log('callback get test2:' + ret);
	})
});

// hmset
client.command('hmset test1 a "dddddd" b "ddddddd"', (e, reply) => {
	console.log('hmset:' + reply);
});

// hmget
client.command('hmget test1 a b', (e, reply) => {
	console.log('hmget:' + reply);	
});

// keys
client.command('keys *', (e, reply) => {
	console.log(reply);
});



