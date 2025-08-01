import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const API_URL = "http://localhost:4000";

let socket;

export default function Chat() {
  const { contact } = useParams();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    socket = io(API_URL);

    socket.emit("auth", username);

    socket.on("message", (msg) => {
      if ((msg.from === contact && msg.to === username) || (msg.from === username && msg.to === contact)) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [contact]);

  useEffect(() => {
    // Загрузить историю сообщений с сервером
    async function fetchMessages() {
      try {
        const res = await axios.get(`${API_URL}/messages/${contact}`, {
          headers: { Authorization: "Bearer " + token }
        });
        setMessages(res.data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchMessages();
  }, [contact]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("message", { from: username, to: contact, text });
    setText("");
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20, display: "flex", flexDirection: "column", height: "calc(100vh - 110px)" }}>
      <h2>Чат с {contact}</h2>
      <div style={{
        flexGrow: 1,
        overflowY: "auto",
        border: "1px solid #444",
        padding: 10,
        background: "#222",
        borderRadius: 5,
        marginBottom: 10
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            marginBottom: 8,
            textAlign: msg.from === username ? "right" : "left",
          }}>
            <span style={{
              display: "inline-block",
              padding: "6px 10px",
              borderRadius: 15,
              background: msg.from === username ? "#0f0" : "#555",
              color: msg.from === username ? "#000" : "#eee",
              maxWidth: "70%",
              wordBreak: "break-word"
            }}>
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex" }}>
        <input
          style={{ flexGrow: 1, marginRight: 5, background: "#111", color: "#eee", border: "1px solid #444", borderRadius: 5, padding: 8 }}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Напишите сообщение..."
        />
        <button onClick={sendMessage}>Отправить</button>
      </div>
    </div>
  );
}