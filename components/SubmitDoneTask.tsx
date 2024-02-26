"use client";

import { useTaskStore } from "@/store/TaskStore";
import { useTimerStore } from "@/store/TimerStore";
import { formatDuration } from "@/utils/timerUtils";
import { FC, useEffect, useState } from "react";

const SubmitDoneTask: FC<{
  ms: number;
  taskTitle: string;
  taskId: string;
  username: string;
}> = ({ ms, taskId, username }) => {
  const { fetchTaskById, isLoading, error, task } = useTaskStore();
  const { sendDoneTaskInfo } = useTimerStore();
  const [done, setDone] = useState<boolean>(false);
  const [response, setResponse] = useState<string | undefined>(undefined);
  useEffect(() => {
    fetchTaskById(taskId, username);
  }, [taskId, fetchTaskById, username]);

  if (isLoading) return <div>Loaging...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleSubmit = async () => {
    const taskInfo = {
      taskId,
      spendMs: ms,
      done,
    };
    if (!done) {
      const confirmDone = window.confirm(
        "Are you sure you want to mark task as a failed?"
      );
      if (confirmDone) {
        const res = await sendDoneTaskInfo(taskInfo, username);
        console.log({ res, note: "sendDoneTaskInfo" });
        return setResponse(res);
      } else {
        return;
      }
    }

    const res = await sendDoneTaskInfo(taskInfo, username);

    setResponse(res);
  };
  return (
    <div className="flex flex-col">
      {!response ? (
        <>
          {" "}
          <div>Task title: {task?.title}</div>
          <div>Desctription: {task?.desc}</div>
          <div>Milliseconds: {formatDuration(Math.floor(ms / 1000))}</div>
          <span>
            <i>
              Default value of status is not yet... so you need to click{" "}
              <span style={{ fontWeight: "bold" }}>Done</span> if you are done
              with this task for your stats.
            </i>
          </span>
          <div className="flex items-center gap-2">
            <button
              className="border-b"
              style={{ borderColor: "rgb(8, 201, 8)" }}
              onClick={() => setDone(true)}
            >
              {done ? "Done is selected" : "Done"}
            </button>
            <button
              className="border-b border-red-600"
              onClick={() => setDone(false)}
            >
              {!done ? "Not yet... is selected" : "Not yet..."}
            </button>
          </div>
          <button className="w-fit" onClick={handleSubmit}>
            Submit
          </button>
        </>
      ) : (
        <div>{response}</div>
      )}
    </div>
  );
};

export default SubmitDoneTask;
