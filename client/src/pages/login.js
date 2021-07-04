import React, { useState, useEffect } from "react";
import keys from "../config/keys";
import logo from "../img/logo.png";
import GoogleLogin from "react-google-login";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { validateEmail } from "../util/validators";
import _ from "lodash";

//style
import "../css/pages/landing.css";

import { googleAuth, login } from "../actions/index";

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { errorMessage, isAuthenticated, loading } = useSelector((state) => state.auth);
  const uiLoading = useSelector((state) => state.ui.loading);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState({ email: "", password: "", general: "" });

  useEffect(() => {
    if (isAuthenticated && !loading && !errorMessage) history.push("/");

    if (errorMessage) setFormError({ ...formError, ...errorMessage });
    else if (!errorMessage) setFormError({ ...formError, general: "" });
  }, [isAuthenticated, loading, errorMessage]);

  const onGoogle = (res) => {
    dispatch(googleAuth(res.accessToken));
  };

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formError.email && !formError.password) dispatch(login(formData));
  };

  const handleFocusOut = (e) => {
    //debugger;
    if (e.target.name === "email") {
      let error = validateEmail(e.target.value);
      if (!_.isEmpty(error)) setFormError({ ...formError, ...error });
      else setFormError({ ...formError, email: "" });
    }

    if (e.target.name === "password") {
      if (!e.target.value) setFormError({ ...formError, password: "Password can't be empty!" });
      else setFormError({ ...formError, password: "" });
    }
  };
  return (
    <div className="landing-container">
      <div className="start-container" style={{ display: "flex", flexDirection: "column" }}>
        <img src={logo} alt="Logo" className="landing-logo" />

        <div className="login-form-wrapper" style={{ display: "flex", flexDirection: "column" }}>
          {formError.general && <span>{formError.general}</span>}
          <label>E-mail</label>
          <input
            type="text"
            id="login-email-input"
            name="email"
            value={formData.email}
            onChange={handleOnChange}
            onBlur={handleFocusOut}
          />
          {formError.email && <span>{formError.email}</span>}
          <label>Password</label>
          <input
            type="password"
            id="login-password-input"
            name="password"
            value={formData.password}
            onChange={handleOnChange}
            onBlur={handleFocusOut}
          />
          {formError.password && <span>{formError.password}</span>}
          {!uiLoading ? <button onClick={handleSubmit}>Giriş Yap</button> : <span>Loading</span>}
        </div>

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
          onSuccess={onGoogle}
          onFailure={onGoogle}
          className="btn btn-outline-danger"
        />
      </div>
    </div>
  );
};

export default Login;
