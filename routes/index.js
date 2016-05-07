'use strict'
var routes = []
var _routes = [
	require('./health'),
	require('./api')
]

_routes.forEach(function(_route) {

	if (typeof _route === 'object' && _route.length)
		_route.forEach(function(_r) { 
			routes.push(_r)
		})
	else if (typeof _route === 'object')
		routes.push(_route)
})

module.exports = routes