export const existingCmds = [
  {
    id: 4,
    cmd: "sign up where username = [Username], password = [Password]",
    desc: "Simple but secure sign up process.",
  },
  {
    id: 5,
    cmd: "login -U [Username] -p [Password]",
    desc: "Login to enter into system.",
  },
  {
    id: 1,
    cmd: "my stats",
    desc: "Display statistics about time tracking, task complete and day quality.",
  },
  {
    id: 2,
    cmd: "insert journey duration: [New Deadline]",
    desc: "Set a new period for the current goal.",
  },
  {
    id: 3,
    cmd: "insert time for period: [new Time]",
    desc: "Insert a new time entry for a specified period.",
  },
  {
    id: 7,
    cmd: "daily result - chart",
    desc: "Show a chart of daily results.",
  },
  {
    id: 8,
    cmd: "daily result",
    desc: "Display the results for the current day.",
  },
  {
    id: 9,
    cmd: "top learned topics - chart",
    desc: "Show a chart of the top topics learned.",
  },
  {
    id: 10,
    cmd: "top learned topics",
    desc: "List the top learned topics.",
  },
  {
    id: 11,
    cmd: "my history",
    desc: "Display history logs.",
  },
  {
    id: 12,
    cmd: "insert daily task set title = [title], desc = [desc]",
    desc: "Add a new task to the system.",
  },
  {
    id: 13,
    cmd: "edit task where id = [Task ID] set title = [New Title], desc = [New Desc]",
    desc: "Edit the title of an existing task.",
  },
  {
    id: 14,
    cmd: "remove task where title = [Task Title]",
    desc: "Remove an existing task by its ID.",
  },
  {
    id: 16,
    cmd: "insert note title = [New Title], desc = [New Desc], deadline = [New Time]",
    desc: "Add a new note to the system.",
  },
  {
    id: 17,
    cmd: "edit note where id = [NoteId] set title = [New Title], desc [New desc], deadline = [New Deadline]",
    desc: "Edit the content of an existing note by its title.",
  },
  {
    id: 18,
    cmd: "remove note where id = [NoteId]",
    desc: "Remove an existing note by its ID.",
  },
  {
    id: 19,
    cmd: "done note where id = [NoteId] complete = [Boolean]",
    desc: "Mark a note as completed by its ID.",
  },
  {
    id: 20,
    cmd: "run timer for [Task Title]",
    desc: "Start the timer for tracking time on tasks.",
  },
  {
    id: 21,
    cmd: "day finish",
    desc: "Finished working process for day and storing tasks with their status.",
  },
  {
    id: 23,
    cmd: "select * from dailyTask",
    desc: "Retrieve all existing tasks from dailyTask.",
  },
  {
    id: 24,
    cmd: "clear except timer commands",
    desc: "Clear all terminal except timer commands.",
  },
  {
    id: 25,
    cmd: "insert node: [Main Goal]",
    desc: "Creates main goal, start of the tree.",
  },
  {
    id: 26,
    cmd: "insert child where node = [Existing Node] add [Sub Node]",
    desc: "Creates sub goals.",
  },
  {
    id: 27,
    cmd: "show map tree",
    desc: "Discover the current map.",
  },
  {
    id: 28,
    cmd: "remove node where nodeName = [Node Name]",
    desc: "Remove the node with node's name.",
  },
  {
    id: 29,
    cmd: "update node where nodeName = [Node Name] set [New Name]",
    desc: "Update the node with node's name.",
  },
  {
    id: 30,
    cmd: "close map tree",
    desc: "Close opened map tree.",
  },
  {
    id: 31,
    cmd: "resize tree set w-[1/3, 1/2, 2/3]",
    desc: "Close opened map tree.",
  },
  {
    id: 32,
    cmd: "quit",
    desc: "Quit from the system.",
  },
];
