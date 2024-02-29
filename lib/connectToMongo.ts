import mongoose from "mongoose";



async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.RUN_TIME_MONGO_URL || "");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err; // Rethrow if needed or handle it as per your application's error handling strategy
  }
}

export default connectToMongoDB;
