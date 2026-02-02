import express from "express";
import notesRoutes from "./routes/notesRoutes.js"
import { connectDB } from "./config/db.js";
import dotenv from "dotenv"
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors"
dotenv.config()

const app = express();

const PORT = process.env.PORT;

app.use(cors({ origin: "http://localhost:5173" }));
//Middleware 
app.use(express.json())

app.use((req, res, next) => {
  console.log(`Req ${req.method} and req url was ${req.url}`)
  next();
})

app.use(rateLimiter)
app.use("/api/notes", notesRoutes)


//databases should be connected first 
connectDB().then(() => app.listen(PORT, () => {
  console.log("Server started on Port 5001");
}))


