'use strict'
const Boom = require('boom') 
const Promise = require('promise')
const Request = require('request-promise')
const db = require('./db')
const outlook = require('node-outlook')
let Activities = {}

module.exports = Activities

Activities.readEmails = (req, reply) => {
  let queryParams = {
    '$orderby': 'ReceivedDateTime desc',
    '$top': 50
  }

  let options = {
    method: 'GET',
    path: 'messages',
    email: req.auth.credentials.email,
    token: req.auth.credentials.authData.token,
    query: queryParams
  }

  return db.outlookRequest(options)
  .then(res=>{
    let messages = res.value
    reply(messages)
    markAllAsProcessed(messages, options.email, options.token)
  })
  .catch(e=>{
    console.log(e)
    reply(e)
  })
}

Activities.connector = (req,reply) => {
  return findConnectorByWebhook(req.query.webhook_url)
    .then(id=>id,()=>connectorCreate({userId:req.auth.credentials.id,connectorUrl:req.query.webhook_url}))
    .done(()=>reply.redirect("/home"))
}

Activities.sendConnectorMessage = (req,reply) => {
  return findConnectorByUserId(req.auth.credentials.id)
    .then(connector => Request({url:connector.connectorUrl, method:'POST', json:req.payload.message}))
    .then(data=>reply(data))
    .catch(e=>{
      console.log(e)
      reply(e)
    })

}

function markAllAsProcessed (messages, email, token){
  return messages.map(message=>markAsProcessed(message, email, token))
}

function markAsProcessed (message, email, token) {
  if (typeof message !== "object" ) return
  if (message.Categories.indexOf('Processed by Now') !== -1) return
  message.Categories.push('Processed by Now')
   let options = {
    method: 'PATCH',
    path: `messages/${message.Id}`,
    email: email,
    token: token,
    json: {'Categories':message.Categories }
  }

  return db.outlookRequest(options)
}

function findConnectorByWebhook(webhook) {
  return db.pg.one('SELECT id FROM outlook_connectors WHERE connector_url = ${webhook}', { webhook })
}

function findConnectorByUserId(id) {
  return db.pg.one('SELECT id, connector_url FROM outlook_connectors WHERE user_id = ${id}', { id })
    .then(connector => db.underscoreToCamel(connector))
}

function connectorCreate(connector) {
  return db.pg.one('INSERT INTO outlook_connectors (user_id, connector_url) VALUES ( ${user_id}, ${connector_url}) RETURNING id', db.camelToUnderscore(connector))
  .then(userAccount => db.underscoreToCamel(userAccount))
}