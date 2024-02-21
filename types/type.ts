export interface DailyTask {
  title: string;
  desc: string;
}

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
