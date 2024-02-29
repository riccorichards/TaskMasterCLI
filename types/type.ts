export type TextCommand = {
  type: "text";
  command: string;
  textOutput: string;
};

export type ComponentCommand = {
  type: "component";
  command: string;
  componentOutput: React.ComponentType<any>;
  props: any;
};

export interface MapTreeType {
  name: string;
  children: [];
}

export interface InsertTaskType {
  username: string;
  title: string;
  desc: string;
}

export interface InsertNoteType {
  title: string;
  desc: string;
  deadline: string;
  username: string;
}

export interface EditTaskType {
  username: string;
  title: string | undefined;
  desc: string | undefined;
  taskId: number;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  message?: string;
}

export interface RootMapTreeType {
  user: string;
  userTree: {
    name: string;
    children: MapTreeType[];
  };
}

export interface DailyTaskType {
  id: number;
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
  createdAt: string;
}

export interface TreeNode {
  name: string;
  children: TreeNode[];
}

export interface NotesType {
  id: number;
  title: string;
  desc: string;
  deadline: string;
  complete: boolean;
  createdAt: string;
}

export interface HistoryType {
  username: string;
  myHistory: HistoryTastType[];
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
  tasks: DailyTaskType[];
  task: DailyTaskType | null;
  history: HistoryType | null;
  notes: NotesType[];
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
  taskId: string;
  done: boolean;
}

export interface TopTopicType {
  name: string;
  value: number;
}
