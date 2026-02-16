import Note from "../models/Note.js"
import mongoose from 'mongoose'
import Board from "../models/Board.js"


export async function createNote(req, res) {
  //user need to send title and content
  try {
    const { title, content, boardId } = req.body;
    const board = await Board.findById(boardId);

    if (!board) return res.status(404).json({ message: "Board not found" });

    //check if user is authrozied
    const isAuthorized = board.authroizedUsers.includes(req.user._id);

    if (!isAuthorized) {
      return res.status(403).json({ message: "Not authroized to post on this board" });
    };
    const newNote = new Note({
      title, content, boardId, creator: req.user._id
    });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);

    //const newNote = new Note({ title, content })
  } catch (error) {
    console.log("Error at createNote method", error)
    res.status(500).json({ message: "Internal Server error" });
  }
}

export async function getAllNotes(req, res) {
  try {
    const { boardId } = req.params;
    const userId = req.user._id;
    //Check user id is in the board 
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    if (!board.authroizedUsers.includes(userId)) {
      return res.status(403).json({ message: "You do not have access to this board" });
    }
    const notes = await Note.find({ boardId: boardId }).populate("creator", "email fullname").sort({ createdAt: -1 });
    res.status(200).json(notes);

  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Internal Server Error" });
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
export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;
    const { id } = req.params;
    const userId = req.user._id;
    const note = await Note.findById(id).populate("boardId");
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const isNoteAuthor = note.creator.toString() === userId.toString();
    const isBoardUser = note.boardId.authroizedUsers.some(memberId => memberId.equals(userId));
    if (isNoteAuthor || isBoardUser) {
      const updateNote = await Note.findByIdAndUpdate(id, { title, content }, { new: true, });
      res.status(200).json({ message: "Nodes updated" })
    }
    else {
      res.status(403).json({ message: "You are not authroized to delete" });
    }
  } catch (error) {
    console.log("Error at updateNote method", error)
    res.status(500).json({ message: "Internal Server error" });
  }
}
export async function deleteNote(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const note = await Note.findById(id).populate("boardId");
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const isNoteAuthor = note.creator.toString() === userId.toString();
    const isBoardUser = note.boardId.authroizedUsers.includes(userId)
    if (isNoteAuthor || isBoardUser) {
      await Note.findByIdAndDelete(id);
      res.status(200).json({ message: "Note deleted" });
    }
    else {
      res.status(403).json({ message: "You are not authroized to delete" });
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}
