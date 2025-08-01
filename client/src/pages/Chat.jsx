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
        padding: "0 1rem 0 1rem",
        boxSizing: "border-box",
        // Фиксируем экран, предотвращаем прокрутку body
        overflow: "hidden",
        // Чтобы ввод на мобилках не сдвигал экран и элементы
        WebkitOverflowScrolling: "touch",
        position: "relative",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginTop: "1rem",
          marginBottom: "0.75rem",
          fontSize: "1.3rem",
          userSelect: "none",
          flexShrink: 0,
          fontWeight: "600",
        }}
      >
        Чат с {contact}
      </div>

      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "0.5rem",
          backgroundColor: "#111",
          border: "1px solid #333",
          borderRadius: "8px",
          scrollbarWidth: "thin",
          scrollbarColor: "#0f0 #222",
          display: "flex",
          flexDirection: "column",
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

      {/* Блок ввода фиксированной высоты с отступами */}
      <div
        style={{
          display: "flex",
          marginTop: "1rem",
          marginBottom: "1rem",
          flexShrink: 0,
          gap: "0.5rem",
          alignItems: "center",
          // чтобы поле ввода и кнопка были всегда на виду и не перекрывались
          position: "relative",
          zIndex: 10,
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
            caretColor: "#0f0",
            outline: "none",
            boxSizing: "border-box",
            userSelect: "text",
          }}
          autoComplete="off"
          spellCheck={false}
          inputMode="text"
          autoCorrect="off"
          autoCapitalize="off"
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
            cursor: "pointer",
            fontSize: "1.25rem",
            transition: "background-color 0.3s",
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0c0")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0f0")}
          type="button"
          aria-label="Отправить сообщение"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
