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



module.exports = routes