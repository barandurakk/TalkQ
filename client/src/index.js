import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.js";
import swDev from "./swDev.js";

//redux
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import reducers from "./reducers";

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
swDev();



