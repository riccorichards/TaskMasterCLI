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
export async function updatePeriodDuration({
  username,
  period,
  sumTimeHrs,
}: {
  username: string;
  period: string;
  sumTimeHrs: number;
}): Promise<ApiResponse<string>> {
  return await makeRequest(`/api/time-stats/${username}`, "PUT", {
    period: new Date(period),
    sumTimeHrs,
  });
}

export function calcCompleteTasksPercentage(
  tasks: HistoryTastType[] | DailyTaskType[]
) {
  return (completeTasks(tasks) / tasks.length) * 100;
}

export function defineRemainDays(
  period: string,
  customDate: string | null = null
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
  const sumHrs = tasks.reduce((acc, task) => acc + task.duration, 0);
  console.log({ sumHrs });
  return formatDuration(sumHrs / 1000);
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
  // Create a map to group tasks by date
  const groupedTasks = new Map<string, HistoryTastType[]>();

  // Populate the map with tasks grouped by date
  for (const task of tasks) {
    const date = task.createdAt.split("T")[0]; // Get only the date portion
    const existingTasks = groupedTasks.get(date) || [];
    groupedTasks.set(date, [...existingTasks, task]);
  }

  // Calculate the completion percentage for each group
  const result = Array.from(groupedTasks).map(([date, dailyTasks]) => {
    const doneTasks = dailyTasks.filter((task) => task.done).length;
    return {
      date,
      value: (doneTasks / dailyTasks.length) * 100,
    };
  });

  return result;
}

export function validateDate(dateString: string) {
  const validPeriodFormat =
    /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  return validPeriodFormat.test(dateString);
}
