import { useState } from "react";
import "./App.css";
import { Button } from "./components/ui/Button";
import LoginPage from "./LoginPage";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
