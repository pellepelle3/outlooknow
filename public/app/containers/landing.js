import React, {Component}   from 'react'

class LandingContainer extends Component {
  constructor(Props) {
    super(Props)        
  }


  _onLoginClick(){
    window.location.href = '/auth/office'
  }

  render(){  
    return (
      <section className="landing">
        <div id="hero">
          
          <div className="center-wrap">
            <div className="center">
              <h1>Take control over your Outlook inbox.</h1>
              <h2>Let Now find key information such as movie tickets, boarding passes, and tracking numbers and stream them to you on Outlook Connector.</h2>
              <button className="cta" onClick={this._onLoginClick}> Login to get started</button>
            </div>
          </div>
        </div>        
      </section>
    )
  }
}

export default LandingContainer
