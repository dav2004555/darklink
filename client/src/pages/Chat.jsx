import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import socket from "../socket";
import { motion, AnimatePresence } from "framer-motion";

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
        backgroundColor: "#0b0b0b",
        color: "#f2f2f2",
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
          borderBottom: "1px solid #222",
          background: "#0b0b0b",
          zIndex: 10,
        }}
      >
        Чат с {contact}
      </div>

      {/* Список сообщений */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0.75rem 1rem",
          marginBottom: "5rem",
          backgroundColor: "#111",
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                marginBottom: "0.75rem",
                textAlign: msg.from === username ? "right" : "left",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "0.6rem 1rem",
                  borderRadius: "14px",
                  backgroundColor: msg.from === username ? "#1e1e1e" : "#2a2a2a",
                  color: "#f2f2f2",
                  maxWidth: "70%",
                  wordBreak: "break-word",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                }}
              >
                {msg.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
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
          backgroundColor: "#0b0b0b",
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
            borderRadius: "10px",
            border: "1px solid #333",
            backgroundColor: "#111",
            color: "#eee",
            fontFamily: "'Source Code Pro', monospace",
            fontSize: "1rem",
            outline: "none",
          }}
          autoComplete="off"
          spellCheck={false}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={sendMessage}
          style={{
            padding: "0.75rem 1rem",
            background: "#444",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "1.2rem",
            cursor: "pointer",
            fontFamily: "'Source Code Pro', monospace",
          }}
        >
          ➤
        </motion.button>
      </div>
    </div>
  );
}
