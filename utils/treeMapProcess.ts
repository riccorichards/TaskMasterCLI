import TreeMap from "@/components/TreeMap";
import { logout, responseTextOutput } from "./toolsUtils";
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
  const insertMainNodeRegax = /^insert node:\s*(.+)$/;
  const insertChild = /^insert child where node =\s*(.+?)\s*add\s*(.+)$/;
  const removeNodeRegax = /^remove node where node =\s*(.+)$/;
  const updateNode = /^update node where node =\s*(.+?)\s*set\s*(.+)$/;

  if (insertMainNodeRegax.test(command)) {
    const matched = command.match(insertMainNodeRegax);
    if (matched) {
      const [, node] = matched;
      const res = await insertMainNode({ node, username });

      if (res.status === "success") {
        return {
          type: "component",
          command: originalCommand,
          componentOutput: TreeMap,
          props: { username },
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
      props: { username },
    };
  } else if (insertChild.test(command)) {
    const matched = command.match(insertChild);
    if (matched) {
      const [, path, node] = matched;
      const res = await insertChildToNode({
        path,
        node,
        username,
      });

      if (res.status === "success")
        return {
          type: "component",
          command: originalCommand,
          componentOutput: TreeMap,
          props: { username },
        };

      return responseTextOutput(originalCommand, "error", "", res.message);
    }
  } else if (removeNodeRegax.test(command)) {
    const matched = command.match(removeNodeRegax);
    if (matched) {
      const [, node] = matched;
      const method = command.split(" ")[0];
      const res = await updateNodeInTree({ username, node, method });

      if (res.status === "success")
        return {
          type: "component",
          command: originalCommand,
          componentOutput: TreeMap,
          props: { username },
        };

      return responseTextOutput(originalCommand, "error", "", res.message);
    }
  } else if (updateNode.test(command)) {
    const matched = command.match(updateNode);
    if (matched) {
      const [, node, updatedNodeName] = matched;
      const method = command.split(" ")[0];
      const res = await updateNodeInTree({
        username,
        node,
        method,
        updatedNodeName,
      });

      if (res.status === "success")
        return {
          type: "component",
          command: originalCommand,
          componentOutput: TreeMap,
          props: { username },
        };

      return responseTextOutput(originalCommand, "error", "", res.message);
    }
  } else if (command === "quit") {
    return logout();
  } else {
    const res = responseTextOutput(originalCommand, "error");
    return res;
  }
};
