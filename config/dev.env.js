'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const consts = require('./consts')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
  // NODE_ENV:consts.devNodeEvn,
})
