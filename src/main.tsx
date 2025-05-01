import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; //目前的主要 css file
import App from "./app/App";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
