import mongoose from "mongoose";
import { NodeDocument } from "./type";

const NodeTreeSchema = new mongoose.Schema({
  username: { type: String, required: true },
  node: { type: String, required: true },
  path: { type: String },
});

const NodeDocs =
  mongoose.models.nodes ||
  mongoose.model<NodeDocument>("nodes", NodeTreeSchema);

export default NodeDocs;
