import { Command } from "@/app/page";
import CmdsMethods from "./methods";
import mainTerminalCmd from "./mainTerminalCmd";
import MemoizeTimer from "@/components/Timer";
import TreeMap from "@/components/TreeMap";

import { unauthorizedProcess } from "./unauthorizedProcess";
import { basicProcess } from "./basicProcess";

export interface parametersType {
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

  const insertMainNode = /^insert node:\s*(.+)$/;
  const insertChild = /^insert child where node =\s*(.+?)\s*add\s*(.+)$/;
  const removeNode = /^remove node where nodeName =\s*(.+)$/;
  const updateNode = /^update node where nodeName =\s*(.+?)\s*set\s*(.+)$/;

  switch (terminalPlace.split("/")[1]) {
    case "unauthorized":
      unauthorizedProcess(command, originalCommand);
      break;
    case "basic":
      await basicProcess({
        originalCommand,
        command,
        reset,
        isRunTimer,
        resetExceptTimerCmds,
        setTerminalPlace,
        terminalPlace,
      });
      break;
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
      } else if (command === "quit") {
        return CmdsMethods.logout();
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
          const res = await CmdsMethods.removeNode(
            user,
            nodeName,
            method,
            updateNodeName
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
      } else if (command === "close map tree") {
        return CmdsMethods.responseTextOutput(
          originalCommand,
          "success",
          "closed map free"
        );
      } else if (command === "quit") {
        return CmdsMethods.logout();
      } else {
        const res = CmdsMethods.responseTextOutput(originalCommand, "error");
        return res;
      }
  }
}
