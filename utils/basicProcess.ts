const DailyProgress = React.lazy(() => import("@/components/DailyProgress"));
const TopTopics = React.lazy(() => import("@/components/TopTopics"));
const MyHistory = React.lazy(() => import("@/components/MyHistory"));
const MyStats = React.lazy(() => import("@/components/MyStats"));
const DayFinish = React.lazy(() => import("@/components/DayFinish"));
const TasksList = React.lazy(() => import("@/components/TasksList"));
const Notes = React.lazy(() => import("@/components/Notes"));

import mainTerminalCmd from "./mainTerminalCmd";
import { parametersType } from "./defineProcess";
import { Command } from "@/app/page";
import { capitalized, logout, responseTextOutput } from "./toolsUtils";
import { addTask, editTask, removeTask } from "./taskUtils";
import {
  addHrsForPeriod,
  addPeriod,
  updatePeriodDuration,
  validateDate,
} from "./statsUtils";
import { addNote, doneNote, removeNote } from "./noteUtils";
import React from "react";

interface BasicParamsType extends parametersType {
  command: string;
}

const insertDailyRegax = /^insert daily task title =\s*(.+),\s*desc =(.+)$/;
const editTaskTitleRegex =
  /^edit task where id =\s*(.+?)\s*set title =\s*(.+)$/;
const editTaskDescRegex = /^edit task where id =\s*(.+?)\s*set desc =\s*(.+)$/;
const editTaskRegex =
  /^edit task where id =\s*(.+?)\s*set title =\s*(.+?),\s*desc =\s*(.+)$/;
const removeTaskRegax = /^remove task where id =\s*(.+)$/;
const insertNoteRegax =
  /^insert note title =\s*(.+?),\s*desc =\s*(.+?),\s*deadline =\s*(.+)$/;
const doneNoteRegax =
  /^done note where id =\s*(.+?)\s*set complete =\s*(true|false)$/;
const removeNoteRegax = /^remove note where id =\s*(.+)$/;
const addJourneyDurationRegax = /^insert learning duration\s*(.+)$/;
const insertTimeForPerionRegax = /^insert time for learning duration\s*(.+)$/;
const updatePeriodTime =
  /^update learning duration for -U\s*(.+?)\s* set duration =\s*(.+?),\s*hours =\s*(.+)$/;
const validPeriodFormat =
  /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
