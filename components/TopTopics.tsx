import { useTaskStore } from "@/store/TaskStore";
import { FC, useEffect, useState } from "react";
import TopicChart from "./TopicChart";
import { TopTopicType } from "@/types/type";
import { toplearnedTopics } from "@/utils/statsUtils";

export const TopTopics: FC<{
  chart: boolean;
  username: string;
}> = ({ chart = false, username }) => {
  const { history, isLoading, error, fetchHistory } = useTaskStore();
  const [topTopics, setTopTopics] = useState<TopTopicType[] | null>(null);
  useEffect(() => {
    if (username) {
      if (!history) {
        fetchHistory(username);
      }
    }
  }, [history, fetchHistory, username]);

  useEffect(() => {
    if (history) {
      setTopTopics(toplearnedTopics(history.myHistory));
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
