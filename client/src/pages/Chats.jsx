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
        const res = await axios.get(`${API_URL}/api/contacts`, {
          headers: { Authorization: "Bearer " + token }
        });
        setContacts(res.data);

        // Получить последние сообщения для каждого контакта
        const messagesPromises = res.data.map(contact =>
          axios.get(`${API_URL}/messages/${contact}`, {
            headers: { Authorization: "Bearer " + token }
          })
        );

        const messagesResponses = await Promise.all(messagesPromises);
        const lastMsgs = {};
        messagesResponses.forEach((response, i) => {
          const msgs = response.data;
          if (msgs.length) lastMsgs[res.data[i]] = msgs[msgs.length - 1].text;
          else lastMsgs[res.data[i]] = "";
        });
        setLastMessages(lastMsgs);
      } catch (e) {
        console.error(e);
      }
    }
    fetchChats();
  }, [token]);

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Чаты</h2>
      {contacts.length === 0 && <div>Нет чатов</div>}
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {contacts.map(contact => (
          <li key={contact} style={{
            padding: 10,
            borderBottom: "1px solid #444",
            cursor: "pointer",
          }}
            onClick={() => navigate(`/chat/${contact}`)}
          >
            <b>{contact}</b>
            <br />
            <small style={{ color: "#999" }}>{lastMessages[contact]}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}