'use strict'
let routes = []
let Joi = require('joi')
let api = require('../api')

routes.push({
  method: 'GET',
  path: '/activities/email',
  config: {
    description: "readEmails",
    handler: api.activities.readEmails,
    tags: ['api']
  }
})

routes.push({
  method: 'GET',
  path: '/activities/connector',
  config: {
    description: "add connector",
    handler: api.activities.connector,
    tags: ['api'],
    validate:{
      query:{
        webhook_url:Joi.string(),
        group_name:Joi.string(),
        state:Joi.string()
      }
    }
  }
})

routes.push({
  method: 'POST',
  path: '/activities/connector',
  config: {
    description: "send connector message",
    handler: api.activities.sendConnectorMessage,
    tags: ['api'],
    validate:{
      payload:{
        message:Joi.object()
      }
    }
  }
})



module.exports = routes