"use client";

import { useTaskStore } from "@/store/TaskStore";
import { formatDuration } from "@/utils/timerUtils";
import { FC, useEffect } from "react";

const MyHistory: FC<{ fileName: string; username: string }> = ({
  fileName,
  username,
}) => {
  const { history, isLoading, error, fetchHistory } = useTaskStore();

  useEffect(() => {
    if (fileName) {
      fetchHistory(fileName, username);
    }
  }, [fileName, fetchHistory, username]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col border border-dashed w-full">
      <div className="flex items-center justify-between font-bold w-full">
        <span className="flex flex-1 self-center">#ID</span>
        <span className="flex flex-1 self-center">Work Space</span>
        <span className="flex flex-1 self-center">Task</span>
        <span className="flex flex-1 self-center">Duration</span>
        <span className="flex flex-1 self-center">Status</span>
        <span className="flex flex-1 self-center">Created at</span>
      </div>
      {history &&
        history.children.map((el, i) => (
          <div
            key={i}
            className={`flex items-center justify-between ${
              el.done ? "opacity-100" : "opacity-70"
            } border-b border-dashed`}
          >
            <span className="flex flex-1 self-center">#{i + 1}</span>
            <span className="flex flex-1 self-center">{el.workSpace}</span>
            <span className="flex flex-1 self-center">{el.task}</span>
            <span className="flex flex-1 self-center">
              {formatDuration(el.duration)}
            </span>
            <span className="flex flex-1 self-center">
              {el.done ? "True" : "False"}
            </span>
            <span className="flex flex-1 self-center">
              {new Date(el.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
    </div>
  );
};

export default MyHistory;
