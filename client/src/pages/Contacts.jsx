import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState("");
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get(`${API_URL}/contacts`, {
          headers: { Authorization: "Bearer " + token },
        });
        const list = Array.isArray(res.data) ? res.data : res.data.contacts;
        setContacts(list || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchContacts();
  }, [token]);

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
    } catch {
      setError("Ошибка поиска");
    }
  };

  const handleStartChat = async (contactName) => {
    try {
      await axios.post(
        `${API_URL}/contacts`,
        { contact: contactName },
        { headers: { Authorization: "Bearer " + token } }
      );
    } catch (e) {
      console.log("Контакт уже добавлен или ошибка");
    }
    navigate(`/chat/${contactName}`);
  };

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#eee",
        fontFamily: "'Source Code Pro', monospace",
        height: "100vh",
        width: "100vw",
        padding: "2rem 1rem",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 style={{ marginBottom: "2rem", userSelect: "none" }}>Контакты</h2>

      <div
        style={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
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
            padding: "12px",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid #333",
            backgroundColor: "#111",
            color: "#eee",
            fontFamily: "'Source Code Pro', monospace",
          }}
        />
        <button
          onClick={searchUser}
          aria-label="Найти пользователя"
          style={{
            padding: "12px",
            backgroundColor: "#111",
            color: "#eee",
            fontFamily: "'Source Code Pro', monospace",
            border: "1px solid #333",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#1a1a1a")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#111")
          }
        >
          Найти
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            color: "#ff4c4c",
            marginBottom: "1rem",
            textAlign: "center",
            userSelect: "none",
          }}
        >
          {error}
        </motion.div>
      )}

      {searchResult && (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          onClick={() => handleStartChat(searchResult.username)}
          style={{
            cursor: "pointer",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #333",
            backgroundColor: "#111",
            width: "100%",
            maxWidth: 400,
            marginBottom: "1.5rem",
            color: "#eee",
            fontFamily: "'Source Code Pro', monospace",
            textAlign: "center",
            userSelect: "none",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#1a1a1a")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#111")
          }
        >
          <b>{searchResult.username}</b>
        </motion.button>
      )}

      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          listStyle: "none",
          paddingLeft: 0,
          margin: 0,
          width: "100%",
          maxWidth: 400,
          flexGrow: 1,
          overflowY: "auto",
          borderTop: "1px solid #222",
          borderBottom: "1px solid #222",
          scrollbarWidth: "thin",
          scrollbarColor: "#555 #111",
        }}
        aria-label="Список контактов"
      >
        {contacts.map((contact) => (
          <motion.li
            key={contact}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => handleStartChat(contact)}
              aria-label={`Перейти в чат с ${contact}`}
              style={{
                all: "unset",
                display: "block",
                width: "100%",
                padding: "12px",
                borderBottom: "1px solid #222",
                cursor: "pointer",
                fontFamily: "'Source Code Pro', monospace",
                color: "#eee",
                transition: "background-color 0.2s",
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
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}