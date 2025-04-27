// import { useState } from "react";
import "./App.css";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import RegisterPage from "./RegisterPage";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/layout/Header";

function App() {
  return (
    <>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
