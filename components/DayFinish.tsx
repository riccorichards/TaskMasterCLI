"use client";

import { useTaskStore } from "@/store/TaskStore";
import { FC, useEffect, useState } from "react";
import Task from "./Task";
import CmdsMethods from "@/utils/methods";

const DayFinish: FC<{ username: string }> = ({ username }) => {
  const {
    fetchTasks,
    isLoading,
    error,
    tasks,
    addTasksToHistory,
    historyResponse,
  } = useTaskStore();
  const [isOpenBtns, setIsOpenBtns] = useState<boolean>(true);

  useEffect(() => {
    if (username) {
      fetchTasks(username);
    }
  }, [username, fetchTasks]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const result = CmdsMethods.calcCompleteTasksPercentage(tasks);

  const handleReject = () => {
    const rejectConf = window.confirm("Are you sure you want to continue?");
    if (rejectConf) {
      setIsOpenBtns(false);
    }
  };

  const handleApply = () => {
    if (tasks.length > 0) {
      addTasksToHistory(tasks);
      setIsOpenBtns(false);
    }
  };

  const hasLen = Boolean(tasks.length > 0);

  return (
    <>
      {historyResponse ? (
        <div>{historyResponse}</div>
      ) : (
        <div className="flex flex-col border-2 border-dashed p-2 gap-1">
          {hasLen ? (
            <>
              {tasks.map((task) => (
                <Task task={task} key={task.id} opacity="opacity-70" />
              ))}
              <h2>Predictable: {result}%</h2>
              {result > 70 ? (
                <span>
                  <i>
                    Well done! To finish today you need to click{" "}
                    <span className="font-bold">apply</span>
                  </i>
                </span>
              ) : (
                <span>
                  <i>
                    Are you sure to finish today? To continue working you need
                    to click <span className="font-bold">reject</span> to avoid
                    bad result in your stats
                  </i>
                </span>
              )}
              {isOpenBtns && (
                <div className="flex items-center gap-2">
                  <button onClick={handleApply}>Apply</button>
                  <button onClick={handleReject} className="text-red-600">
                    Reject
                  </button>
                </div>
              )}
            </>
          ) : (
            <div>Data is not exist...</div>
          )}
        </div>
      )}
    </>
  );
};

export default DayFinish;
