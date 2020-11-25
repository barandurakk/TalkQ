import React from "react";
import googlepic from "../img/signWGoogle.png"
import logo from "../img/logo.png"

//style
import "../css/pages/landing.css"

class Landing extends React.Component {
  render() {
    return <div className="landing-container">
      
      <div className="start-container">
        <div className="start-wrapper">
          <img src={logo} alt="Logo" className="landing-logo" />
      <p className="landing-header">Sign in and start <strong>chatting!</strong></p>
      <a href="/auth/google" className="google-img-wrapper"><img src={googlepic} alt="GoogleSignIn" className="google-img" /></a>
      </div>
      </div>
      
      </div>;
  }
}

export default Landing;
