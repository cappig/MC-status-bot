const Log = require('../database/logSchema');
const Server = require('../database/ServerSchema');

const util = require("util");
const mongoose = require("mongoose");

const client = global.redisclient;
client.hget = util.promisify(client.hget);
client.hgetall = util.promisify(client.hgetall);

const exec = mongoose.Query.prototype.exec;

// Lookup function, Looks up redis, 
// if the key is not in redis it fallbacks to mongo
module.exports = {
  async lookup(collection, key) {
    // collection can be 'Server' or 'Log'
    const cacheValue = await client.hget(collection, key);

    if (cacheValue) {
      const doc = JSON.parse(cacheValue);
      return doc
    } 
    
    // Mongo fallback
    else {
      var result;
      if (collection == 'Log') {
        result = await Log.findById({_id: key});
        client.hset(collection, key, JSON.stringify(result.logs));
      }
      else if (collection == 'Server') {
        result = await Server.findById({_id: key})

        var value = { ...result.toObject()};  // Copy server object
        value._id = undefined; // Remove the _id from the value
        client.hset(collection, key, JSON.stringify(value));
      }
      else {
        console.error(`${collection} is not a valid collection name - Log or Server!`);
        return '';
      }

      return result;
    }
  },

  // Create a Redis cache document
  async createCache(collection, key) {
    if (collection == 'Log') {
      client.hset(collection, key, '[]');
    }
    else if (collection == 'Server') {
      client.hset(collection, key, '{"IP": "", "Logging": false}');
    }
    else {
      console.error(`${collection} is not a valid collection name - Log or Server!`);
      return;
    }
  },

  // Remove document from redis
  // collection has to be 'Server' or 'Log'
  removeCache(collection, key) {
    client.hdel(collection, key);
  },

  // Get all values and kays from collection
  // This returns the same array that mongo does.
  async geetallCache(collection) {
    const all = await client.hgetall(collection);

    const map = new Map(Object.entries(all)); // Convert to map
    const res = []
    map.forEach(function callbackFn(value, key) { 
      const json = JSON.parse(value);
      json._id = key

      res.push(json);
    })
    return res;
  }
}

// Insert element in redis after ith as already been sent to mongo
// For this to work the new option needs to be set to true
mongoose.Query.prototype.cache = async function() {
  const result = await exec.apply(this, arguments);

  const key = JSON.stringify(this.getQuery()).replace(/[^0-9]/g,'');

  if (this.mongooseCollection.name == 'logs') {
    // Pass a empty array if the result is undefined
    if (!result) {
      await client.hset('Log', key, '[]');
    }else {
      await client.hset('Log', key, JSON.stringify(result.logs));
    }
    return;
  }
  else if (this.mongooseCollection.name == 'servers') {
    var value = { ...result.toObject()};  // Copy server object
    value._id = undefined; // Remove the _id from the value
    await client.hset('Server', key, JSON.stringify(value));
    return;
  }
  else {
    console.error(`${this.mongooseCollection.name} is not a valid collection name!`);
    return;
  }
};