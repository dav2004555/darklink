import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Для предотвращения дергания экрана на мобилках при фокусе
  useEffect(() => {
    // Запрет масштабирования при фокусе input в мобильных браузерах
    const metaViewport = document.querySelector('meta[name=viewport]');
    if (!metaViewport) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
      document.head.appendChild(meta);
    } else {
      metaViewport.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
    }
  }, []);

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
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#eee",
        fontFamily: "'Source Code Pro', monospace",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 360,
          width: "100%",
          padding: "1rem",
          boxSizing: "border-box",
          borderRadius: 8,
          backgroundColor: "#111",
          boxShadow: "0 0 10px rgba(0,255,0,0.2)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            userSelect: "none",
            fontWeight: "700",
            fontSize: "1.8rem",
          }}
        >
          {isLogin ? "Вход" : "Регистрация"}
        </h2>

        <input
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value.trimStart())} // не даём вводить пробелы в начале
          style={{
            background: "#111",
            color: "#eee",
            border: "1px solid #444",
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            width: "100%",
            fontFamily: "'Source Code Pro', monospace",
            borderRadius: 6,
            fontSize: "1rem",
            boxSizing: "border-box",
            caretColor: "#0f0",
            transition: "border-color 0.3s",
          }}
          autoComplete="username"
          spellCheck={false}
          onFocus={(e) => (e.target.style.borderColor = "#0f0")}
          onBlur={(e) => (e.target.style.borderColor = "#444")}
        />

        <input
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            background: "#111",
            color: "#eee",
            border: "1px solid #444",
            padding: "0.75rem 1rem",
            marginBottom: "1.5rem",
            width: "100%",
            fontFamily: "'Source Code Pro', monospace",
            borderRadius: 6,
            fontSize: "1rem",
            boxSizing: "border-box",
            caretColor: "#0f0",
            transition: "border-color 0.3s",
          }}
          autoComplete="current-password"
          spellCheck={false}
          onFocus={(e) => (e.target.style.borderColor = "#0f0")}
          onBlur={(e) => (e.target.style.borderColor = "#444")}
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
            borderRadius: 6,
            fontFamily: "'Source Code Pro', monospace",
            marginBottom: "1rem",
            fontSize: "1.1rem",
            transition: "background-color 0.3s",
            userSelect: "none",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0c0")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0f0")}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          type="button"
        >
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </button>

        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
            setUsername("");
            setPassword("");
          }}
          style={{
            background: "none",
            color: "#eee",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
            fontFamily: "'Source Code Pro', monospace",
            width: "100%",
            padding: "0",
            userSelect: "none",
            fontSize: "0.9rem",
          }}
          type="button"
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
              userSelect: "none",
              minHeight: "1.4rem",
              lineHeight: "1.4rem",
            }}
            aria-live="polite"
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}