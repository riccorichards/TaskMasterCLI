"use client";

import { useTaskStore } from "@/store/TaskStore";
import { dailyProgress } from "@/utils/statsUtils";
import { divide } from "lodash";
import { FC, useEffect } from "react";
import DailyResultChart from "./DailyResultChart";
const DailyProgress: FC<{
  fileName: string;
  username: string;
  chart: boolean;
}> = ({ fileName, username, chart = false }) => {
  const { history, isLoading, error, fetchHistory } = useTaskStore();
  useEffect(() => {
    if (fileName) {
      if (!history) {
        fetchHistory(fileName, username);
      }
    }
  }, [fileName, history, fetchHistory, username]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!history) return null;
  const result = dailyProgress(history.children);

  return (
    <div>
      {!chart ? (
        <div className="w-full flex flex-col gap-1">
          {result.map((day) => (
            <div key={day.date} className="flex items-center gap-4">
              <span>{day.date}</span>
              <span>{day.value}%</span>
            </div>
          ))}
        </div>
      ) : (
        <DailyResultChart result={result} />
      )}
    </div>
  );
};

export default DailyProgress;
