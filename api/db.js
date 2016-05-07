'use strict'
const LSQ = require('lsq')
const Promise = require('promise')
const Pg = require('pg-promise')


let db = {
  Pg,
  camelToUnderscore,
  underscoreToCamel
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

module.exports = db