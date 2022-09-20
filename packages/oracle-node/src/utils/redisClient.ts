const redis = require('redis');

//super easy managed redis server --> https://console.upstash.com/
export const createRedisClient = () => {
  //Configure redis client
  var client = redis.createClient({
    legacyMode: true,
    url: `rediss://:${process.env.REDIS_PASSWORD}@eu1-relative-gelding-38371.upstash.io:38371`,
  });
  client.on('error', function (err) {
    console.log('redis err', err);
  });
  client.on('connect', function () {
    console.log('Connected to redis for session management!');
  });
  return client;
};