export const basicProcess = async ({
  originalCommand,
  command,
  reset,
  resetExceptTimerCmds,
  isRunTimer,
  setTerminalPlace,
}: BasicParamsType): Promise<Command | void> => {
  const username = originalCommand.split("/")[1];

  if (insertDailyRegax.test(command)) {
    const matched = command.match(insertDailyRegax);
    if (matched) {
      let [, title, desc] = matched;
      title = capitalized(title);
      desc = capitalized(desc);
      const res = await addTask({ username, title, desc });

      if (res?.status === "success") {
        return responseTextOutput(
          originalCommand,
          "success",
          "Success: Task was added"
        );
      }

      return responseTextOutput(originalCommand, "error", "", res.message);
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
      const check = validateDate(period);
      if (!check)
        return responseTextOutput(
          originalCommand,
          "error",
          "",
          "Invalid period format => 2024-01-31"
        );
      const res = await addPeriod({ period, username });
      if (res.status === "success")
        return responseTextOutput(
          originalCommand,
          "success",
          "add journey duration!"
        );

      return responseTextOutput(originalCommand, "error", "", res.message);
    }
  } else if (insertTimeForPerionRegax.test(command)) {
    const matched = command.match(insertTimeForPerionRegax);
    if (matched) {
      const [, hrs] = matched;
      const res = await addHrsForPeriod({
        sumTimeHrs: Number(hrs),
        username,
      });
      if (res.status === "success")
        return responseTextOutput(
          originalCommand,
          "success",
          "Period time was added!"
        );

      return responseTextOutput(originalCommand, "error", "", res.message);
    }
  } else if (updatePeriodTime.test(command)) {
    const matched = command.match(updatePeriodTime);
    if (matched) {
      const [, username, period, hrs] = matched;
      const check = validateDate(period);
      if (!check)
        return responseTextOutput(
          originalCommand,
          "error",
          "",
          "Invalid period format => 2024-01-31"
        );
      const res = await updatePeriodDuration({
        username,
        period,
        sumTimeHrs: Number(hrs),
      });
      if (res.status === "success")
        return responseTextOutput(
          originalCommand,
          "success",
          "updated period time!"
        );

      return responseTextOutput(originalCommand, "error", "", res.message);
    }
  } else if (
    editTaskRegex.test(command) ||
    editTaskDescRegex.test(command) ||
    editTaskTitleRegex.test(command)
  ) {
    const matchedToBoth = editTaskRegex.test(command)
      ? command.match(editTaskRegex)
      : null;
    const matchedToTitle =
      !matchedToBoth && editTaskTitleRegex.test(command)
        ? command.match(editTaskTitleRegex)
        : null;
    const matchedToDesc =
      !matchedToBoth && !matchedToTitle && editTaskDescRegex.test(command)
        ? command.match(editTaskDescRegex)
        : null;

    let taskId, title, desc;

    if (matchedToBoth) {
      [, taskId, title, desc] = matchedToBoth;
    } else if (matchedToTitle) {
      [, taskId, title] = matchedToTitle;
      desc = undefined;
    } else if (matchedToDesc) {
      [, taskId, desc] = matchedToDesc;
      title = undefined;
    }

    if (matchedToBoth || matchedToTitle || matchedToDesc) {
      taskId = parseInt(taskId || "", 10);
      const res = await editTask({
        taskId,
        title,
        desc,
        username,
      });

      if (res.status === "success") {
        return responseTextOutput(
          originalCommand,
          "success",
          "Success: updated task!"
        );
      } else {
        return responseTextOutput(originalCommand, "error", "", res.message);
      }
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
      const [, taskId] = matched;
      const res = await removeTask({ taskId, username });
      if (res.status === "success")
        return responseTextOutput(
          originalCommand,
          "success",
          "Success: removed record!"
        );

      return responseTextOutput(originalCommand, "error", "", res.message);
    }
  } else if (insertNoteRegax.test(command)) {
    const matched = command.match(insertNoteRegax);
    if (matched) {
      const [, title, desc, deadline] = matched;
      const check = validateDate(deadline);
      if (!check)
        return responseTextOutput(
          originalCommand,
          "error",
          "",
          "Invalid deadline format => 2024-01-31"
        );
      const res = await addNote({ title, desc, deadline, username });
      if (res.status === "success")
        return responseTextOutput(
          originalCommand,
          "success",
          "Note was added!"
        );

      return responseTextOutput(originalCommand, "error", "", res.message);
    }
  } else if (doneNoteRegax.test(command)) {
    const matched = command.match(doneNoteRegax);
    if (matched) {
      const [, noteId, complete] = matched;
      const res = await doneNote({
        noteId,
        complete: Boolean(complete),
        username,
      });
      if (res.status === "success")
        return responseTextOutput(
          originalCommand,
          "success",
          "note is finished!"
        );

      return responseTextOutput(originalCommand, "error", "", res.message);
    }
  } else if (removeNoteRegax.test(command)) {
    const matched = command.match(removeNoteRegax);
    if (matched) {
      const [, noteId] = matched;
      const res = await removeNote(noteId, username);
      if (res.status === "success")
        return responseTextOutput(originalCommand, "success", "removed note!");

      return responseTextOutput(originalCommand, "error", "", res.message);
    }
  } else if (command === "select * from note") {
    return {
      type: "component",
      command: originalCommand,
      componentOutput: Notes,
      props: { username },
    };
  } else if (command === "/c timer" || command === "/c tree") {
    const area = command.split("/c")[1];
    const res = responseTextOutput(
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
      props: { fileName, username },
    };
  } else if (command === "top learned topics") {
    return {
      type: "component",
      command: originalCommand,
      componentOutput: TopTopics,
      props: { username },
    };
  } else if (command === "top learned topics with chart") {
    return {
      type: "component",
      command: originalCommand,
      componentOutput: TopTopics,
      props: { chart: true, username },
    };
  } else if (command === "daily result") {
    return {
      type: "component",
      command: originalCommand,
      componentOutput: DailyProgress,
      props: { username },
    };
  } else if (command === "daily result with chart") {
    return {
      type: "component",
      command: originalCommand,
      componentOutput: DailyProgress,
      props: { username, chart: true },
    };
  } else if (command === "quit") {
    return logout();
  } else {
    return responseTextOutput(originalCommand, "error");
  }
};
