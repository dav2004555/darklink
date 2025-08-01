import React from "react";
import { NavLink } from "react-router-dom";

export default function BottomNav() {
  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: 50,
      backgroundColor: "#000",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      color: "#eee",
      fontWeight: "700",
      fontFamily: "'Source Code Pro', monospace",
      borderTop: "1px solid #222",
      zIndex: 1000,
      userSelect: "none",
      letterSpacing: "0.05em"
    }}>
      {["Чаты", "Контакты", "Настройки"].map((label, idx) => {
        const path = label === "Чаты" ? "/chats" : label === "Контакты" ? "/contacts" : "/settings";
        return (
          <NavLink
            key={idx}
            to={path}
            style={({ isActive }) => ({
              color: isActive ? "#0f0" : "#555",
              textDecoration: "none",
              fontWeight: isActive ? "900" : "700",
              borderBottom: isActive ? "2px solid #0f0" : "2px solid transparent",
              paddingBottom: 6,
              transition: "color 0.2s, border-bottom 0.2s"
            })}
          >
            {label}
          </NavLink>
        );
      })}
    </nav>
  );
}