import Header from '../components/Header'
import React from "react";
export default function Home() {
  

  return (
    <React.Fragment>
      <Header/>
      <div className="jumbotron jumbotron-odi-hero bg-primary">
        <div className="jumbotron-overlay ">
            <div className="container jumbotron-padding  text-center">
            <h1 className="display-4">Welcome to Holypics</h1>
              <p>
                  <a href="/test" className="btn btn-lg btn-success btn-circle my-4 mr-3">Test It</a>
              </p>
            </div>
          </div>
          
      </div>
    </React.Fragment>
  )
}
