import mongoose from "mongoose"
export const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDb connected");
  } catch (error) {
    console.error("ERROR while Connecting MONGO DB");
    process.exit(1);
  }
}
