import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import "./index.css";

console.log("API URL is", import.meta.env.VITE_API_URL)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);