import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Normalize } from "styled-normalize";
import store from "./store/store";
import { Provider } from "react-redux";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Normalize />
      <App />
    </Provider>
  </React.StrictMode>
);
