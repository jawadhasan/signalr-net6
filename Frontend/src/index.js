import 'regenerator-runtime/runtime'

import 'bootstrap'
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.css";
import './resources/bootstrap.pulse.min';

import React from "react";
import ReactDOM from "react-dom/client";
import App from './app';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);