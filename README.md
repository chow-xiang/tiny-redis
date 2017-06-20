### A tiny redis client for Node.js.  

for example:

    'use strict';

    var RedisClient = require('../client');
    var client      = new RedisClient('10.100.150.31', 6443);
    var pub         = new RedisClient('10.100.150.31', 6443);

    // set 
    client.command('set test2 666', reply => {
        console.log('set test2 666:' + reply);
    });

    // get
    client.command('get test2', reply => {
        console.log('get test2:' + reply);
    });

    // hmset
    client.command('hmset test1 a "dddddd" b "ddddddd"', reply => {
        console.log('hmset:' + reply);
    });

    // hmget
    client.command('hmget test1 a b', reply => {
        console.log('hmget:' + reply);

        client.command('get test2', ret => {
            console.log('callback get test2:' + ret);
        })
    });

    // keys
    client.command('keys *', reply => {
        console.log(reply);
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
        console.log(reply[1])
    })



    // if cluster
    // client
    // .command('get test2')
    // .then(reply => {console.log(reply)})
    // .moved()
    // // .then(reply => console.log(reply))

