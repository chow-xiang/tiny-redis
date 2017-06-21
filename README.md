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

