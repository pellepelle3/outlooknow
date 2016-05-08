'use strict'
let HapiSwagger = require('hapi-swagger')
let Hapi =require('hapi')
let Inert = require('inert')
let Vision = require('vision')
let HapiAuthCookie = require('hapi-auth-cookie')
let catboxRedis = require('catbox-redis')
let Promise = require('promise')
let Bell = require('bell')
let LSQ = require('lsq')
let routes = require('./routes')
let pack = require('./package.json')
let Relish = require('relish')({ stripQuotes: true })
let Config
let server
let swaggerOptions = {
  apiVersion: pack.version
  ,documentationPath: '/'
  ,enableDocumentationPage: true
  ,endpoint:'/_docs'
  ,info: {
    title: pack.name,
    description: pack.description
  }
}

LSQ.config.get()
.then(c => Config = c)
.then(() => {
  server = new Hapi.Server(
  {
    cache: [
        {
          name: 'redisCache',
          engine: catboxRedis,
          host: Config.redis.host,
          port: Config.redis.port,
          password: Config.redis.pass,
          database: Config.redis.db,
          partition: 'cache'
        }
      ] 
  })
  server.connection({ 
    port: process.env.PORT || 3000,
    labels:['tcp'],
    routes: {
      validate: {
        failAction: Relish.failAction
      }
    }
  })
  
  server.register([
    Inert,
    Vision,
    Bell,
    HapiAuthCookie,
    {
      register:HapiSwagger
     ,options:swaggerOptions
    }
    ], err => {if (err) console.error(err)})

  const cache = server.cache({ 
    cache: 'redisCache',
    segment: 'sessions', 
    expiresIn: 3 * 24 * 60 * 60 * 1000 
  })

  server.app.cache = cache

  server.auth.strategy('office', 'bell', {
        provider: 'office365',
        clientId: Config.officeApp.clientId,
        clientSecret: Config.officeApp.clientSecret,
        password:Config.redis.pass,
        providerParams: {
            response_type: 'code'
        },
        scope: ['https://outlook.office.com/mail.read']
  })
   return 
})
.then(() => server.start(err => {
  if (err) throw err
  console.log('Server running at:', server.info.uri)
  })
)
.done(() => routes.forEach( route => server.route(route) ) )
