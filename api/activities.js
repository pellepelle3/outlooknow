'use strict'
const Boom = require('boom') 
const Promise = require('promise')
const XhrJson = require('xhr-json')
const Request = require('request-promise')
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

  let options = {
    method: 'GET',
    path: 'messages',
    email: req.auth.credentials.email,
    token: req.auth.credentials.authData.token,
    query: queryParams
  }
return db.outlookRequest(options)
.then(res=>reply(res))
.catch(e=>reply(e))



}

Activities.connector = (req,reply) => {
  return findConnectorByWebhook(req.query.webhook_url)
    .then(id=>id,()=>connectorCreate({userId:req.auth.credentials.id,connectorUrl:req.query.webhook_url}))
    .done(()=>reply.redirect("/home"))
}

Activities.sendConnectorMessage = (req,reply) => {
  console.log(req.payload.message)
  return findConnectorByUserId(req.auth.credentials.id)
    .then(connector => XhrJson({url:connector.connectorUrl, method:'POST', data:req.payload.message}))
    .then(data=>reply(data))
    .catch(e=>{
      console.log(e)
      reply(e)
    })

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