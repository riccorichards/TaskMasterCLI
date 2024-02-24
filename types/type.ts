export interface MapTreeType {
  name: string;
  children: [];
}

export interface RootMapTreeType {
  user: string;
  userTree: {
    name: string;
    children: MapTreeType[];
  };
}

export interface DailyTastType {
  id: string;
  title: string;
  desc: string;
  done: boolean;
  spendMs: number;
  username: string;
  createdAt: string;
}

export interface HistoryTastType {
  workSpace: string;
  task: string;
  done: boolean;
  duration: number;
  createdAt: number;
}

export interface HistoryType {
  username: string;
  children: HistoryTastType[];
}

export interface LogInType {
  username: string;
  password: string;
}

export interface LoginStateType {
  user: string | null;
  isLoading: boolean | null;
  error: string | null;
}

export interface TaskStateType {
  tasks: DailyTastType[];
  task: DailyTastType | null;
  history: HistoryType | null;
  historyResponse: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface TimerStoreType {
  isLoading: boolean | null;
  ms: number | null;
  taskTitle: string | null;
  error: string | null;
}

export interface StatsType {
  endTime: string;
  remainDays: number;
  sumTimeHrs: number;
  perDayWorkingHrs: number;
  username: string;
}

export interface StatsStateType {
  stats: StatsType | null;
  isLoading: boolean | null;
  error: string | null;
}

export interface DoneTaskType {
  spendMs: number;
  title: string;
  done: boolean;
}

export interface TopTopicType {
  name: string;
  value: number;
}
