/* eslint-disable require-jsdoc */
import redis from 'redis';
import {promisify} from 'util';


function redisFactory(options : redis.ClientOpts) {
  const client = redis.createClient(options);

  return {
    get: promisify(client.get).bind(client),
    set: promisify(client.set).bind(client),
  };
}


export default redisFactory;
