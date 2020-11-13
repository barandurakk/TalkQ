import React from "react";
import { Router, Route } from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";
import SnackbarProvider from "react-simple-snackbar";

//components

import Landing from "./pages/landing.js";
import Panel from "./pages/panel.js";

export const history = createBrowserHistory();

class App extends React.Component {
  render() {
    return (
      <SnackbarProvider>
      <Router history={history}>
        <Route exact path="/" component={Landing} />
        <Route exact path="/panel" component={Panel} />
      </Router>
      </SnackbarProvider>
    );
  }
}

export default App;
