'use strict'
const Boom = require('boom') 
const Promise = require('promise')
const db = require('./db')
let User = {}

module.exports = User

User.list = (req, reply) => {
    return userList(req.query.limit,req.query.offset)
    .then(reply)
    .catch(e => {
      console.error(e.message,e, e.stack) 
      switch (e.message || e){
        case 'No data returned from the query.':
          reply(Boom.notFound('User not found'))
          break
        default :
        reply(Boom.badRequest(e))
      }
    })
}

User.get = (req, reply) => {
    return userGet(req.params.id)
    .then(reply)
    .catch(e => {
      console.error(e.message,e, e.stack) 
      switch (e.message || e){
        case 'No data returned from the query.':
          reply(Boom.notFound('User not found'))
          break
        default :
        reply(Boom.badRequest(e))
      }
    })
}

User.infoByEmail = (req, reply) => {
    return userFindByEmail(req.payload.email)
    .then(reply)
    .catch(e => {
      console.error(e.message,e, e.stack) 
      switch (e.message || e){
        case 'No data returned from the query.':
          reply(Boom.notFound('User not found'))
          break
        default :
        reply(Boom.badRequest(e))
      }
    })
}


User.create = (req, reply) => {
  return userCreate(req.payload)
    .then(reply)
    .catch(e => {
      console.error(e.message,e, e.stack) 
      switch (e.message || e){
        case 'No data returned from the query.':
          reply(Boom.badRequest('User not found'))
          break
        default :
        reply(Boom.badRequest(e))
      }
    })
}

User.update = (req, reply) => {
  return userUpdate(req.params.id,req.payload)
    .then(reply)
    .catch(e => {
      console.error(e.message,e, e.stack) 
      switch (e.message || e){
        case 'No data returned from the query.':
          reply(Boom.badRequest('User not found'))
          break
        default :
        reply(Boom.badRequest(e))
      }
    })
}

User.delete = (req, reply) => {
  return userDelete(req.params.id)
    .then(reply)
    .catch(e => {
      console.error(e.message,e, e.stack) 
      switch (e.message || e){
        case 'No data returned from the query.':
          reply(Boom.badRequest('User not found'))
          break
        default :
        reply(Boom.badRequest(e))
      }
    })
}

function userList(limit, offset) {
  return db.pg.any('SELECT id, email, first_name, last_name, phone_number, created_on, note FROM users limit ${limit} offset ${offset}', { limit, offset })
    .then(userAccount => db.underscoreToCamel(userAccount))
}

function userFindByEmail(email) {
  return db.pg.one('SELECT id, email, first_name, last_name, phone_number, created_on, note FROM users WHERE email = ${email}', { email })
    .then(userAccount => db.underscoreToCamel(userAccount))
}

function userGet(id) {
  return db.pg.one('SELECT id, email, first_name, last_name, phone_number, created_on, note FROM users WHERE id = ${id}', { id })
    .then(userAccount => db.underscoreToCamel(userAccount))
}

function userCreate(user) {
  return db.pg.one('INSERT INTO users (email, first_name, last_name, phone_number, note) VALUES ( ${email}, ${first_name}, ${last_name}, ${phone_number}, ${note}) RETURNING id, email, first_name , last_name, phone_number, created_on, note', db.camelToUnderscore(user))
  .then(userAccount => db.underscoreToCamel(userAccount))
}

function userUpdate(userId,changes) {
  changes = changes || {}
  changes.id = userId
  let query = []
  if (typeof changes.phoneNumber === "string") query.push('phone_number = ${phone_number}')
  if (typeof changes.note === "string") query.push('note = ${note}')
  if (typeof changes.firstName === "string") query.push('first_name = ${first_name}')
  if (typeof changes.lastName === "string") query.push('last_name = ${last_name}')
  return db.pg.one('UPDATE users SET '+query.join(', ')+' WHERE id = ${id} RETURNING id, email, first_name , last_name, phone_number, receiver_id, auth_method, email_verified, created_on', db.camelToUnderscore(changes))
  .then(userAccount => db.underscoreToCamel(userAccount))
}


function userDelete(id) {
  return db.pg.one('DELETE FROM users WHERE id = ${id} RETURNING id, email, first_name, last_name, phone_number, created_on, note', db.camelToUnderscore({ id }))
  .then(userAccount => db.underscoreToCamel(userAccount))
}