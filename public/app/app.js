import React, {Component}          	from 'react'
import {RouterHandeler, PropTypes} 	from 'react-router'

import Header        	from './components/header'
import Footer        	from './components/footer'

class App extends Component {
	constructor() {
		super()				
	}

	render(){		
		return(
			<article>				
				<Header/>
				{React.cloneElement(this.props.children)}
				<Footer/>				
			</article>
		)
	}
}

App.contextTypes = { router: React.PropTypes.object }
export default App