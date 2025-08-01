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
        headers: { Authorization: "Bearer " + token }
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
        headers: { Authorization: "Bearer " + token }
      });
      const user = res.data.find(u => u.username === search);
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

  // Добавить контакт
  const addContact = async () => {
    if (!searchResult) return;
    try {
      await axios.post(`${API_URL}/api/contacts`, { contact: searchResult.username }, {
        headers: { Authorization: "Bearer " + token }
      });
      fetchContacts();
      setSearch("");
      setSearchResult(null);
      setError("");
    } catch (e) {
      setError(e.response?.data?.error || "Ошибка добавления");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Контакты</h2>

      <input
        placeholder="Поиск по юзернейму"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <button onClick={searchUser}>Найти</button>
      {error && <div style={{ color: "red" }}>{error}</div>}

      {searchResult && (
        <div style={{
          marginTop: 10,
          padding: 10,
          border: "1px solid #444",
          background: "#222",
          borderRadius: 5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>{searchResult.username}</div>
          <button onClick={addContact}>Добавить</button>
        </div>
      )}

      <h3 style={{ marginTop: 30 }}>Мои контакты</h3>
      {contacts.length === 0 && <div>Нет контактов</div>}
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {Array.isArray(contacts) && contacts.map(c => (
          <li key={c} style={{
            padding: 10,
            borderBottom: "1px solid #444",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/chat/${c}`)}
          >
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}