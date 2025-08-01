import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState("");
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Получить контакты
  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${API_URL}/contacts`, {
        headers: { Authorization: "Bearer " + token },
      });
      const data = res.data;
      const list = Array.isArray(data) ? data : data.contacts;
      setContacts(list || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Поиск пользователя по юзернейму
  const searchUser = async () => {
    setError("");
    setSearchResult(null);
    try {
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: "Bearer " + token },
      });
      const user = res.data.find((u) => u.username === search);
      if (!user) {
        setError("Пользователь не найден");
      } else if (user.username === username) {
        setError("Это вы сами");
      } else {
        setSearchResult(user);
      }
    } catch (e) {
      setError("Ошибка поиска");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "monospace",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Контакты</h2>

      <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Поиск по имени пользователя"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 400,
            padding: "8px 12px",
            fontFamily: "monospace",
            fontSize: "1rem",
            borderRadius: 5,
            border: "1px solid #444",
            backgroundColor: "#111",
            color: "#eee",
          }}
          onKeyDown={(e) => e.key === "Enter" && searchUser()}
        />
        <button
          onClick={searchUser}
          style={{
            marginTop: 10,
            padding: "8px 20px",
            backgroundColor: "#222",
            color: "#fff",
            fontFamily: "monospace",
            border: "1px solid #444",
            borderRadius: 5,
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#222")}
        >
          Найти
        </button>
      </div>

      {error && (
        <div style={{ color: "#ff4c4c", marginBottom: "1rem", textAlign: "center" }}>
          {error}
        </div>
      )}

      {searchResult && (
        <div
          onClick={() => navigate(`/chat/${searchResult.username}`)}
          style={{
            cursor: "pointer",
            padding: "12px",
            borderRadius: 5,
            border: "1px solid #444",
            maxWidth: 400,
            margin: "auto",
            backgroundColor: "#111",
            textAlign: "center",
            userSelect: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#222")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#111")}
        >
          <b>{searchResult.username}</b>
        </div>
      )}

      <ul style={{ listStyle: "none", paddingLeft: 0, maxWidth: 400, margin: "2rem auto 0 auto" }}>
        {contacts.map((contact) => (
          <li
            key={contact}
            onClick={() => navigate(`/chat/${contact}`)}
            style={{
              padding: "10px",
              borderBottom: "1px solid #333",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#111")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {contact}
          </li>
        ))}
      </ul>
    </div>
  );
}