import mongoose from "mongoose"

//1 create a schema 
//2 model based off of that schema 

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true  //temp 
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

},
  {
    timestamps: true //created at updated at
  }
);
//create note model based on the schema
const Note = mongoose.model("Note", noteSchema)

export default Note
