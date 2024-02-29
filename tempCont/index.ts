export const existingCmds = [
  {
    id: 1,
    cmd: "sign up username = [Username], password = [Password]",
    desc: "Simple but secure sign up process.",
    area: "auth",
  },
  {
    id: 2,
    cmd: "login -U [Username] -p [Password]",
    desc: "Login to enter into system.",
    area: "auth",
  },
  {
    id: 3,
    cmd: "my stats",
    desc: "Display statistics about time tracking, task complete and day quality.",
    area: "stats",
  },
  {
    id: 4,
    cmd: "insert learning duration [New Deadline]",
    desc: "Set a new period for the current goal.",
    area: "stats",
  },
  {
    id: 5,
    cmd: "insert time for learning duration [new Time]",
    desc: "Insert a new time entry for a specified period.",
    area: "stats",
  },
  {
    id: 50,
    cmd: "update learning duration for -U [Username] set [20XX-12-01], hours = [new Time]",
    desc: "Update already existing period information.",
    area: "stats",
  },
  {
    id: 6,
    cmd: "daily result with chart",
    desc: "Show a chart of daily results.",
    area: "stats",
  },
  {
    id: 7,
    cmd: "daily result",
    desc: "Display the results for the current day.",
    area: "stats",
  },
  {
    id: 8,
    cmd: "top learned topics with chart",
    desc: "Show a chart of the top topics learned.",
    area: "stats",
  },
  {
    id: 9,
    cmd: "top learned topics",
    desc: "List the top learned topics.",
    area: "stats",
  },
  {
    id: 10,
    cmd: "my history",
    desc: "Display history logs.",
    area: "stats",
  },
  {
    id: 11,
    cmd: "insert daily task title = [title], desc = [desc]",
    desc: "Add a new task to the system.",
    area: "task",
  },
  {
    id: 12,
    cmd: "edit task where id = [Task ID] set title = [New Title], desc = [New Desc]",
    desc: "Edit the title and description of an existing task.",
    area: "task",
  },
  {
    id: 14,
    cmd: "remove task where id = [Task ID]",
    desc: "Remove an existing task by its ID.",
    area: "task",
  },
  {
    id: 16,
    cmd: "insert note title = [New Title], desc = [New Desc], deadline = [New Time]",
    desc: "Add a new note to the system.",
    area: "task",
  },
  {
    id: 18,
    cmd: "remove note where id = [NoteId]",
    desc: "Remove an existing note by its ID.",
    area: "task",
  },
  {
    id: 19,
    cmd: "done note where id = [NoteId] set complete = [Boolean]",
    desc: "Mark a note as completed by its ID.",
    area: "task",
  },
  {
    id: 190,
    cmd: "select * from note",
    desc: "Mark a note as completed by its ID.",
    area: "task",
  },
  {
    id: 20,
    cmd: "run timer for [Task Title]",
    desc: "Start the timer for tracking time on tasks.",
    area: "timer",
  },
  {
    id: 21,
    cmd: "day finish",
    desc: "Finished working process for day and storing tasks with their status.",
    area: "task",
  },
  {
    id: 23,
    cmd: "select * from dailyTask",
    desc: "Retrieve all existing tasks from dailyTask.",
    area: "task",
  },
  {
    id: 24,
    cmd: "clear except timer commands",
    desc: "Clear all terminal except timer commands.",
    area: "timer",
  },
  {
    id: 25,
    cmd: "insert node: [Main Goal]",
    desc: "Creates main goal, start of the tree.",
    area: "tree",
  },
  {
    id: 26,
    cmd: "insert child where node = [Existing Node] add [Sub Node]",
    desc: "Creates sub goals.",
    area: "tree",
  },
  {
    id: 27,
    cmd: "show map tree",
    desc: "Discover the current map.",
    area: "tree",
  },
  {
    id: 28,
    cmd: "remove node where node = [Node Name]",
    desc: "Remove the node with node's name.",
    area: "tree",
  },
  {
    id: 29,
    cmd: "update node where node = [Node Name] set [New Name]",
    desc: "Update the node with node's name.",
    area: "tree",
  },
  {
    id: 32,
    cmd: "quit",
    desc: "Quit from the system.",
    area: "auth",
  },
];
