### A tiny redis client for Node.js.  

for example:

    'use strict';

    var {RedisClient, ClusterClient} = require('../client');
    var client      = new RedisClient();
    var pub         = new RedisClient();

    // set 
    client.command('set test2 666', reply => {
        console.log('set test2 666:' + reply);
    });

    // get
    client.command('get test2', reply => {
        console.log('get test2:' + reply); // '666'
    });

    // hmset
    client.command('hmset test1 a "a" b "b"', reply => {
        console.log('hmset:' + reply);  
    });

    // hmget
    client.command('hmget a b', reply => {
        console.log('hmget:' + reply);      // ['a', 'b']
    });

    // keys
    client.command('keys *', reply => {
        console.log(reply);      // ['a', 'b', 'test1', 'test2' ...]
    });


    // pub/sub
    client.subscribe('redisChat1', reply => {
        console.log(reply)
        pub.publish('redisChat1', '"Hello world"', reply => {
            console.log(reply)
        });
    })

    client.subscribe('redisChat2', reply => {
        console.log(reply)

        pub.publish('redisChat2', '"Hello world"', reply => {
            console.log(reply)
        });
    })


    client.on('message', reply => {
        console.log(reply[1])          // {'redisChat1': 'Hello world'}, {'redisChat2': 'Hello world'}
    })



    // if cluster
    var cluster = new ClusterClient([
        {
            host: '127.0.0.1',
            port: 6379,
            cb: function (client) {
                console.log(1)
            }
        },
    ])


