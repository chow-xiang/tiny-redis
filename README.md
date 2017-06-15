### A tiny redis client for Node.js.  

for example:

    var RedisClient = require('../client');
    var client      = new RedisClient();
    
    // set 
    client.commond('set test2 666', reply => {
    	console.log('set test2 666:' + reply);
    });
    
    // get
    client.commond('get test2', reply => {
    	console.log('get test2:' + reply);
    });
    
    // hmset
    client.commond('hmset test1 a "dddddd" b "ddddddd"', reply => {
    	console.log('hmset:' + reply);
    });
    
    // hmget
    client.commond('hmget test1 a b', reply => {
    	console.log('hmget:' + reply);
    
    	client.commond('get test2', reply => {
    		console.log('callback get test2:' + reply);
    	})
    });