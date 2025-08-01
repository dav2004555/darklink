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
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>{isLogin ? "Вход" : "Регистрация"}</h2>
      <input
        placeholder="Имя пользователя"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <br />
      <input
        placeholder="Пароль"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <br />
      <button onClick={submit}>{isLogin ? "Войти" : "Зарегистрироваться"}</button>
      <br />
      <button onClick={() => { setIsLogin(!isLogin); setError(""); }}>
        {isLogin ? "Нет аккаунта? Зарегистрироваться" : "Есть аккаунт? Войти"}
      </button>
      <div style={{ color: "red" }}>{error}</div>
    </div>
  );
}