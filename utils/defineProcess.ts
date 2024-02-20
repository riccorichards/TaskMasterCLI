import { Command } from "@/app/page";
import CmdsMethods from "./methods";
import mainTerminalCmd from "./mainTerminalCmd";
import MemoizeTimer from "@/components/Timer";

interface parametersType {
  originalCommand: string;
  reset: () => void;
  resetExceptTimerCmds: () => void;
  setTerminalPlace: (v: string) => void;
  terminalPlace: string;
  isRunTimer: boolean;
}

export function defineProcess(parameters: parametersType): Command | void {
  const {
    originalCommand,
    reset,
    isRunTimer,
    resetExceptTimerCmds,
    setTerminalPlace,
    terminalPlace,
  } = parameters;
  const command = originalCommand.split("/>")[1].trim();
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
  const addJourneyDurationRegax = /^insert journey duration:\s*(.+)$/;
  const insertTimeForPerionRegax =
    /^insert time for period where id =\s*(.+?)\s* set hrs =\s*(.+)$/;

  switch (terminalPlace.split("/")[1]) {
    case "basic":
      if (insertDailyRegax.test(command)) {
        const matched = command.match(insertDailyRegax);
        if (matched) {
          const [, title, desc] = matched;
          CmdsMethods.addTask({ title, desc });
          const res = CmdsMethods.responseTextOutput(
            originalCommand,
            "success",
            "Success: Task was added"
          );
        }
      } else if (
        command === "help" ||
        command === "clear" ||
        command === "clear except timer command" ||
        command === "/c timer" ||
        command === "/c basic" ||
        command === "/c tree"
      ) {
        return mainTerminalCmd({
          setTerminalPlace,
          reset,
          originalCommand,
          isRunTime: isRunTimer,
          resetExceptTimerCmds,
        });
      } else if (addJourneyDurationRegax.test(command)) {
        const matched = command.match(addJourneyDurationRegax);
        if (matched) {
          const [, period] = matched;
          CmdsMethods.addPeriod(period);
          const res = CmdsMethods.responseTextOutput(
            originalCommand,
            "success",
            "Success: Period was added"
          );
          return res;
        }
      } else if (insertTimeForPerionRegax.test(command)) {
        const matched = command.match(insertTimeForPerionRegax);
        if (matched) {
          const [, timeStatsID, hrs] = matched;
          CmdsMethods.addHrsForPeriod({ sumTimeHrs: Number(hrs), timeStatsID });
          const res = CmdsMethods.responseTextOutput(
            originalCommand,
            "success",
            `Success: Period time was added`
          );
          return res;
        }
      } else if (editTaskRegex.test(command)) {
        const matched = command.match(editTaskRegex);
        if (matched) {
          const [, taskId, title, desc] = matched;
          CmdsMethods.editTask({ taskId, title, desc });
          const res = CmdsMethods.responseTextOutput(
            originalCommand,
            "success",
            "Success: Update process is complete!"
          );
          return res;
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
          const res = CmdsMethods.responseTextOutput(
            originalCommand,
            "success",
            "Success: Task was declared as a done!"
          );
          return res;
        }
      } else if (retrieveTaskRegax.test(command)) {
        const matched = command.match(retrieveTaskRegax);
        if (matched) {
          const [, taskId] = matched;
          CmdsMethods.getTaskByIdFromDailyTask({
            taskId,
          });
          const res = CmdsMethods.responseTextOutput(
            originalCommand,
            "success",
            "Success: Task retrieve process done!"
          );
          return res;
        }
      } else if (command === "select * from dailyTask") {
        CmdsMethods.getTasksfromDailyTask();
        const res = CmdsMethods.responseTextOutput(
          originalCommand,
          "success",
          "Success: Task retrieve process done!"
        );
        return res;
      } else if (removeTaskRegax.test(command)) {
        const matched = command.match(removeTaskRegax);
        if (matched) {
          const [, taskId] = matched;
          CmdsMethods.removeTask(taskId);
          const res = CmdsMethods.responseTextOutput(
            originalCommand,
            "success",
            "Success: Task was removed!"
          );
          return res;
        }
      } else if (insertNoteRegax.test(command)) {
        const matched = command.match(insertNoteRegax);
        if (matched) {
          const [, title, desc, deadline] = matched;
          CmdsMethods.addNote({ title, desc, deadline });
          const res = CmdsMethods.responseTextOutput(
            originalCommand,
            "success",
            "Success: Note was added!"
          );
          return res;
        }
      } else if (editNoteRegax.test(command)) {
        const matched = command.match(editNoteRegax);
        if (matched) {
          const [, noteId, title, desc, deadline] = matched;
          CmdsMethods.editNote({ noteId, title, desc, deadline });
          const res = CmdsMethods.responseTextOutput(
            originalCommand,
            "success",
            "Success: Note was updated!"
          );
          return res;
        }
      } else if (doneNoteRegax.test(command)) {
        const matched = command.match(doneNoteRegax);
        if (matched) {
          const [, noteId, complete] = matched;
          CmdsMethods.doneNote({ noteId, complete: Boolean(complete) });
          const res = CmdsMethods.responseTextOutput(
            originalCommand,
            "success",
            "Success: Note was declared as a complete!"
          );
          return res;
        }
      } else if (removeNoteRegax.test(command)) {
        const matched = command.match(removeNoteRegax);
        if (matched) {
          const [, noteId] = matched;
          CmdsMethods.removeNote(noteId);
          const res = CmdsMethods.responseTextOutput(
            originalCommand,
            "success",
            "Success: Note was removed!"
          );
          return res;
        }
      } else if (command === "/c timer" || command === "/c tree") {
        const area = command.split("/c")[1];
        const res = CmdsMethods.responseTextOutput(
          originalCommand,
          "success",
          `Transfer: To >>>${area}`
        );
        return res;
      } else {
        const res = CmdsMethods.responseTextOutput(originalCommand, "error");
        return res;
      }
    case "timer":
      const runTimerRegax = /^run timer for\s*(.+)$/;
      if (runTimerRegax.test(command)) {
        const matched = command.match(runTimerRegax);
        if (matched) {
          const [, title] = matched;
          return {
            type: "component",
            command: originalCommand,
            componentOutput: MemoizeTimer,
            props: { title: title },
          };
        }
      } else if (
        command === "help" ||
        command === "clear" ||
        command === "clear except timer command" ||
        command === "/c timer" ||
        command === "/c basic" ||
        command === "/c tree"
      ) {
        return mainTerminalCmd({
          setTerminalPlace,
          reset,
          originalCommand,
          isRunTime: isRunTimer,
          resetExceptTimerCmds,
        });
      } else {
        const res = CmdsMethods.responseTextOutput(
          originalCommand,
          "error",
          `Error: Unknown command: ${command}!`
        );
        return res;
      }
    case "/tree":
  }
}
