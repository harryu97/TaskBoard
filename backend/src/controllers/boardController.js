import Board from "../models/Board.js"
import User from "../models/User.js"
//Get all boards 
export const getAllBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      authroizedUsers: { $in: [req.user._id] }
    });
    res.status(200).json(boards);

  } catch (error) {
    res.status(500).json({ message: "Internal server error failed to fetch boards" })
  }
}



//New board create 
export const createBoard = async (req, res) => {
  try {
    const { name } = req.body;
    const newBoard = new Board({
      name,
      creator: req.user._id, //from token bouncer
      authroizedUsers: [req.user._id]
    });
    const savedBoard = await newBoard.save();
    res.status(201).json(savedBoard);
  } catch (error) {
    res.status(500).json({ message: "Failed to create board" });
  }
};
export const getBoardNotes = async (req, res) => {

  try {
    const { boardId } = req.params;
    const notes = await Note.find({ boardId }).populate("creator", "fullName").sort({ createdAt: -1 });
    res.status(200).json(notes)
  }
  catch (erorr) {
    console.error("Fetch Error", error);
    res.status(500).json({ message: "Error fetching notes" })
  }
}

export const deleteBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const userId = req.user._id; // Populated by your verifyToken middleware

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Check if the user is the creator
    if (board.creator.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this board" });
    }

    await Board.findByIdAndDelete(boardId);
    res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error during deletion" });
  }
};
export const shareBoard = async (req, res) => {
  try {
    const { boardId, email } = req.body;
    //Find board first
    const board = await Board.findById(boardId);
    const user = await User.findOne({ email });

    if (!board || !user) {
      return res.status(400).json({ message: "Error finding board or user " })
    }

    //If there is  a board check if the user is actually in authroized users
    const isAuthorized = board.authroizedUsers.includes(req.user._id)
    if (!isAuthorized) {
      return res.status(400).json({ message: "User is not authorized" });
    }
    if (board.authroizedUsers.includes(user._id)) {
      return res.status(400).json({ message: "User is already on this board" });
    }
    //If user is authorized
    board.authroizedUsers.push(user._id);
    await board.save();
    res.status(200).json({ message: "Shared successfully", board })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Internal Server Error" });
  }
}
