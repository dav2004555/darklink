import React from "react";
import { NavLink } from "react-router-dom";

export default function BottomNav() {
  const navItems = [
    { label: "Чаты", path: "/chats" },
    { label: "Контакты", path: "/contacts" },
    { label: "Настройки", path: "/settings" },
  ];

  return (
    <nav
      aria-label="Основная навигация"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "3.5rem",
        backgroundColor: "#0a0a0a",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        fontFamily: "'Source Code Pro', monospace",
        borderTop: "1px solid #222",
        userSelect: "none",
        zIndex: 1000,
        letterSpacing: "0.05em",
        boxShadow: "0 -2px 6px rgba(0, 0, 0, 0.7)",
      }}
    >
      {navItems.map(({ label, path }) => (
        <NavLink
          key={label}
          to={path}
          end
          style={({ isActive }) => ({
            flex: "1 1 0",
            textAlign: "center",
            color: isActive ? "#88cc88" : "#555",
            fontWeight: isActive ? "900" : "700",
            borderBottom: isActive ? "3px solid #88cc88" : "3px solid transparent",
            paddingBottom: "8px",
            fontSize: "1rem",
            textDecoration: "none",
            transition: "color 0.3s ease, border-bottom 0.3s ease",
            cursor: "pointer",
            userSelect: "none",
          })}
          aria-current={({ isActive }) => (isActive ? "page" : undefined)}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}