import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import socket from "../socket";

const API_URL = import.meta.env.VITE_API_URL;

export default function Chat() {
  const { contact } = useParams();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [online, setOnline] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    socket.emit("auth", username);
    socket.emit("checkOnline", contact);

    socket.on("onlineStatus", ({ user, status }) => {
      if (user === contact) setOnline(status);
    });

    const handleMessage = (msg) => {
      if (
        (msg.from === contact && msg.to === username) ||
        (msg.from === username && msg.to === contact)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
      socket.off("onlineStatus");
    };
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
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Заголовок чата */}
      <div
        style={{
          textAlign: "center",
          padding: "1rem",
          fontSize: "1.25rem",
          fontWeight: "bold",
          userSelect: "none",
          borderBottom: "1px solid #222",
          background: "#000",
          flexShrink: 0,
        }}
      >
        {contact}
        <span style={{ fontSize: "0.85rem", marginLeft: "0.5rem", color: online ? "#0f0" : "#777" }}>
          ● {online ? "в сети" : "не в сети"}
        </span>
      </div>

      {/* Сообщения */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          backgroundColor: "#111",
        }}
      >
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              marginBottom: "0.75rem",
              textAlign: msg.from === username ? "right" : "left",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                borderRadius: "10px",
                backgroundColor: msg.from === username ? "#222" : "#333",
                color: "#eee",
                maxWidth: "70%",
                wordBreak: "break-word",
              }}
            >
              {msg.text}
            </span>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Ввод сообщения */}
      <div
        style={{
          padding: "0.75rem",
          backgroundColor: "#000",
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
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