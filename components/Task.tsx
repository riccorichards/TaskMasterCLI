"use client";

import { DailyTaskType } from "@/types/type";
import Context from "@/utils/Context";
import { formatDuration } from "@/utils/timerUtils";
import { formatingDate } from "@/utils/toolsUtils";
import { FC, useContext } from "react";

const Task: FC<{ task: DailyTaskType; opacity?: string }> = ({
  task,
  opacity = "opacity-70",
}) => {
  const getContext = useContext(Context);
  const runnigTaskId = getContext?.runingTaskId;
  const isRunningTask = getContext?.isRunTimer;
  return (
    <div
      className={`flex items-center relative gap-2 flex-wrap border-b-2 border-dashed ${
        task.done ? opacity : "opacity-100"
      }`}
    >
      {runnigTaskId === task.id && isRunningTask ? (
        <div className="absolute top-0 right-5">running</div>
      ) : null}
      <div className="flex flex-col w-10 border-r-2 border-dashed items-start">
        <span>ID:</span>
        <span>{task.id}</span>
      </div>
      <div className="flex flex-1 flex-col border-r-2 border-dashed items-start">
        <span>Title:</span>
        <span>{task.title}</span>
      </div>
      <div className="flex flex-1 flex-col border-r-2 border-dashed items-start">
        <span>Description:</span>
        <span>{task.desc}</span>
      </div>
      <div className="flex flex-1 flex-col border-r-2 border-dashed items-start">
        <span>Complete:</span>
        <span>{task.done ? "True" : "False"}</span>
      </div>
      <div className="flex flex-1 flex-col border-r-2 border-dashed items-start">
        <span>Duration:</span>
        <span>{formatDuration(Math.floor(task.spendMs /1000))}</span>
      </div>
      <div className="flex flex-1 flex-col border-r-2 border-dashed flex-wrap items-start">
        <span>Creaeted at:</span>
        <div className="flex flex-col">
          <span>{formatingDate(task.createdAt).date}</span>
          <span>{formatingDate(task.createdAt).time}</span>
        </div>
      </div>
    </div>
  );
};

export default Task;
