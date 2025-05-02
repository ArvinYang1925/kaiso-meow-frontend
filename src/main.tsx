import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; //目前的主要 css file
import App from "./app/App";
import { HashRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
