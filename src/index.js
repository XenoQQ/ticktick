import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Normalize } from "styled-normalize";
import store from "./store/store.ts";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <Normalize />
            <App />
        </Provider>
    </React.StrictMode>
);
