import { Command } from "@/app/page";

import { unauthorizedProcess } from "./unauthorizedProcess";
import { basicProcess } from "./basicProcess";
import { treeMapProcess } from "./treeMapProcess";
import { timerProcess } from "./timerProcess";

export interface parametersType {
  originalCommand: string;
  reset: () => void;
  resetExceptTimerCmds: () => void;
  setTerminalPlace: (v: string) => void;
  terminalPlace: string;
  isRunTimer: boolean;
  setRunningTaskId: (id: number) => void;
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
    setRunningTaskId,
  } = parameters;
  const command = originalCommand.split("/>")[1].trim();
  const username = originalCommand.split("/")[1];

  switch (terminalPlace.split("/")[1]) {
    case "unauthorized":
      return await unauthorizedProcess(command, originalCommand);
    case "basic":
      return await basicProcess({
        originalCommand,
        command,
        reset,
        isRunTimer,
        resetExceptTimerCmds,
        setTerminalPlace,
        terminalPlace,
        setRunningTaskId,
      });
    case "timer":
      return await timerProcess({
        originalCommand,
        command,
        reset,
        isRunTimer,
        resetExceptTimerCmds,
        setTerminalPlace,
        terminalPlace,
        username,
        setRunningTaskId,
      });
    case "tree":
      return await treeMapProcess({
        originalCommand,
        command,
        reset,
        isRunTimer,
        resetExceptTimerCmds,
        setTerminalPlace,
        terminalPlace,
        setRunningTaskId,
      });
  }
}
