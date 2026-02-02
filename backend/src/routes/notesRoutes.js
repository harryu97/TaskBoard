import express from "express"
import { createNote, deleteNote, getNoteById, getAllNotes, updateNote } from "../controllers/notesController.js"
const router = express.Router()
//Get API request
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
//router.get("/", (req, res) => {
//  res.send("You got 5 notes");
//});
//router.post("/", (req, res) => {
//  res.status(201).json({ message: "Note Created" })
//
//});
//router.put("/:id", (req, res) => {
//  res.status(200).json({ message: "Note Updated" });
//});
//
//router.delete("/:id", (req, res) => {
//  res.status(200).json({ message: "Note deleted" });
//
//})


export default router
