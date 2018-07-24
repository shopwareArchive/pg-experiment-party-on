'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    API_ENDPOINT: '"https://shopware.local"',
    WEBSOCKET_ENDPOINT: '"ws://localhost:12345/ws"',
    STREAM_URL: '"http://localhost:8080/hls/test.m3u8"',
    ACCESS_KEY: '"SWSCBTHUU2OZMLZIZVFJC1V4RG"',
    BASE_URL: '"/"'
})
