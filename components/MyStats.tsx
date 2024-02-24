"use client";

import { useStatsStore } from "@/store/StatsStore";
import { useTaskStore } from "@/store/TaskStore";
import CmdsMethods from "@/utils/methods";
import { FC, useEffect } from "react";

const MyStats: FC<{ username: string }> = ({ username }) => {
  const { stats, isLoading, error, fetchTimeStats } = useStatsStore();
  const { history, fetchHistory } = useTaskStore();
  //Total quality = 81.98%

  useEffect(() => {
    if (username) {
      if (!stats) {
        fetchTimeStats(username);
      }
      if (!history) {
        const fileName = `history-${username}.json`;
        fetchHistory(fileName);
      }
    }
  }, [fetchTimeStats, stats, fetchHistory, username, history]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!stats || !history) return null;

  const passedHrs = CmdsMethods.totalWorkingHrs(history.children);
  const taskQuality = CmdsMethods.calcCompleteTasksPercentage(history.children);
  const quality = CmdsMethods.totalQuality(
    history.children,
    stats.sumTimeHrs,
    stats.endTime
  );
  return (
    <div className="flex flex-col gap-2">
      <h2>
        <b>My Stats</b>
      </h2>
      <ul className="flex flex-col">
        <li>Period: {stats?.endTime}</li>
        <li>Remain Days: {stats?.remainDays}</li>
        <li>Shared Hrs: {stats?.sumTimeHrs}</li>
        <li>Pass Hrs: {passedHrs}</li>
        <li>Working Hrs Per day: {stats?.perDayWorkingHrs}</li>
        <li>Complete Tasks: {taskQuality}</li>
        <li>My Quality: {quality}</li>
      </ul>
    </div>
  );
};

export default MyStats;
