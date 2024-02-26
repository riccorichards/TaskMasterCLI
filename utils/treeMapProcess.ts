import TreeMap from "@/components/TreeMap";
import { logout, responseTextOutput } from "./toolsUtils";
import { insertChildToNode, insertMainNode, removeNode } from "./treeUtils";
import mainTerminalCmd from "./mainTerminalCmd";
import { Command } from "@/app/page";
import { parametersType } from "./defineProcess";

interface TreeMapType extends parametersType {
  command: string;
}

export const treeMapProcess = async ({
  originalCommand,
  command,
  reset,
  resetExceptTimerCmds,
  isRunTimer,
  setTerminalPlace,
}: TreeMapType): Promise<Command | void> => {
  const insertMainNodeRegax = /^insert node:\s*(.+)$/;
  const insertChild = /^insert child where node =\s*(.+?)\s*add\s*(.+)$/;
  const removeNodeRegax = /^remove node where nodeName =\s*(.+)$/;
  const updateNode = /^update node where nodeName =\s*(.+?)\s*set\s*(.+)$/;

  if (insertMainNodeRegax.test(command)) {
    const matched = command.match(insertMainNodeRegax);
    if (matched) {
      const [, mainNode] = matched;
      const res = insertMainNode(mainNode);

      if (!res) return responseTextOutput(originalCommand, "error");

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
      const res = await insertChildToNode(nodeName, childName, user);

      if (res)
        return {
          type: "component",
          command: originalCommand,
          componentOutput: TreeMap,
          props: "",
        };

      return responseTextOutput(originalCommand, "error");
    }
  } else if (removeNodeRegax.test(command)) {
    const matched = command.match(removeNodeRegax);
    if (matched) {
      const user = "ricco";
      const [, nodeName] = matched;
      const method = command.split(" ")[0];
      const res = await removeNode(user, nodeName, method);

      if (res)
        return {
          type: "component",
          command: originalCommand,
          componentOutput: TreeMap,
          props: "",
        };

      return responseTextOutput(originalCommand, "error");
    }
  } else if (updateNode.test(command)) {
    const matched = command.match(updateNode);
    if (matched) {
      const user = "ricco";
      const [, nodeName, updateNodeName] = matched;
      const method = command.split(" ")[0];
      const res = await removeNode(user, nodeName, method, updateNodeName);

      if (res)
        return {
          type: "component",
          command: originalCommand,
          componentOutput: TreeMap,
          props: "",
        };

      return responseTextOutput(originalCommand, "error");
    }
  } else if (command === "close map tree") {
    return responseTextOutput(originalCommand, "success", "closed map free");
  } else if (command === "quit") {
    return logout();
  } else {
    const res = responseTextOutput(originalCommand, "error");
    return res;
  }
};
