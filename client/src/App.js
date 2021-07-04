import React from "react";
import { Router, Route } from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";
import SnackbarProvider from "react-simple-snackbar";
import jwtDecode from "jwt-decode";
import { SET_AUTHENTICATED } from "./actions/types";
import { fetchUser } from "./actions/index";
import axios from "axios";

//components

import Login from "./pages/login.js";
import Panel from "./pages/panel.js";
import Register from "./pages/register";

export const history = createBrowserHistory();
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5000";

class App extends React.Component {
  UNSAFE_componentWillMount() {
    const token = localStorage.getItem("JwtToken");
    const { store } = this.props;

    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        // store.dispatch(logoutUser());
      } else {
        store.dispatch({ type: SET_AUTHENTICATED });
        axios.defaults.headers.common["Authorization"] = localStorage.getItem("JwtToken");
        store.dispatch(fetchUser());
      }
    }
  }

  render() {
    return (
      <SnackbarProvider>
        <Router history={history}>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/" component={Panel} />
        </Router>
      </SnackbarProvider>
    );
  }
}

export default App;
