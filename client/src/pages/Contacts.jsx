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

  const searchUser = async () => {
    if (!search.trim()) return;

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
        color: "#eee",
        fontFamily: "'Source Code Pro', monospace",
        height: "100vh",
        width: "100vw",
        padding: "2rem",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <h2 style={{ marginBottom: "1.5rem", userSelect: "none" }}>Контакты</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          width: "100%",
          maxWidth: 400,
          marginBottom: "1.5rem",
        }}
      >
        <input
          type="text"
          placeholder="Поиск по имени пользователя"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchUser()}
          aria-label="Поиск пользователя по имени"
          style={{
            width: "100%",
            padding: "8px 12px",
            fontFamily: "'Source Code Pro', monospace",
            fontSize: "1rem",
            borderRadius: 5,
            border: "1px solid #444",
            backgroundColor: "#111",
            color: "#eee",
          }}
        />
        <button
          onClick={searchUser}
          aria-label="Найти пользователя"
          style={{
            width: "100%",
            padding: "8px 0",
            backgroundColor: "#222",
            color: "#eee",
            fontFamily: "'Source Code Pro', monospace",
            border: "1px solid #444",
            borderRadius: 5,
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#333")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#222")
          }
        >
          Найти
        </button>
      </div>

      {error && (
        <div
          style={{
            color: "#ff4c4c",
            marginBottom: "1rem",
            textAlign: "center",
            userSelect: "none",
          }}
          role="alert"
        >
          {error}
        </div>
      )}

      {searchResult && (
        <button
          onClick={() => navigate(`/chat/${searchResult.username}`)}
          aria-label={`Перейти в чат с ${searchResult.username}`}
          style={{
            cursor: "pointer",
            padding: "12px",
            borderRadius: 5,
            border: "1px solid #444",
            width: "100%",
            maxWidth: 400,
            backgroundColor: "#111",
            textAlign: "center",
            userSelect: "none",
            marginBottom: "1.5rem",
            transition: "background-color 0.2s",
            fontFamily: "'Source Code Pro', monospace",
            color: "#eee",
            all: "unset",
            display: "block",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#222")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#111")
          }
        >
          <b>{searchResult.username}</b>
        </button>
      )}

      <ul
        style={{
          listStyle: "none",
          paddingLeft: 0,
          margin: 0,
          width: "100%",
          maxWidth: 400,
          flexGrow: 1,
          overflowY: "auto",
          maxHeight: "calc(100vh - 320px)",
          borderTop: "1px solid #333",
          borderBottom: "1px solid #333",
          scrollbarWidth: "thin",
          scrollbarColor: "#0f0 #222",
        }}
        aria-label="Список контактов"
      >
        {contacts.map((contact) => (
          <li key={contact}>
            <button
              onClick={() => navigate(`/chat/${contact}`)}
              aria-label={`Перейти в чат с ${contact}`}
              style={{
                all: "unset",
                display: "block",
                width: "100%",
                padding: "10px",
                borderBottom: "1px solid #333",
                cursor: "pointer",
                transition: "background-color 0.2s",
                userSelect: "none",
                fontFamily: "'Source Code Pro', monospace",
                color: "#eee",
                textAlign: "left",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#111")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {contact}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}