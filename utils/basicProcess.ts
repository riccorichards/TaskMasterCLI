import DailyProgress from "@/components/DailyProgress";
import CmdsMethods from "./methods";
import TopTopics from "@/components/TopTopics";
import MyHistory from "@/components/MyHistory";
import MyStats from "@/components/MyStats";
import DayFinish from "@/components/DayFinish";
import mainTerminalCmd from "./mainTerminalCmd";
import TasksList from "@/components/TasksList";
import { parametersType } from "./defineProcess";

interface BasicParamsType extends parametersType {
  command: string;
}

const insertDailyRegax = /^insert daily task set title =\s*(.+),\s*desc =(.+)$/;
const editTaskRegex =
  /^edit task where id =\s*(.+?)\s*set title =\s*(.+?),\s*desc =\s*(.+)$/;
const removeTaskRegax = /^remove task where title =\s*(.+)$/;
const insertNoteRegax =
  /^insert note title =\s*(.+?),\s*desc =\s*(.+?),\s*deadline =\s*(.+)$/;
const editNoteRegax =
  /^edit note where id =\s*(.+?)\s*set title =\s*(.+?),\s*desc =\s*(.+?),\s*deadline =\s*(.+)$/;
const doneNoteRegax =
  /^done note where id =\s*(.+?)\s*complete =\s*(true|false)$/;
const removeNoteRegax = /^remove note where id =\s*(.+)$/;
const addJourneyDurationRegax = /^insert journey duration:\s*(.+)$/;
const insertTimeForPerionRegax = /^insert time for period:\s*(.+)$/;

export const basicProcess = async ({
  originalCommand,
  command,
  reset,
  resetExceptTimerCmds,
  isRunTimer,
  setTerminalPlace,
}: BasicParamsType) => {
  const username = originalCommand.split("/")[1];

  if (insertDailyRegax.test(command)) {
    const matched = command.match(insertDailyRegax);
    if (matched) {
      let [, title, desc] = matched;
      title = CmdsMethods.capitalized(title);
      desc = CmdsMethods.capitalized(desc);
      const res = await CmdsMethods.addTask({ username, title, desc });
      console.log(res);
      if (res) {
        return CmdsMethods.responseTextOutput(
          originalCommand,
          "success",
          "Success: Task was added"
        );
      } else {
        return CmdsMethods.responseTextOutput(
          originalCommand,
          "error",
          "",
          res
        );
      }
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
      const res = await CmdsMethods.addPeriod(period, username);
      if (res)
        return CmdsMethods.responseTextOutput(
          originalCommand,
          "success",
          "add journey duration!"
        );

      return CmdsMethods.responseTextOutput(originalCommand, "error");
    }
  } else if (insertTimeForPerionRegax.test(command)) {
    const matched = command.match(insertTimeForPerionRegax);
    if (matched) {
      const [, hrs] = matched;
      const res = await CmdsMethods.addHrsForPeriod({
        sumTimeHrs: Number(hrs),
        username,
      });
      if (res)
        return CmdsMethods.responseTextOutput(
          originalCommand,
          "success",
          "Period time was added!"
        );

      return CmdsMethods.responseTextOutput(originalCommand, "error");
    }
  } else if (editTaskRegex.test(command)) {
    const matched = command.match(editTaskRegex);
    if (matched) {
      const [, taskId, title, desc] = matched;
      const res = await CmdsMethods.editTask({ taskId, title, desc });
      if (res)
        return CmdsMethods.responseTextOutput(
          originalCommand,
          "success",
          "Success: updated task!"
        );

      return CmdsMethods.responseTextOutput(originalCommand, "error");
    }
  } else if (command === "select * from dailyTask") {
    return {
      type: "component",
      command: originalCommand,
      componentOutput: TasksList,
      props: { username },
    };
  } else if (removeTaskRegax.test(command)) {
    const matched = command.match(removeTaskRegax);
    if (matched) {
      const [, taskName] = matched;
      const res = await CmdsMethods.removeTask(taskName);
      if (res)
        return CmdsMethods.responseTextOutput(
          originalCommand,
          "success",
          "Success: removed record!"
        );

      return CmdsMethods.responseTextOutput(originalCommand, "error");
    }
  } else if (insertNoteRegax.test(command)) {
    const matched = command.match(insertNoteRegax);
    if (matched) {
      const [, title, desc, deadline] = matched;
      const res = await CmdsMethods.addNote({ title, desc, deadline });
      if (res)
        return CmdsMethods.responseTextOutput(
          originalCommand,
          "success",
          "Success: Note was added!"
        );

      return CmdsMethods.responseTextOutput(originalCommand, "error");
    }
  } else if (editNoteRegax.test(command)) {
    const matched = command.match(editNoteRegax);
    if (matched) {
      const [, noteId, title, desc, deadline] = matched;
      const res = await CmdsMethods.editNote({
        noteId,
        title,
        desc,
        deadline,
      });
      if (res)
        return CmdsMethods.responseTextOutput(
          originalCommand,
          "success",
          "Success: updated note!"
        );

      return CmdsMethods.responseTextOutput(originalCommand, "error");
    }
  } else if (doneNoteRegax.test(command)) {
    const matched = command.match(doneNoteRegax);
    if (matched) {
      const [, noteId, complete] = matched;
      const res = await CmdsMethods.doneNote({
        noteId,
        complete: Boolean(complete),
      });
      if (res)
        return CmdsMethods.responseTextOutput(
          originalCommand,
          "success",
          "Success: note is finished!"
        );

      return CmdsMethods.responseTextOutput(originalCommand, "error");
    }
  } else if (removeNoteRegax.test(command)) {
    const matched = command.match(removeNoteRegax);
    if (matched) {
      const [, noteId] = matched;
      const res = await CmdsMethods.removeNote(noteId);
      if (res)
        return CmdsMethods.responseTextOutput(
          originalCommand,
          "success",
          "Success: removed note!"
        );

      return CmdsMethods.responseTextOutput(originalCommand, "error");
    }
  } else if (command === "/c timer" || command === "/c tree") {
    const area = command.split("/c")[1];
    const res = CmdsMethods.responseTextOutput(
      originalCommand,
      "success",
      `Transfer: To >>>${area}`
    );
    return res;
  } else if (command === "day finish") {
    return {
      type: "component",
      command: originalCommand,
      componentOutput: DayFinish,
      props: { username },
    };
  } else if (command === "my stats") {
    return {
      type: "component",
      command: originalCommand,
      componentOutput: MyStats,
      props: { username },
    };
  } else if (command === "my history") {
    const fileName = "history-ricco.json";
    return {
      type: "component",
      command: originalCommand,
      componentOutput: MyHistory,
      props: { fileName },
    };
  } else if (command === "top learned topics") {
    const fileName = "history-ricco.json";
    return {
      type: "component",
      command: originalCommand,
      componentOutput: TopTopics,
      props: { fileName },
    };
  } else if (command === "top learned topics - chart") {
    const fileName = "history-ricco.json";
    return {
      type: "component",
      command: originalCommand,
      componentOutput: TopTopics,
      props: { fileName, chart: true },
    };
  } else if (command === "daily result") {
    const fileName = "history-ricco.json";
    return {
      type: "component",
      command: originalCommand,
      componentOutput: DailyProgress,
      props: { fileName },
    };
  } else if (command === "quit") {
    return CmdsMethods.logout();
  } else {
    const res = CmdsMethods.responseTextOutput(originalCommand, "error");
    return res;
  }
};
