import React from "react";
import keys from "../config/keys";
import logo from "../img/logo.png";
import GoogleLogin from "react-google-login";
import { connect } from "react-redux";

//style
import "../css/pages/landing.css";

import { googleAuth } from "../actions/index";

class Login extends React.Component {
  UNSAFE_componentWillMount() {
    if (this.props.isAuth) {
      this.props.history.push("/");
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      if (!this.props.loading && !this.props.errorMessage && this.props.isAuth) {
        this.props.history.push("/"); //push user to the main page
      }
    }
  }

  onGoogle = async (res) => {
    debugger;
    await this.props.googleAuth(res.accessToken);
  };

  render() {
    return (
      <div className="landing-container">
        <div className="start-container">
          <div className="start-wrapper">
            <img src={logo} alt="Logo" className="landing-logo" />

            <GoogleLogin
              clientId={keys.googleClientID}
              prompt="select_account"
              render={(renderProps) => (
                <button
                  className="btn btn-danger"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  Google ile giriş yapın
                </button>
              )}
              onSuccess={this.onGoogle}
              onFailure={this.onGoogle}
              className="btn btn-outline-danger"
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    errorMessage: state.auth.errorMessage,
    loading: state.auth.loading,
    isAuth: state.auth.isAuthenticated,
  };
};

export default connect(mapStateToProps, { googleAuth })(Login);
