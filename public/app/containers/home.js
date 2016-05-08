import React, {Component}   from 'react'
import Request from 'request'

const HOST = window.location.origin

class Home extends Component {
  constructor(Props) {
    super(Props)        
    this._requestUser()
  }

  _requestUser(){
    let options = {
      url: HOST + '/auth/user',
      method: "GET"
    }
    Request(options, (error, response, body) => {
      if (error || response.statusCode != 200) {
        return console.error( new Error(error) )
      }
      console.log( JSON.parse(body) )
    }, console.error)
  }


  _onConnectClick(){
    window.location.href = 'https://outlook.office.com/connectors/Connect?state=myAppsState&app_id=678d64a4-9d28-4563-bb7a-ae422f23d9ce&callback_url=http://localhost:8888/activities/connector'
  }

  render(){  
    return (
      <section className="landing">
        <div id="hero">
          <div className="center">
            <h1>One last step!</h1>
            <h2> To finish the connection we will need your to add Now to your Connectors.</h2>
            <button className="cta" onClick={this._onConnectClick}> </button>

          </div>
        </div>        
      </section>
    )
  }
}

export default Home
