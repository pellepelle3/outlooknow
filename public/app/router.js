import React from 'react'
import { render } from 'react-dom'
import { Router, useRouterHistory, hashHistory, Route, IndexRoute, Redirect } from 'react-router'
import { createHistory, createHashHistory, useBasename } from 'history'

import App from './app'
import Landing from './containers/landing'
import Home from './containers/home'
import NotFound from './containers/notfound'

const history = useRouterHistory(createHistory)({
  basename: '/'
})

const routes = (
	<Route component={App} path="/">
		<IndexRoute component={Landing} />
		<Route path="home" component={Home} />
		<Route path="*" component={NotFound} />
	</Route>
)

render(
	<Router history={history} routes={routes} />,
 	document.getElementById("now") 
)