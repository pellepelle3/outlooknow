'use strict'
let routes = []
let Joi = require('joi')
let api = require('../api')

routes.push({
  method: 'GET',
  path: '/auth/office',
  config: {
    auth: 'office365',
    description: "oauth with office",
    notes: "This endpoint implementes the oAuth 2 protocol with Office. The user is redirected to the oAuth provider if initiating authentication. The provider then executes a callback with the authorization code for the user to this same endpoint. A user is then either registered or authenticated and then redirected to the home page of the application.",    
    handler: api.auth.office,
    tags: ['api']
  }
})

routes.push({
  method: 'GET',
  path: '/login',
  config: {
    auth: false,
    description: "login",
    handler: api.auth.login,
    tags: ['api']
  }
})

routes.push({
  method: 'GET',
  path: '/home',
  config: {
    description: "home",
    handler: api.auth.home,
    tags: ['api']
  }
})

routes.push({
  method: 'GET',
  path: '/logout',
  config: {
    auth: false,
    description: "logout",
    handler: api.auth.logout,
    tags: ['api']
  }
})

module.exports = routes