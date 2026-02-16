import express from "express";
import notesRoutes from "./routes/notesRoutes.js"
import { connectDB } from "./config/db.js";
import dotenv from "dotenv"
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors"
import path from "path"
import helmet from "helmet"
import cookieParser from 'cookie-parser'
import authRoutes from "./routes/authRoutes.js"
import boardRoutes from "./routes/boardRoutes.js"
import cookie from "cookie"
import Board from "./models/Board.js"
import User from "./models/User.js"

import jwt from "jsonwebtoken"

//Websockt
import http from "http"
import { WebSocketServer } from "ws";
dotenv.config()

const app = express();
const server = http.createServer(app);
//to handle upgrade outselves for auth 
const wss = new WebSocketServer({ noServer: true });
const PORT = process.env.PORT;
const __dirname = path.resolve();
//Map<userId,{ws,fullName}
const rooms = new Map();

//Middleware 
//app.use(cors());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`Req ${req.method} and req url was ${req.url}`)
  next();
});

app.use(rateLimiter);
//Route mounting 
app.use("/api/notes", notesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);


if (process.env.NODE_ENV === "production") {
  //For production
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}
//Websocket 
server.on("upgrade", async (req, socket, head) => {
  try {
    //Parse jwt from header 
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.jwt;

    if (!token) {
      socket.destroy() //Reject
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const url = new URL(req.url, `http://localhost`);
    const boardId = url.searchParams.get("boardId");
    if (!boardId) {
      socket.destroy();
      return;
    }
    const board = await Board.findById(boardId);
    if (!board) {
      socket.destroy();
      return;
    }
    const userId = decoded._id;
    const isAuthorized = board.authroizedUsers.some((id) => id.toString() === userId);
    if (!isAuthorized) {
      socket.destroy();
      return;
    }
    //Look up user for fullName (not in JWT payload)
    const user = await User.findById(userId).select("fullName");
    //Auth passed
    wss.handleUpgrade(req, socket, head, (ws) => {
      ws.userId = userId;
      ws.boardId = boardId;
      ws.fullName = user?.fullName || "Anonymous";
      wss.emit("connection", ws, req);
    })
  } catch (error) {
    console.log(error)
    socket.destroy()
  }
});
wss.on("connection", (ws) => {
  const { boardId, userId, fullName } = ws;
  if (!rooms.has(boardId)) {
    rooms.set(boardId, new Map());
  }
  const room = rooms.get(boardId);
  room.set(userId, { ws, fullName });
  broadcast(boardId, userId, {
    type: "user-joined",
    userId,
    fullName
  });
  //Handle cursor moves
  ws.on("message", (raw) => {
    try {
      const data = JSON.parse(raw);
      if (data.type === "cursor-move") {
        broadcast(boardId, userId, {
          type: "cursor-update",
          userId,
          fullName,
          x: data.x,
          y: data.y
        });
      }
    } catch (error) {

    }
  });
  ws.on("close", () => {
    const room = rooms.get(boardId);
    if (room) {
      room.delete(userId);
      if (room.size === 0) {
        rooms.delete(boardId);
      }
    }
    broadcast(boardId, userId, {
      type: "user-left",
      userId,
    });
  });
});
function broadcast(boardId, sendUserId, data) {
  const room = rooms.get(boardId);
  if (!room) return;
  const message = JSON.stringify(data)
  for (const [uid, { ws }] of room) {
    if (uid !== sendUserId && ws.readyState === ws.OPEN) {
      ws.send(message);
    }
  }
}



//databases should be connected first 
connectDB().then(() => server.listen(PORT, () => {
  console.log("Server started on Port 5001");
}))


