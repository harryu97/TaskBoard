import Note from "../models/Note.js"
import mongoose from 'mongoose'
export async function getAllNotes(_, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }); //newst first
    res.status(200).json(notes)
  } catch (error) {
    console.log("Error at getAllNotes method", error)
    res.status(500).json({ message: "Internal Server error" });
  }

};
export async function getNoteById(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }
    await Note.findById(req.params.id);
    res.status(200).json({ message: "A note found" })
  } catch (error) {
    console.log("Error at getNodeById method")
    res.status(500).json({ message: "Internal server error" })

  }
}
export async function createNote(req, res) {
  //user need to send title and content
  try {
    const { title, content } = req.body;
    const newNote = new Note({ title, content })
    await newNote.save();
    res.status(201).json({ message: "Node created" })
    console.log(title, content);
  } catch (error) {
    console.log("Error at createNote method", error)
    res.status(500).json({ message: "Internal Server error" });

  }

}
export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }
    const updateNode = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true, });
    if (!updateNode) return res.status(404).json({ message: "Node not Foundfr" });
    res.status(200).json({ message: "Nodes updated" })

  } catch (error) {
    console.log("Error at updateNote method", error)
    res.status(500).json({ message: "Internal Server error" });

  }
}
export async function deleteNote(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    console.log("Error at deleteNode method")
    res.status(500).json({ message: "Internal server error" })
  }



}
