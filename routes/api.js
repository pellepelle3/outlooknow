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
      path: '/{param*}',
      config:{
        auth:false
      },
      handler: {
          directory: {
              path: 'public',
              listing: true
          }
      }
  })

module.exports = routes