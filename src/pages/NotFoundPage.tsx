import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const [notFoundMessage] = useState("無此頁面！");
  const navigate = useNavigate();
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Oops!</h1>
      <p className="mb-8" style={styles.message}>{notFoundMessage}</p>
      <button
        className="text-white bg-orange-600 border-none"
        onClick={() => navigate("/")}
      >
        回到首頁
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    textAlign: "center" as const,
    backgroundColor: "#fee2e2",
    borderRadius: "8px",
    margin: "2rem auto",
    maxWidth: "600px",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "1rem",
    color: "#b91c1c",
  },
  message: {
    fontSize: "1.25rem",
    color: "#991b1b",
  },
};

export default NotFoundPage;
