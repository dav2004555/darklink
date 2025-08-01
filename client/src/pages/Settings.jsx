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
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Настройки</h2>
      <button onClick={logout} style={{ backgroundColor: "#f00", color: "#fff" }}>Выйти</button>
    </div>
  );
}