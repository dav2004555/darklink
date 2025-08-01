import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/login`, { username, password });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", username);
        navigate("/contacts");
      } else {
        await axios.post(`${API_URL}/register`, { username, password });
        setIsLogin(true);
        setError("Регистрация прошла успешно, войдите");
      }
    } catch (e) {
      setError(e.response?.data?.error || "Ошибка");
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "auto",
        padding: "2rem",
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "monospace",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        {isLogin ? "Вход" : "Регистрация"}
      </h2>
      <input
        placeholder="Имя пользователя"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
          padding: "0.75rem",
          marginBottom: "1rem",
          width: "100%",
          fontFamily: "monospace",
        }}
      />
      <input
        placeholder="Пароль"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
          padding: "0.75rem",
          marginBottom: "1rem",
          width: "100%",
          fontFamily: "monospace",
        }}
      />
      <button
        onClick={submit}
        style={{
          background: "#fff",
          color: "#000",
          border: "none",
          padding: "0.75rem",
          marginBottom: "1rem",
          cursor: "pointer",
          fontWeight: "bold",
          fontFamily: "monospace",
        }}
      >
        {isLogin ? "Войти" : "Зарегистрироваться"}
      </button>
      <button
        onClick={() => {
          setIsLogin(!isLogin);
          setError("");
        }}
        style={{
          background: "none",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          textDecoration: "underline",
          fontFamily: "monospace",
        }}
      >
        {isLogin ? "Нет аккаунта? Зарегистрироваться" : "Есть аккаунт? Войти"}
      </button>
      {error && (
        <div style={{ color: "#f55", marginTop: "1rem", fontFamily: "monospace" }}>
          {error}
        </div>
      )}
    </div>
  );
}