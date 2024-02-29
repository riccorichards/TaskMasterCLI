import mongoose from "mongoose";

export interface NodeInput {
  username: string;
  node: string;
  path?: string;
}

export interface NodeDocument extends NodeInput {
  _id: mongoose.Schema.Types.ObjectId;
}

export interface MyHistoryInputType {
  workSpace: string;
  task: string;
  done: boolean;
  duration: number;
  createdAt: Date;
}

export interface HistoryInput {
  username: { type: String; require: true };
  myHistory: MyHistoryInputType[];
}

export interface HistoryDocument extends HistoryInput {
  _id: mongoose.Schema.Types.ObjectId;
}
