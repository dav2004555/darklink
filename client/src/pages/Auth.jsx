import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
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
        backgroundColor: "#0b0b0b",
        color: "#f2f2f2",
        fontFamily: "'Source Code Pro', monospace",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        boxSizing: "border-box",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#111",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 0 20px rgba(255,255,255,0.05)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            fontWeight: "bold",
            fontSize: "1.6rem",
            letterSpacing: "1px",
          }}
        >
          {isLogin ? "Вход" : "Регистрация"}
        </h2>

        <input
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value.trimStart())}
          autoComplete="username"
          spellCheck={false}
          style={inputStyle}
        />

        <input
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          spellCheck={false}
          style={{ ...inputStyle, marginBottom: "1.5rem" }}
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.03 }}
          onClick={submit}
          style={buttonStyle}
        >
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </motion.button>

        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
            setUsername("");
            setPassword("");
          }}
          style={{
            background: "none",
            border: "none",
            color: "#aaa",
            textDecoration: "underline",
            cursor: "pointer",
            width: "100%",
            padding: "0.5rem 0",
            fontSize: "0.9rem",
            fontFamily: "'Source Code Pro', monospace",
          }}
        >
          {isLogin ? "Нет аккаунта? Зарегистрироваться" : "Есть аккаунт? Войти"}
        </button>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{
                color: "#f55",
                textAlign: "center",
                marginTop: "1rem",
                minHeight: "1.4rem",
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "0.5rem",
  border: "1px solid #333",
  background: "#181818",
  color: "#f2f2f2",
  marginBottom: "1rem",
  fontSize: "1rem",
  fontFamily: "'Source Code Pro', monospace",
  outline: "none",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "0.9rem 1rem",
  borderRadius: "0.5rem",
  border: "none",
  background: "#333",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1.1rem",
  cursor: "pointer",
  fontFamily: "'Source Code Pro', monospace",
};