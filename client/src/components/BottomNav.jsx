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
      color: "#fff",
      fontWeight: "bold",
      borderTop: "1px solid #444",
      zIndex: 1000,
    }}>
      <NavLink to="/chats" style={({ isActive }) => ({
        color: isActive ? "#0f0" : "#fff",
        textDecoration: "none"
      })}>Чаты</NavLink>
      <NavLink to="/contacts" style={({ isActive }) => ({
        color: isActive ? "#0f0" : "#fff",
        textDecoration: "none"
      })}>Контакты</NavLink>
      <NavLink to="/settings" style={({ isActive }) => ({
        color: isActive ? "#0f0" : "#fff",
        textDecoration: "none"
      })}>Настройки</NavLink>
    </nav>
  );
}