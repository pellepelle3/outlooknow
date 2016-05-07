var routes = []
var lsq = require('lsq')
var Boom = require('boom')
var config

lsq.config.get()
  .then(function(c){
    config = c
  })


routes.push({
  method: 'GET',
  path: '/_config/',
  config:{
    description: 'Get config',
    tags: ['api','lsq','config'],
    handler: function (request, reply) {
      reply(config)
    }
  }
})

routes.push({
  method: 'GET',
  path: '/api/hello/',
  config:{
    description: 'Hello World',
    tags: ['api','lsq','hello'],
    handler: function (request, reply) {
      reply('Hello World!')
    }
  }
})

module.exports = routes