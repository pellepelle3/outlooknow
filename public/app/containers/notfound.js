import React from 'react'
import {Link} from 'react-router'

class NotFound extends React.Component {  
	constructor() {
		super()
	}
	
	render(){
		return (
			<section>
				<div className="page-not-found">
					<h1>The page you are looking for does not exist.</h1>
					<Link to="/">Take me back to the homepage.</Link>
				</div>
			</section>
		)
	}
}

export default NotFound