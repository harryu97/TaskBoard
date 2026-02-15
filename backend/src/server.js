import express from "express";
import notesRoutes from "./routes/notesRoutes.js"
import { connectDB } from "./config/db.js";
import dotenv from "dotenv"
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors"
import path from "path"
import helmet from "helmet"
dotenv.config()

const app = express();

const PORT = process.env.PORT;
const __dirname = path.resolve();

if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:5173" }));
}
//Middleware 
app.use(express.json())

app.use((req, res, next) => {
  console.log(`Req ${req.method} and req url was ${req.url}`)
  next();
})

app.use(rateLimiter)
app.use("/api/notes", notesRoutes)

if (process.env.NODE_ENV === "production") {
  app.use(helmet());
  //For production
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });


}

const connectPort = () => {
  app.listen(PORT, () => {
    console.log("Serverstarted on port 5001")
  })
}

connectDB().then(connectPort())
//databases should be connected first 
connectDB().then(() => app.listen(PORT, () => {
  console.log("Server started on Port 5001");
}))


