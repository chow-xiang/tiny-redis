'use strict';

var {ClusterClient} = require('../');

var cluster = new ClusterClient([
	{
		host: '127.0.0.1',
		port: 6379,
		cb: function (client) {
			console.log(1)
		}
	},
])


// set 
cluster.command('set test2 666', (e, reply) => {
	console.log('set test2 666:' + reply);
});

// get
cluster.command('get test2', (e, reply) => {
	console.log('get test2:' + reply);

	cluster.command('get test', (e, ret) => {
		console.log('callback get test2:' + ret);

		cluster.command('get test', (e, ret) => {
			console.log('callback2 get test2:' + ret);
		})
	})
});

// hmset
cluster.command('hmset test1 a "dddddd" b "ddddddd"', (e, reply) => {
	console.log('hmset:' + reply);
});

// hmget
cluster.command('hmget test1 a b', (e, reply) => {
	console.log('hmget:' + reply);	
});

// keys
cluster.command('keys *', (e, reply) => {
	console.log(reply);
});

