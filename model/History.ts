import mongoose from "mongoose";
import { HistoryDocument } from "./type";

const HistorySchema = new mongoose.Schema({
  username: { type: String, required: true },
  myHistory: [
    {
      workSpace: { type: String, required: true },
      task: { type: String, required: true },
      done: { type: Boolean, required: true },
      duration: { type: Number, required: true },
      createdAt: { type: Date, required: true },
    },
  ],
});

const History =
  mongoose.models.history ||
  mongoose.model<HistoryDocument>("history", HistorySchema);

export default History;
