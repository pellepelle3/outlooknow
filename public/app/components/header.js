import React, {Component} 	from 'react'
import {PropTypes, Link}    from 'react-router'

class Header extends Component {
  constructor(props){
	super(props)

  }
  render() {
	return (
	  <header id="main-header">		
		<div className="logo-area">Outlook now logo</div>        
		<a>Connect</a>
	  </header>
	)
  }
}

Header.contextTypes = { router: React.PropTypes.object }
export default Header
