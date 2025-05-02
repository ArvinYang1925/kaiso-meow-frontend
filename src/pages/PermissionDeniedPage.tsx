import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PermissionDeniedPage: React.FC = () => {
  const [noPermissionMessage] = useState("您無查看此頁面的權限");
  const navigate = useNavigate();
  return (
    <div className="" style={styles.container}>
      <h1 style={styles.title}>Oops!</h1>
      <p className="mb-8" style={styles.message}>
        {noPermissionMessage}
      </p>
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
    backgroundColor: "#fef3c7",
    borderRadius: "8px",
    margin: "2rem auto",
    maxWidth: "600px",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "1rem",
    color: "#b45309",
  },
  message: {
    fontSize: "1.25rem",
    color: "#92400e",
  },
};

export default PermissionDeniedPage;
