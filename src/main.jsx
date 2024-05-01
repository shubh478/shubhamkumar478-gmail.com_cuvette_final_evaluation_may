import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "@fontsource/dm-sans/300.css"; // Light
import "@fontsource/dm-sans/400.css"; // Regular
import "@fontsource/dm-sans/500.css"; // Medium
import "@fontsource/dm-sans/600.css"; // Semi-bold
import "@fontsource/dm-sans/700.css"; // Bold
import "@fontsource/dm-sans/800.css"; // Extra-bold
import "@fontsource/dm-sans/900.css"; // Black

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
