export const existingCmds = [
  {
    id: 1,
    cmd: "time stats",
    desc: "Display statistics about time tracking.",
  },
  {
    id: 2,
    cmd: "insert end period = [New End Period]",
    desc: "Set a new end period for the current task.",
  },
  {
    id: 3,
    cmd: "insert time for period = [new Time]",
    desc: "Insert a new time entry for a specified period.",
  },
  {
    id: 4,
    cmd: "complete time",
    desc: "Define already complete time in percentage.",
  },
  {
    id: 5,
    cmd: "task",
    desc: "Define result in percentage between total amount tasks and complete taks.",
  },
  {
    id: 6,
    cmd: "quality",
    desc: "Defines your quality in percentage.",
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
    cmd: "show activity",
    desc: "Display recent activity logs.",
  },
  {
    id: 12,
    cmd: "insert dailyTask [title], [desc]",
    desc: "Add a new task to the system.",
  },
  {
    id: 13,
    cmd: "edit task where id = [Task ID] set title = [New Title], desc = [New Desc]",
    desc: "Edit the title of an existing task.",
  },
  {
    id: 14,
    cmd: "remove task where id = [Task ID]",
    desc: "Remove an existing task by its ID.",
  },
  {
    id: 15,
    cmd: "done task where id = [Task ID] set done = [Boolean], spendMs = [Milliseconds]",
    desc: "Mark a task as completed by its title.",
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
    cmd: "run timer",
    desc: "Start the timer for tracking time on tasks.",
  },
  {
    id: 21,
    cmd: "pause timer",
    desc: "Pause the currently running timer."
  },
  {
    id: 22,
    cmd: "reset timer",
    desc: "Reset the timer to zero."
  },
  {
    id: 23,
    cmd: "save timer",
    desc: "Save the current time from the timer to the task.",
  },
  {
    id: 24,
    cmd: "show run task",
    desc: "Display the task that is currently being timed.",
  },
  {
    id: 25,
    cmd: "day finish",
    desc: "Finished working process for day and storing tasks with their status.",
  },
  {
    id: 26,
    cmd: "select * from dailyTask where id = [Task ID]",
    desc: "Retrieve an existing task by its ID.",
  },
  {
    id: 26,
    cmd: "select * from dailyTask",
    desc: "Retrieve all existing tasks from dailyTask.",
  },
];