import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "normalize.css/normalize.css";
import * as serviceWorker from '../serviceWorker'
import store from "./store";
import "./index.css";
import App from "./App.jsx";
console.log(111111);
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
  document.getElementById("root")
);

if('producton' === process.env.NODE_ENV){
  serviceWorker.register()
} else {
  serviceWorker.unregister()
}