import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; //目前的主要 css file
import App from "./app/App";
import { HashRouter, BrowserRouter } from "react-router-dom";
import "./assets/scss/all.scss";

//開發環境使用 BrowserRouter，正式環境用 HashRouter
const isProd = import.meta.env.MODE === "production";
const Router = isProd ? HashRouter : BrowserRouter;

console.log('log for router, isProd:',isProd)
console.log("VITE_API_BASE_URL in main.tsx:", import.meta.env.VITE_API_BASE_URL)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
