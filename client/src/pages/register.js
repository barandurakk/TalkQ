import React, { useEffect, useState } from "react";
import GoogleLogin from "react-google-login";
import keys from "../config/keys";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  validateEmail,
  validateName,
  validatePassword,
  validateRegister,
} from "../util/validators";
import { googleAuth, register } from "../actions/index";
import _ from "lodash";

const Register = () => {
  const [formData, setFormData] = useState({ email: "", password: "", rePassword: "", name: "" });
  const [formError, setFormError] = useState({ email: "", password: "", rePassword: "", name: "" });
  const { isAuthenticated, loading, errorMessage } = useSelector((state) => state.auth);
  const history = useHistory();

  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuthenticated && !loading && !errorMessage) history.push("/");

    if (errorMessage) setFormError({ ...formError, ...errorMessage });
    else if (!errorMessage) setFormError({ ...formError, general: "" });
  }, [isAuthenticated, loading, errorMessage]);

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocusOut = (e) => {
    if (e.target.name === "email") {
      let error = validateEmail(e.target.value);
      if (!_.isEmpty(error)) setFormError({ ...formError, ...error });
      else setFormError({ ...formError, email: "" });
    }

    if (e.target.name === "name") {
      let error = validateName(e.target.value);
      if (!_.isEmpty(error)) setFormError({ ...formError, ...error });
      else setFormError({ ...formError, name: "" });
    }

    if (e.target.name === "password" || e.target.name === "rePassword") {
      let error = validatePassword(e.target.value);
      if (!_.isEmpty(error)) setFormError({ ...formError, [e.target.name]: error.password });
      else if (e.target.value !== formData.rePassword || e.target.value !== formData.password)
        setFormError({ ...formError, [e.target.name]: "Passwords don't match!" });
      else setFormError({ ...formError, password: "", rePassword: "" });
    }
  };

  const handleSubmit = () => {
    let error = validateRegister(formData);
    if (!_.isEmpty(error)) {
      setFormError({ ...formError, ...error });
    } else {
      dispatch(register(formData));
    }
  };

  const onGoogle = (res) => {
    dispatch(googleAuth(res.accessToken));
  };

  return (
    <div
      className="register-container"
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2A3032",
      }}
    >
      <div className="register-wrapper" style={{ width: 300 }}>
        <div className="register-form-wrapper" style={{ display: "flex", flexDirection: "column" }}>
          {formError.general && <span>{formError.general}</span>}
          <label>E-mail</label>
          <input
            type="text"
            id="register-email-input"
            name="email"
            value={formData.email}
            onChange={handleOnChange}
            onBlur={handleFocusOut}
          />
          {formError.email && <span>{formError.email}</span>}
          <label>Name</label>
          <input
            type="text"
            id="register-name-input"
            name="name"
            value={formData.name}
            onChange={handleOnChange}
            onBlur={handleFocusOut}
          />
          {formError.name && <span>{formError.name}</span>}
          <label>Password</label>
          <input
            type="password"
            id="register-password-input"
            name="password"
            value={formData.password}
            onChange={handleOnChange}
            onBlur={handleFocusOut}
          />
          {formError.password && <span>{formError.password}</span>}
          <label>Re Password</label>
          <input
            type="password"
            id="register-rePassword-input"
            name="rePassword"
            value={formData.rePassword}
            onChange={handleOnChange}
            onBlur={handleFocusOut}
          />
          {formError.rePassword && <span>{formError.rePassword}</span>}
          <button id="register-submit-button" onClick={handleSubmit}>
            Sign Up
          </button>
          <GoogleLogin
            clientId={keys.googleClientID}
            prompt="select_account"
            render={(renderProps) => (
              <button
                className="btn btn-danger"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                Google ile üye olun
              </button>
            )}
            onSuccess={onGoogle}
            onFailure={onGoogle}
            className="btn btn-outline-danger"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
