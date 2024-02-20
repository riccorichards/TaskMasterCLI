export interface DailyTask {
  title: string;
  desc: string;
}

export interface MapTreeType {
  user: string;
  userTree: {
    name: string;
    children: MapTreeType[];
  };
}
