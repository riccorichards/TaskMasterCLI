import { DailyTastType } from "@/types/type";
import CmdsMethods from "@/utils/methods";
import { FC } from "react";

const Task: FC<{ task: DailyTastType }> = ({ task }) => {
  return (
    <div className="flex items-center gap-2 flex-wrap border-b-2 border-dashed">
      <div className="flex flex-col border-r-2 border-dashed items-start">
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
        <span>Done:</span>
        <span>{task.done ? "True" : "False"}</span>
      </div>
      <div className="flex flex-1 flex-col border-r-2 border-dashed items-start">
        <span>Duration:</span>
        <span>{task.spendMs}</span>
      </div>
      <div className="flex flex-1 flex-col border-r-2 border-dashed flex-wrap items-start">
        <span>Creaeted at:</span>
        <div className="flex flex-col">
          <span>{CmdsMethods.formatingDate(task.createdAt).date}</span>
          <span>{CmdsMethods.formatingDate(task.createdAt).time}</span>
        </div>
      </div>
    </div>
  );
};

export default Task;
