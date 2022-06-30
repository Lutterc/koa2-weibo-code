const redis = require('redis')
const { REDIS_CONF } = require('../config/db')

const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', (err) => console.error('redis error', err))

/**
 * redis set
 * @param {string} key 键
 * @param {string} val 值
 * @param {number} timeout 过期时间，单位 s
 */
function set(key, val, timeout = 60 * 60) {
  if (typeof val === 'object') {
    val = JSON.stringify(val)
  }
  redisClient.set(key, val)
  redisClient.expire(key, timeout)
}

/**
 * redis get
 * @param {string} key 键
 */
function get(key) {
  return new Promise((resolve, reject) => {
    redisClient.get((err, val) => {
      if (err) return reject(err)

      if (val === null) return resolve(null)

      try {
        resolve(json.parse(val))
      } catch (error) {
        resolve(val)
      }
    })
  })
}

module.exports = {
  set,
  get,
}
