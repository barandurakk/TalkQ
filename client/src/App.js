import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";

//components

import Landing from "./pages/landing.js";
import Panel from "./pages/panel.js";

export const history = createBrowserHistory();

class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Route exact path="/" component={Landing} />
        <Route exact path="/panel" component={Panel} />
      </Router>
    );
  }
}

export default App;
