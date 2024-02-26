import { makeRequest } from "./makeRequest";
import { HistoryTastType, DailyTaskType, ApiResponse } from "@/types/type";
import { completeTasks, groupedTaskByField } from "./taskUtils";
import { formatDuration } from "./timerUtils";

export async function addPeriod({
  period,
  username,
}: {
  period: string;
  username: string;
}): Promise<
  ApiResponse<{
    period: string;
    username: string;
  }>
> {
  return await makeRequest(`/api/time-stats/${username}/add-period`, "POST", {
    period: new Date(period),
  });
}

export async function addHrsForPeriod({
  sumTimeHrs,
  username,
}: {
  sumTimeHrs: number;
  username: string;
}): Promise<
  ApiResponse<{
    sumTimeHrs: number;
    username: string;
  }>
> {
  return await makeRequest(`/api/time-stats/${username}/add-sum-hrs`, "PUT", {
    sumTimeHrs,
    username,
  });
}

export function calcCompleteTasksPercentage(
  tasks: HistoryTastType[] | DailyTaskType[]
) {
  return (completeTasks(tasks) / tasks.length) * 100;
}

export function defineRemainDays(
  period: string,
  customDate: number | null = null
) {
  const endTime = new Date(period);
  const toDay = customDate ? new Date(customDate) : new Date();

  //normalize both days at the start of the day
  endTime.setHours(0, 0, 0, 0);
  toDay.setHours(0, 0, 0, 0);

  //define the difference between target day and today in milleseconds
  const differentInTime = endTime.getTime() - toDay.getTime();
  //convert milleseconds into days
  const differenceInDays = Math.ceil(differentInTime / (1000 * 3600 * 24));
  return differenceInDays;
}

export function totalQuality(
  tasks: HistoryTastType[],
  periodHrs: number,
  period: string
) {
  //define task result in percentage (complete / total) * 100
  const taskResult = calcCompleteTasksPercentage(tasks);

  //the first work day with our application
  const startDay = tasks[0].createdAt;
  //it calculates the entire days from the first day to the target day
  const remainDays = defineRemainDays(period, startDay);
  //it calculates percentage: total hours / the remain days
  const workHrsPerDay = periodHrs / remainDays; // example 250 hrs / 50 days = 5 hrs per day

  //defines the remains days from today
  const remainDaysFromToday = defineRemainDays(period);
  const currentWorkHrsPerDay = periodHrs / remainDaysFromToday;

  //defiens the percentage of our works
  const workingHrsQuality = (workHrsPerDay / currentWorkHrsPerDay) * 100;

  return (taskResult + workingHrsQuality) / 2;
}

export function totalWorkingHrs(tasks: HistoryTastType[]) {
  return formatDuration(tasks.reduce((acc, task) => acc + task.duration, 0));
}

export function toplearnedTopics(tasks: HistoryTastType[]) {
  const groupedTasks = groupedTaskByField(tasks, "workSpace");
  const result = [];
  for (const workSpace in groupedTasks) {
    const workspaceTasks = groupedTasks[workSpace];
    const workSpaceLen = workspaceTasks.length * 0.45;
    const workSpaceCompletion = completeTasks(workspaceTasks) * 0.2;
    const workSpaceDuration =
      (workspaceTasks.reduce((sum, task) => sum + task.duration, 0) / 450) *
      0.35;

    const value = workSpaceCompletion + workSpaceDuration + workSpaceLen;
    result.push({
      name: workSpace,
      value,
    });
  }

  return result.sort((a, b) => b.value - a.value).slice(0, 10);
}

export function dailyProgress(tasks: HistoryTastType[]) {
  const groupedTasks = groupedTaskByField(tasks, "createdAt");
  const result = [];

  for (const date in groupedTasks) {
    const dailyTask = groupedTasks[date];
    const doneTasks = completeTasks(dailyTask);

    result.push({
      date: date.split("T")[0],
      value: (doneTasks / dailyTask.length) * 100,
    });
  }

  return result;
}
