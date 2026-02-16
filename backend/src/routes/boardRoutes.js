import express from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { createBoard, getAllBoards, shareBoard, deleteBoard } from "../controllers/boardController.js"


const router = express.Router();
//It is user realted always have to check cookie first.
//Only works when the token is verified
// Everything below doesnt work 
//Should be logged in before creating in 
router.use(verifyToken);

router.post("/", createBoard);
router.get("/", getAllBoards);
router.delete("/:boardId", deleteBoard);
router.post("/share", shareBoard);
export default router;
