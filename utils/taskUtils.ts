import { makeRequest } from "./makeRequest";
import {
  HistoryTastType,
  DailyTaskType,
  ApiResponse,
  InsertTaskType,
  EditTaskType,
} from "@/types/type";
import groupBy from "lodash/groupBy";

export async function addTask({
  username,
  title,
  desc,
}: InsertTaskType): Promise<ApiResponse<InsertTaskType>> {
  return await makeRequest<InsertTaskType>(
    `/api/task/${username}create-task`,
    "POST",
    {
      title,
      desc,
    }
  );
}

export async function editTask({
  taskId,
  title,
  desc,
  username,
}: EditTaskType): Promise<ApiResponse<EditTaskType>> {
  return await makeRequest(`/api/task/${username}/${taskId}`, "PUT", {
    title,
    desc,
    username,
  });
}

export async function removeTask({
  taskId,
  username,
}: {
  taskId: string;
  username: string;
}): Promise<ApiResponse<string>> {
  return await makeRequest(`/api/task/${username}/${taskId}`, "DELETE");
}

export async function retrieveDailyTasks(
  username: string
): Promise<ApiResponse<DailyTaskType[]>> {
  return await makeRequest(`/api/task/${username}`, "GET");
}

export function completeTasks(tasks: DailyTaskType[] | HistoryTastType[]) {
  return tasks.filter((task) => task.done).length;
}

export function groupedTaskByField(tasks: HistoryTastType[], field: string) {
  return groupBy(tasks, field);
}
