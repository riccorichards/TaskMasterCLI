"use client";

import { useTaskStore } from "@/store/TaskStore";
import CmdsMethods from "@/utils/methods";
import { FC, useEffect } from "react";

const DailyProgress: FC<{ fileName: string }> = ({ fileName }) => {
  const { history, isLoading, error, fetchHistory } = useTaskStore();
  useEffect(() => {
    if (fileName) {
      if (!history) {
        fetchHistory(fileName);
      }
    }
  }, [fileName, history, fetchHistory]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!history) return null;

  console.log(history.children);
  console.log(CmdsMethods.dailyProgress(history.children));
  return <></>;
};

export default DailyProgress;
