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
        height: "100vh",
        backgroundColor: "#000",
        color: "#eee",
        fontFamily: "'Source Code Pro', monospace",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 1rem",
      }}
    >
      <div style={{ maxWidth: 360, width: "100%" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
          {isLogin ? "Вход" : "Регистрация"}
        </h2>
        <input
          placeholder="Имя пользователя"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{
            background: "#111",
            color: "#eee",
            border: "1px solid #444",
            padding: "0.75rem",
            marginBottom: "1rem",
            width: "100%",
            fontFamily: "'Source Code Pro', monospace",
            borderRadius: 4,
          }}
          autoComplete="username"
        />
        <input
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            background: "#111",
            color: "#eee",
            border: "1px solid #444",
            padding: "0.75rem",
            marginBottom: "1.5rem",
            width: "100%",
            fontFamily: "'Source Code Pro', monospace",
            borderRadius: 4,
          }}
          autoComplete="current-password"
        />
        <button
          onClick={submit}
          style={{
            backgroundColor: "#0f0",
            color: "#000",
            border: "none",
            padding: "0.75rem",
            width: "100%",
            fontWeight: "700",
            cursor: "pointer",
            borderRadius: 4,
            fontFamily: "'Source Code Pro', monospace",
            marginBottom: "1rem",
            transition: "background-color 0.3s",
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = "#0c0")}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = "#0f0")}
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
            color: "#eee",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
            fontFamily: "'Source Code Pro', monospace",
            width: "100%",
          }}
        >
          {isLogin ? "Нет аккаунта? Зарегистрироваться" : "Есть аккаунт? Войти"}
        </button>
        {error && (
          <div
            style={{
              color: "#f55",
              marginTop: "1.5rem",
              fontFamily: "'Source Code Pro', monospace",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}