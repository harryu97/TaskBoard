import express from "express"
import { createNote, deleteNote, getNoteById, getAllNotes, updateNote } from "../controllers/notesController.js"
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router()
//Every route below nees to check for cookies 
router.use(verifyToken);
//Sub route 
//Get API request
router.get("/:boardId", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router
