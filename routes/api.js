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

routes.push({
      method: 'GET',
      path: '/',
      config:{
        auth:false
      },
      handler: {
          file: {
              path: 'public/index.html'
          }
      }
  })

routes.push({
      method: 'GET',
      path: '/home',
      config:{
        auth:false
      },
      handler: {
          file: {
              path: 'public/index.html'
          }
      }
  })

routes.push({
      method: 'GET',
      path: '/login',
      config:{
        auth:false
      },
      handler: {
          file: {
              path: 'public/index.html'
          }
      }
  })

module.exports = routes