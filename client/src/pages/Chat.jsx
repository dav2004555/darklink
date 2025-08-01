import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import socket from "../socket";

const API_URL = import.meta.env.VITE_API_URL;

export default function Chat() {
  const { contact } = useParams();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    socket.emit("auth", username);

    const handleMessage = (msg) => {
      if (
        (msg.from === contact && msg.to === username) ||
        (msg.from === username && msg.to === contact)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("message", handleMessage);
    return () => socket.off("message", handleMessage);
  }, [contact, username]);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await axios.get(`${API_URL}/messages/${contact}`, {
          headers: { Authorization: "Bearer " + token },
        });
        setMessages(res.data);
      } catch (e) {
        console.error("Ошибка при загрузке сообщений:", e);
      }
    }
    fetchMessages();
  }, [contact, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("message", { from: username, to: contact, text });
    setText("");
  };

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#eee",
        fontFamily: "'Source Code Pro', monospace",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Заголовок */}
      <div
        style={{
          textAlign: "center",
          padding: "1rem 0 0.5rem",
          fontSize: "1.25rem",
          fontWeight: "bold",
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        Чат с {contact}
      </div>

      {/* Список сообщений */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0.5rem 1rem",
          marginBottom: "4.5rem", // место под поле ввода + панель
          backgroundColor: "#111",
          borderTop: "1px solid #333",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: "0.75rem",
              textAlign: msg.from === username ? "right" : "left",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                borderRadius: "12px",
                backgroundColor: msg.from === username ? "#222" : "#333",
                color: "#eee",
                maxWidth: "70%",
                wordBreak: "break-word",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Ввод сообщения */}
      <div
        style={{
          position: "fixed",
          bottom: "3rem", // над навигацией
          left: 0,
          right: 0,
          padding: "0.5rem 1rem",
          backgroundColor: "#000",
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          zIndex: 1000,
          boxSizing: "border-box",
          borderTop: "1px solid #222",
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Сообщение..."
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #333",
            backgroundColor: "#111",
            color: "#eee",
            fontFamily: "'Source Code Pro', monospace",
            fontSize: "1rem",
            outline: "none",
            caretColor: "#0f0",
          }}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "0.75rem 1rem",
            backgroundColor: "#0f0",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            fontFamily: "'Source Code Pro', monospace",
            fontSize: "1.25rem",
            cursor: "pointer",
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
