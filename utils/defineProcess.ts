import { Command } from "@/app/page";
import CmdsMethods from "./methods";
import Help from "@/components/Help";

interface parametersType {
  command: string;
  reset: () => void;
}

export function defineProcess(parameters: parametersType): Command | void {
  const { command, reset } = parameters;

  //regax for dynamic variables inside commands
  const insertDailyRegax = /^insert dailyTask\s+(.+),\s*(.+)$/;
  const editTaskRegex =
    /^edit task where id =\s*(.+?)\s*set title =\s*(.+?),\s*desc =\s*(.+)$/;
  const doneTaskRegax =
    /^done task where id =\s*(.+?)\s*set done =\s*(true|false),\s*spendMs =\s*(.+)$/;
  const retrieveTaskRegax = /^select * from dailyTask id =\s*(.+)\s*$/;
  const removeTaskRegax = /^remove task where id =\s*(.+)$/;
  const insertNoteRegax =
    /^insert note title =\s*(.+?),\s*desc =\s*(.+?),\s*deadline =\s*(.+)$/;
  const editNoteRegax =
    /^edit note where id =\s*(.+?)\s*set title =\s*(.+?),\s*desc =\s*(.+?),\s*deadline =\s*(.+)$/;
  const doneNoteRegax =
    /^done note where id =\s*(.+?)\s*complete =\s*(true|false)$/;
  const removeNoteRegax = /^remove note where id =\s*(.+)$/;

  if (command === "help") {
    return {
      type: "component",
      command,
      componentOutput: Help,
      props: "",
    };
  } else if (command === "clear") {
    reset();
  } else if (insertDailyRegax.test(command)) {
    const matched = command.match(insertDailyRegax);
    if (matched) {
      const [, title, desc] = matched;
      CmdsMethods.addTask({ title, desc });
      return {
        type: "text",
        command,
        textOutput: `Success: Task was added`,
      };
    } else {
      return {
        type: "text",
        command,
        textOutput: `Error: Invalid command line ${command}`,
      };
    }
  } else if (editTaskRegex.test(command)) {
    const matched = command.match(editTaskRegex);
    if (matched) {
      const [, taskId, title, desc] = matched;
      CmdsMethods.editTask({ taskId, title, desc });
      return {
        type: "text",
        command,
        textOutput: "Success: Update process is complete!",
      };
    } else {
      return {
        type: "text",
        command,
        textOutput: `Error: Invalid command line ${command}`,
      };
    }
  } else if (doneTaskRegax.test(command)) {
    const matched = command.match(doneTaskRegax);
    if (matched) {
      const [, taskId, done, spendMs] = matched;
      CmdsMethods.doneTask({
        taskId,
        done: Boolean(done),
        spendMs: Number(spendMs),
      });
      return {
        type: "text",
        command,
        textOutput: "Success: Task was declared as a done!",
      };
    } else {
      return {
        type: "text",
        command,
        textOutput: `Error: Invalid command line ${command}`,
      };
    }
  } else if (retrieveTaskRegax.test(command)) {
    const matched = command.match(retrieveTaskRegax);
    if (matched) {
      const [, taskId] = matched;
      CmdsMethods.getTaskByIdFromDailyTask({
        taskId,
      });
      return {
        type: "text",
        command,
        textOutput: "Success: Task retrieve process done!",
      };
    } else {
      return {
        type: "text",
        command,
        textOutput: `Error: Invalid command line ==> ${command}`,
      };
    }
  } else if (command === "select * from dailyTask") {
    CmdsMethods.getTasksfromDailyTask();
    return {
      type: "text",
      command,
      textOutput: "Success: Task retrieve process done!",
    };
  } else if (removeTaskRegax.test(command)) {
    const matched = command.match(removeTaskRegax);
    if (matched) {
      const [, taskId] = matched;
      CmdsMethods.removeTask(taskId);
      return {
        type: "text",
        command,
        textOutput: "Success: Task was removed!",
      };
    } else {
      return {
        type: "text",
        command,
        textOutput: `Error: Invalid command line ==> ${command}`,
      };
    }
  } else if (insertNoteRegax.test(command)) {
    const matched = command.match(insertNoteRegax);
    if (matched) {
      const [, title, desc, deadline] = matched;
      CmdsMethods.addNote({ title, desc, deadline });
      return {
        type: "text",
        command,
        textOutput: "Success: Note was added!",
      };
    } else {
      return {
        type: "text",
        command,
        textOutput: `Error: Invalid command line ==> ${command}`,
      };
    }
  } else if (editNoteRegax.test(command)) {
    const matched = command.match(editNoteRegax);
    if (matched) {
      const [, noteId, title, desc, deadline] = matched;
      CmdsMethods.editNote({ noteId, title, desc, deadline });
      return {
        type: "text",
        command,
        textOutput: "Success: Note was updated!",
      };
    } else {
      return {
        type: "text",
        command,
        textOutput: `Error: Invalid command line ==> ${command}`,
      };
    }
  } else if (doneNoteRegax.test(command)) {
    const matched = command.match(doneNoteRegax);
    if (matched) {
      const [, noteId, complete] = matched;
      CmdsMethods.doneNote({ noteId, complete: Boolean(complete) });
      return {
        type: "text",
        command,
        textOutput: "Success: Note was declared as a complete!",
      };
    } else {
      return {
        type: "text",
        command,
        textOutput: `Error: Invalid command line ==> ${command}`,
      };
    }
  } else if (removeNoteRegax.test(command)) {
    const matched = command.match(removeNoteRegax);
    if (matched) {
      const [, noteId] = matched;
      CmdsMethods.removeNote(noteId);
      return {
        type: "text",
        command,
        textOutput: "Success: Note was removed!",
      };
    } else {
      return {
        type: "text",
        command,
        textOutput: `Error: Invalid command line ==> ${command}`,
      };
    }
  } else {
    return { type: "text", command, textOutput: "Error: Unknown command" };
  }
}
