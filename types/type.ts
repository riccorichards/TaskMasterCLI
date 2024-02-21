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
  createdAt: string;
}

export interface TaskStateType {
  tasks: DailyTastType[];
  task: DailyTastType | null;
  isLoading: boolean;
  error: string | null;
}

export interface TimerStoreType {
  isLoading: boolean | null;
  ms: number | null;
  taskTitle: string | null;
  error: string | null;
}

export interface DoneTaskType {
  spendMs: number;
  title: string;
  done: boolean;
}
