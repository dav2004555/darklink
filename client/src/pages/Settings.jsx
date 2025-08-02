import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Settings() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/auth");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: "#0a0a0a",
        color: "#ddd",
        fontFamily: "'Inter', monospace",
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
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          marginBottom: "2rem",
          fontWeight: "600",
          fontSize: "1.5rem",
          userSelect: "none",
        }}
      >
        Настройки
      </motion.h2>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={logout}
        style={{
          backgroundColor: "#1c1c1c",
          border: "1px solid #333",
          borderRadius: "12px",
          padding: "12px 28px",
          color: "#f55",
          fontFamily: "'Inter', monospace",
          fontSize: "1rem",
          fontWeight: "500",
          cursor: "pointer",
          transition: "all 0.25s ease",
        }}
      >
        Выйти из аккаунта
      </motion.button>
    </motion.div>
  );
}