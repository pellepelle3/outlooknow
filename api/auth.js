'use strict'
const Boom = require('boom') 
const Promise = require('promise')
const db = require('./db')
let Auth = {}

module.exports = Auth

Auth.office = (req, reply) => {
  if (!req.auth.isAuthenticated) return reply.redirect('/login')

  return userFindByEmail(req.auth.credentials.profile.email)
    .then(user=>{
      return userUpdateAuthData(user.id, req.auth.credentials)
    },e => {
      let name = req.auth.credentials.profile.displayName.split(' ')
      let user = { 
        email: req.auth.credentials.profile.email, 
        firstName: name[0], 
        lastName: name.length > 1 ? name[1]: '', 
        phoneNumber: '',
        note: '', 
        authMethod: req.auth.credentials.provider, 
        authData: req.auth.credentials
      }
      return userCreate(user)
    })
    .done(user=>{
      const sid = db.guid()
      return req.server.app.cache.set(sid, { account: user }, 0, (err) => {
        if (err) console.error(err)
        req.cookieAuth.set({ sid: sid })
        return reply.redirect('/home')
      })
    })
}

Auth.login = (req, reply) => {

  return reply("<html><body><a href='/auth/office'>Login to office</a></body></html>")
}

Auth.home = (req, reply) => {
  let user = req.auth.credentials
  let hasConnector
  return findConnectorByUserId(user.id)
  .then(()=>hasConnector=true,()=>hasConnector=false)
  .done(()=>reply(`
    <html>
      <body>
        <a href='/logout'>logout</a>
        <h1>Hello ${user.firstName} ${user.lastName}</h1>
        <h2>${user.email}</h2>
        <p>
        ${hasConnector? '':'<a href="https://outlook.office.com/connectors/Connect?state=myAppsState&app_id=678d64a4-9d28-4563-bb7a-ae422f23d9ce&callback_url=http://localhost:8888/activities/connector"><img src="https://o365connectors.blob.core.windows.net/images/ConnectToO365Button.png" alt="Connect to Office 365"></img></a>'}
        </p>
      </body>
    </html>
  `))
}

Auth.logout = (req, reply) => {
  req.cookieAuth.clear()
  return reply('ok')
}

function userFindByEmail(email) {
  return db.pg.one('SELECT id, email, first_name, last_name, phone_number, created_on, note, auth_data FROM users WHERE email = ${email}', { email })
    .then(userAccount => db.underscoreToCamel(userAccount))
}

function findConnectorByUserId(id) {
  return db.pg.one('SELECT id FROM outlook_connectors WHERE user_id = ${id}', { id })
}

function userUpdateAuthData(userId,authData) {
   return db.pg.one('UPDATE users SET auth_data = ${auth_data} WHERE id = ${id} RETURNING id, email, first_name , last_name, phone_number, created_on, note, auth_method, auth_data', db.camelToUnderscore({id:userId,authData}))
  .then(userAccount => db.underscoreToCamel(userAccount))
}

function userCreate(user) {
  return db.pg.one('INSERT INTO users (email, first_name, last_name, phone_number, note, auth_method, auth_data) VALUES ( ${email}, ${first_name}, ${last_name}, ${phone_number}, ${note}, ${auth_method}, ${auth_data}) RETURNING id, email, first_name , last_name, phone_number, created_on, note, auth_method, auth_data', db.camelToUnderscore(user))
  .then(userAccount => db.underscoreToCamel(userAccount))
}
