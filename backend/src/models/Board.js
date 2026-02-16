import mongoose, { Mongoose } from "mongoose";
const boardSchema = new mongoose.Schema({

  name: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  authroizedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
},
  { timestamps: true }
);
export default mongoose.model("Board", boardSchema);
