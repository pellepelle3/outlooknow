'use strict'
const Boom = require('boom') 
const Promise = require('promise')
const db = require('./db')
const outlook = require('node-outlook')
let Activities = {}

module.exports = Activities
Activities.readEmails = (req, reply) => {
  let queryParams = {
    // '$select': 'Subject,ReceivedDateTime,From',
    '$orderby': 'ReceivedDateTime desc',
    '$top': 10
  }

  outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0')
  outlook.base.setAnchorMailbox(req.auth.credentials.email)

  outlook.mail.getMessages({token: req.auth.credentials.authData.token, odataParams: queryParams},
    (error, result)=> {
      if (error) return reply(error)
        reply(result)
    })
}