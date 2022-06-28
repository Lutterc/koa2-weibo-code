const Sequelize = require('sequelize')
const { MYSQL_CONF } = require('../config/db')
const { isTest, isProd } = require('../utils/env')

const { host, user, password, database } = MYSQL_CONF
const config = {
  host,
  dialect: 'mysql',
}

if (isTest) {
  config.logging = () => {}
}

if (isProd) {
  config.pool = {
    max: 5,
    min: 0,
    idle: 10000, // 10s内没有使用释放连接
  }
}

const seq = new Sequelize(database, user, password, config)

module.exports = seq
