import { Command } from "@/app/page";
import CmdsMethods from "./methods";
import mainTerminalCmd from "./mainTerminalCmd";
import MemoizeTimer from "@/components/Timer";
import TreeMap from "@/components/TreeMap";

interface parametersType {
  originalCommand: string;
  reset: () => void;
  resetExceptTimerCmds: () => void;
  setTerminalPlace: (v: string) => void;
  terminalPlace: string;
  isRunTimer: boolean;
}

export async function defineProcess(
  parameters: parametersType
): Promise<Command | void> {
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
  const insertMainNode = /^insert node:\s*(.+)$/;
  const insertChild = /^insert child where node =\s*(.+?)\s*add\s*(.+)$/;
  const removeNode = /^remove node where nodeName =\s*(.+)$/;
  const updateNode = /^update node where nodeName =\s*(.+?)\s*set\s*(.+)$/;

  switch (terminalPlace.split("/")[1]) {
    case "basic":
      if (insertDailyRegax.test(command)) {
        const matched = command.match(insertDailyRegax);
        if (matched) {
          const [, title, desc] = matched;
          const res = await CmdsMethods.addTask({ title, desc });

          if (res) {
            return CmdsMethods.responseTextOutput(
              originalCommand,
              "success",
              "Success: Task was added"
            );
          }
          return CmdsMethods.responseTextOutput(originalCommand, "error");
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
          const res = await CmdsMethods.addPeriod(period);
          if (res)
            return CmdsMethods.responseTextOutput(
              originalCommand,
              "success",
              "Success: Period was added"
            );

          return CmdsMethods.responseTextOutput(originalCommand, "error");
        }
      } else if (insertTimeForPerionRegax.test(command)) {
        const matched = command.match(insertTimeForPerionRegax);
        if (matched) {
          const [, timeStatsID, hrs] = matched;
          const res = await CmdsMethods.addHrsForPeriod({
            sumTimeHrs: Number(hrs),
            timeStatsID,
          });
          if (res)
            return CmdsMethods.responseTextOutput(
              originalCommand,
              "success",
              "Success: Period was added"
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
              "Success: Period was added"
            );

          return CmdsMethods.responseTextOutput(originalCommand, "error");
        }
      } else if (doneTaskRegax.test(command)) {
        const matched = command.match(doneTaskRegax);
        if (matched) {
          const [, taskId, done, spendMs] = matched;
          const res = await CmdsMethods.doneTask({
            taskId,
            done: Boolean(done),
            spendMs: Number(spendMs),
          });
          if (res)
            return CmdsMethods.responseTextOutput(
              originalCommand,
              "success",
              "Success: Period was added"
            );

          return CmdsMethods.responseTextOutput(originalCommand, "error");
        }
      } else if (retrieveTaskRegax.test(command)) {
        const matched = command.match(retrieveTaskRegax);
        if (matched) {
          const [, taskId] = matched;
          const res = await CmdsMethods.getTaskByIdFromDailyTask({
            taskId,
          });
          if (res)
            return CmdsMethods.responseTextOutput(
              originalCommand,
              "success",
              "Success: Period was added"
            );

          return CmdsMethods.responseTextOutput(originalCommand, "error");
        }
      } else if (command === "select * from dailyTask") {
        const res = await CmdsMethods.getTasksfromDailyTask();
        if (res)
          return CmdsMethods.responseTextOutput(
            originalCommand,
            "success",
            "Success: Period was added"
          );

        return CmdsMethods.responseTextOutput(originalCommand, "error");
      } else if (removeTaskRegax.test(command)) {
        const matched = command.match(removeTaskRegax);
        if (matched) {
          const [, taskId] = matched;
          const res = await CmdsMethods.removeTask(taskId);
          if (res)
            return CmdsMethods.responseTextOutput(
              originalCommand,
              "success",
              "Success: Period was added"
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
              "Success: Period was added"
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
              "Success: Period was added"
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
              "Success: Period was added"
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
    case "tree":
      if (insertMainNode.test(command)) {
        const matched = command.match(insertMainNode);
        if (matched) {
          const [, mainNode] = matched;
          const res = await CmdsMethods.insertMainNode(mainNode);

          if (!res)
            return CmdsMethods.responseTextOutput(originalCommand, "error");

          return {
            type: "component",
            command: originalCommand,
            componentOutput: TreeMap,
            props: "",
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
      } else if (command === "show map tree") {
        return {
          type: "component",
          command: originalCommand,
          componentOutput: TreeMap,
          props: "",
        };
      } else if (insertChild.test(command)) {
        const matched = command.match(insertChild);
        if (matched) {
          const user = "ricco";
          const [, nodeName, childName] = matched;
          const res = await CmdsMethods.insertChildToNode(
            nodeName,
            childName,
            user
          );

          if (res)
            return {
              type: "component",
              command: originalCommand,
              componentOutput: TreeMap,
              props: "",
            };

          return CmdsMethods.responseTextOutput(originalCommand, "error");
        }
      } else if (removeNode.test(command)) {
        const matched = command.match(removeNode);
        if (matched) {
          const user = "ricco";
          const [, nodeName] = matched;
          const method = command.split(" ")[0];
          const res = await CmdsMethods.removeNode(user, nodeName, method);

          if (res)
            return {
              type: "component",
              command: originalCommand,
              componentOutput: TreeMap,
              props: "",
            };

          return CmdsMethods.responseTextOutput(originalCommand, "error");
        }
      } else if (updateNode.test(command)) {
        const matched = command.match(updateNode);
        if (matched) {
          const user = "ricco";
          const [, nodeName, updateNodeName] = matched;
          const method = command.split(" ")[0];
          const res = await CmdsMethods.removeNode(user, nodeName, method, updateNodeName);

          if (res)
            return {
              type: "component",
              command: originalCommand,
              componentOutput: TreeMap,
              props: "",
            };

          return CmdsMethods.responseTextOutput(originalCommand, "error");
        }
      } else {
        const res = CmdsMethods.responseTextOutput(originalCommand, "error");
        return res;
      }
  }
}
