import TreeMap from "@/components/TreeMap";
import { capitalized, logout, responseTextOutput } from "./toolsUtils";
import {
  insertChildToNode,
  insertMainNode,
  updateNodeInTree,
} from "./treeUtils";
import mainTerminalCmd from "./mainTerminalCmd";
import { Command } from "@/app/page";
import { parametersType } from "./defineProcess";

interface TreeMapType extends parametersType {
  command: string;
  username: string;
}

export const treeMapProcess = async ({
  originalCommand,
  command,
  reset,
  resetExceptTimerCmds,
  isRunTimer,
  setTerminalPlace,
  username,
}: TreeMapType): Promise<Command | void> => {
  const insertMainNodeRegax = /^insert node\s*(.+)$/;
  const insertChild = /^insert child where node =\s*(.+?)\s*add\s*(.+)$/;
  const removeNodeRegax = /^remove node where node =\s*(.+)$/;
  const updateNode = /^update node where node =\s*(.+?)\s*set\s*(.+)$/;

  const fileName = `mapTree-${username}.json`;
  if (insertMainNodeRegax.test(command)) {
    const matched = command.match(insertMainNodeRegax);
    if (matched) {
      const [, mainNode] = matched;
      const res = await insertMainNode({ mainNode, username });

      if (res.status === "success") {
        return {
          type: "component",
          command: originalCommand,
          componentOutput: TreeMap,
          props: { fileName },
        };
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
  } else if (command === "show map tree") {
    return {
      type: "component",
      command: originalCommand,
      componentOutput: TreeMap,
      props: { fileName },
    };
  } else if (insertChild.test(command)) {
    const matched = command.match(insertChild);
    if (matched) {
      const [, nodeName, childName] = matched;
      const res = await insertChildToNode({
        nodeName: capitalized(nodeName),
        childName: capitalized(childName),
        fileName,
      });

      if (res.status === "success")
        return {
          type: "component",
          command: originalCommand,
          componentOutput: TreeMap,
          props: { fileName },
        };

      return responseTextOutput(originalCommand, "error", "", res.message);
    }
  } else if (removeNodeRegax.test(command)) {
    const matched = command.match(removeNodeRegax);
    if (matched) {
      const [, nodeName] = matched;
      const method = command.split(" ")[0];
      const res = await updateNodeInTree({ fileName, nodeName, method });

      if (res.status === "success")
        return {
          type: "component",
          command: originalCommand,
          componentOutput: TreeMap,
          props: { fileName },
        };

      return responseTextOutput(originalCommand, "error", "", res.message);
    }
  } else if (updateNode.test(command)) {
    const matched = command.match(updateNode);
    if (matched) {
      const [, nodeName, updatedNodeName] = matched;
      const method = command.split(" ")[0];
      const res = await updateNodeInTree({
        fileName,
        nodeName,
        method,
        updatedNodeName,
      });

      if (res.status === "success")
        return {
          type: "component",
          command: originalCommand,
          componentOutput: TreeMap,
          props: { fileName },
        };

      return responseTextOutput(originalCommand, "error", "", res.message);
    }
  } else if (command === "close map tree") {
    return {
      type: "component",
      command: originalCommand,
      componentOutput: TreeMap,
      props: { fileName, close: true },
    };
  } else if (command === "quit") {
    return logout();
  } else {
    const res = responseTextOutput(originalCommand, "error");
    return res;
  }
};
