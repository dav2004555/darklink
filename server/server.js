import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("Route:", req.method, req.url);
  next();
});

// Статика для фронта (если нужно)
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/messenger";

// Подключение к MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Модели
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    contacts: [String],
  })
);

const Message = mongoose.model(
  "Message",
  new mongoose.Schema({
    from: String,
    to: String,
    text: String,
    time: { type: Date, default: Date.now },
  })
);

// Middleware проверки токена
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.username = data.username;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ------------------ API РОУТЫ ------------------

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    await User.create({ username, password: hashed, contacts: [] });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: "Username taken" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ username }, JWT_SECRET);
  res.json({ token });
});

app.get("/api/users", authMiddleware, async (req, res) => {
  const users = await User.find({}, "username").lean();
  res.json(users);
});

app.get("/api/contacts", authMiddleware, async (req, res) => {
  const user = await User.findOne({ username: req.username });
  res.json(user.contacts || []);
});

app.post("/api/contacts", authMiddleware, async (req, res) => {
  const { contact } = req.body;
  if (contact === req.username)
    return res.status(400).json({ error: "Cannot add yourself" });

  const contactUser = await User.findOne({ username: contact });
  if (!contactUser)
    return res.status(400).json({ error: "User not found" });

  const user = await User.findOne({ username: req.username });
  if (user.contacts.includes(contact)) {
    return res.status(400).json({ error: "Contact already added" });
  }

  user.contacts.push(contact);
  await user.save();

  res.json({ success: true });
});

app.get("/api/messages/:contact", authMiddleware, async (req, res) => {
  const { contact } = req.params;
  const user = req.username;

  const messages = await Message.find({
    $or: [
      { from: user, to: contact },
      { from: contact, to: user },
    ],
  }).sort("time");

  res.json(messages);
});

// ------------------ SOCKET.IO ------------------

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Пользователь подключился");

  socket.on("auth", (username) => {
    onlineUsers.set(username, socket.id);
    console.log(`Пользователь ${username} вошёл, socket id: ${socket.id}`);
  });

  socket.on("message", async ({ from, to, text }) => {
    const newMsg = await Message.create({ from, to, text });

    const toSocketId = onlineUsers.get(to);
    if (toSocketId) {
      io.to(toSocketId).emit("message", newMsg);
    }

    const fromSocketId = onlineUsers.get(from);
    if (fromSocketId) {
      io.to(fromSocketId).emit("message", newMsg);
    }
  });

  socket.on("disconnect", () => {
    for (const [username, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(username);
        console.log(`Пользователь ${username} вышел`);
        break;
      }
    }
  });
});

// ------------------ SPA fallback ------------------

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(PORT, () =>
  console.log(`🚀 Server started on port ${PORT}`)
);