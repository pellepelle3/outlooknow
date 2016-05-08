'use strict'
const LSQ = require('lsq')
const Promise = require('promise')
const Pg = require('pg-promise')
const Request = require('request-promise')

let db = {
  Pg,
  camelToUnderscore,
  underscoreToCamel,
  guid,
  outlookRequest
}
let subscibedTo = []

LSQ.config.get()
  .done(c => {
    db.config = c
    let pgConnect = "postgres://"+c.postgress.user+":"+c.postgress.pass+"@"+c.postgress.host+"/"+c.postgress.db
    db.pg = Pg({promiseLib: Promise})(pgConnect)
  })


function underscoreToCamel(data){
  let isArray
  if(data.constructor !== Array){
    isArray = true
    data = [data]
  }

  data = data.map(item => {
    let obj = {}      
    Object.keys(item).map(key => obj[key.replace(/(\_[a-z])/g, val => val.toUpperCase().replace('_',''))] = item[key])
    return obj
  })

  return isArray ? data[0] : data
}

function camelToUnderscore(data){
  let isArray
  if(data.constructor !== Array){
    isArray = true
    data = [data]
  }

  data = data.map(item => {
    let obj = {}      
    Object.keys(item).map(key => obj[key.replace(/([A-Z])/g, val => "_"+val.toLowerCase() )] = item[key])
    return obj    
  })

  return isArray ? data[0] : data
}

function outlookRequest(options) {
  return Request({ 
    method: options.method,
    url: `https://outlook.office.com/api/beta/Me/${options.path}`,
    headers: 
     { Accept: 'application/json',
       'User-Agent': 'node-outlook/2.0',
       'client-request-id': guid(),
       'return-client-request-id': 'true',
       'X-Anchor-Mailbox': options.email },
    auth: { bearer: options.token },
    json: options.json || true,
    qs: options.query || {} })
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

module.exports = db