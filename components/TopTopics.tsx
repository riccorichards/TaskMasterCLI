import { useTaskStore } from "@/store/TaskStore";
import CmdsMethods from "@/utils/methods";
import { FC, useEffect, useState } from "react";
import TopicChart from "./TopicChart";
import { TopTopicType } from "@/types/type";

export const TopTopics: FC<{ fileName: string; chart: boolean }> = ({
  fileName,
  chart = false,
}) => {
  const { history, isLoading, error, fetchHistory } = useTaskStore();
  const [topTopics, setTopTopics] = useState<TopTopicType[] | null>(null);
  useEffect(() => {
    if (fileName) {
      if (!history) {
        fetchHistory(fileName);
      }
    }
  }, [fileName, history, fetchHistory]);

  useEffect(() => {
    if (history) {
      setTopTopics(CmdsMethods.toplearnedTopics(history.children));
    }
  }, [history]);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!topTopics) return null;

  return (
    <div className="flex flex-col gap-2">
      <h2>
        <b>Top learned topics</b>
      </h2>
      {chart ? (
        <TopicChart topTopic={topTopics} />
      ) : (
        <ul>
          {topTopics.map((topic) => (
            <li key={topic.name} className="flex items-center gap-4">
              <h2>{topic.name}</h2>
              <span>{topic.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopTopics;
