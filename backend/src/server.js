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
dotenv.config()

const app = express();

const PORT = process.env.PORT;
const __dirname = path.resolve();


//Middleware 
//app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173',
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


//if (process.env.NODE_ENV === "production") {

//app.use(cors({ origin: "http://localhost:5173", credentials: true }));
//For production
//app.use(express.static(path.join(__dirname, "../frontend/dist")));
// app.get("*", (req, res) => {
// res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
// });


//}



//databases should be connected first 
connectDB().then(() => app.listen(PORT, () => {
  console.log("Server started on Port 5001");
}))


