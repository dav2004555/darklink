import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Chats() {
  const [contacts, setContacts] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await axios.get(`${API_URL}/contacts`, {
          headers: { Authorization: "Bearer " + token },
        });
        setContacts(res.data);

        const messagesPromises = res.data.map((contact) =>
          axios.get(`${API_URL}/messages/${contact}`, {
            headers: { Authorization: "Bearer " + token },
          })
        );

        const messagesResponses = await Promise.all(messagesPromises);
        const lastMsgs = {};
        messagesResponses.forEach((response, i) => {
          const msgs = response.data;
          lastMsgs[res.data[i]] = msgs.length ? msgs[msgs.length - 1].text : "";
        });
        setLastMessages(lastMsgs);
      } catch (e) {
        console.error(e);
      }
    }
    fetchChats();
  }, [token]);

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
      <div style={{ textAlign: "center", fontSize: "1.5rem", marginBottom: "1.5rem" }}>
        Чаты
      </div>

      {contacts.length === 0 && <div>Нет чатов</div>}

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {contacts.map((contact) => (
          <li
            key={contact}
            onClick={() => navigate(`/chat/${contact}`)}
            style={{
              padding: "1rem",
              borderBottom: "1px solid #333",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#111")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{contact}</div>
            <div style={{ color: "#aaa", fontSize: "0.9rem" }}>
              {lastMessages[contact] || "Нет сообщений"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}