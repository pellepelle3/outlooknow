var HapiSwagger = require('hapi-swagger')
var Hapi =require('hapi')
var Inert = require('inert')
var Vision = require('vision')
var routes = require('./routes')
var pack = require('./package.json')

var swaggerOptions = {
  apiVersion: pack.version
  ,documentationPath: '/'
  ,enableDocumentationPage: true
  ,endpoint:'/_docs'
  ,info: {
    title: pack.name,
    description: pack.description
  }
}

var server = new Hapi.Server()

server.connection({ 
  port: process.env.PORT || 3000,
  labels:['tcp']
})

server.register([
  Inert,
  Vision,
  {
    register:HapiSwagger
   ,options:swaggerOptions
  }
  ], start)

function start() {

  server.start( function(err) {
    if (err) throw err
    routes.forEach( function(route) {
       server.route(route)
     })
    console.log('Server running at:', server.info.uri)
  })
}
