import { useTaskStore } from "@/store/TaskStore";
import { FC, use, useEffect } from "react";
import Task from "./Task";

const TasksList: FC<{ username: string }> = ({ username }) => {
  const { tasks, isLoading, fetchTasks, error } = useTaskStore();

  useEffect(() => {
    if (username) {
      fetchTasks(username);
    }
  }, [fetchTasks, username]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="border-2 border-dashed p-2 flex flex-col gap-1">
      {tasks.map((task) => (
        <Task task={task} key={task.id} />
      ))}
    </div>
  );
};

export default TasksList;
