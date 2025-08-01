import React from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/auth");
  };

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "monospace",
        height: "100vh",
        width: "100vw",
        padding: "2rem",
        boxSizing: "border-box",
        maxWidth: 400,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <h2 style={{ marginBottom: "2rem", userSelect: "none" }}>Настройки</h2>
      <button
        onClick={logout}
        style={{
          backgroundColor: "#e03e3e",
          border: "none",
          borderRadius: 5,
          padding: "10px 20px",
          color: "#fff",
          fontFamily: "monospace",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: "pointer",
          transition: "background-color 0.2s",
          userSelect: "none",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c22f2f")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e03e3e")}
      >
        Выйти
      </button>
    </div>
  );
}