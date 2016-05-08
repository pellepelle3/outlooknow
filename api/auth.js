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
      return user
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
      const sid = guid()
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
  return reply(`
    <html>
      <body>
        <a href='/logout'>logout</a>
        <h1>Hello ${user.firstName} ${user.lastName}</h1>
        <h2>${user.email}</h2>
      </body>
    </html>
  `)
}

Auth.logout = (req, reply) => {
  req.cookieAuth.clear()
  return reply('ok')
}

function userFindByEmail(email) {
  return db.pg.one('SELECT id, email, first_name, last_name, phone_number, created_on, note, auth_data FROM users WHERE email = ${email}', { email })
    .then(userAccount => db.underscoreToCamel(userAccount))
}

function userCreate(user) {
  return db.pg.one('INSERT INTO users (email, first_name, last_name, phone_number, note, auth_method, auth_data) VALUES ( ${email}, ${first_name}, ${last_name}, ${phone_number}, ${note}, ${auth_method}, ${auth_data}) RETURNING id, email, first_name , last_name, phone_number, created_on, note, auth_method, auth_data', db.camelToUnderscore(user))
  .then(userAccount => db.underscoreToCamel(userAccount))
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}