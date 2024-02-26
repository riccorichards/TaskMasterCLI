import { Command } from "@/app/page";
import { parametersType } from "./defineProcess";
import MemoizeTimer from "@/components/Timer";
import mainTerminalCmd from "./mainTerminalCmd";
import { logout, responseTextOutput } from "./toolsUtils";
import { defineCorrectTitle } from "./timerUtils";

interface TimerType extends parametersType {
  command: string;
  username: string;
}

export const timerProcess = async ({
  originalCommand,
  command,
  reset,
  resetExceptTimerCmds,
  isRunTimer,
  setTerminalPlace,
  username,
  setRunningTaskId,
}: TimerType): Promise<Command | void> => {
  const runTimerRegax = /^run timer for\s*(.+)$/;

  if (runTimerRegax.test(command)) {
    const matched = command.match(runTimerRegax);
    if (matched) {
      const [, title] = matched;

      const validTitleId = await defineCorrectTitle(username, title);

      if (!validTitleId)
        return responseTextOutput(
          originalCommand,
          "error",
          "",
          "Invalid title!"
        );
      setRunningTaskId(validTitleId as number);
      return {
        type: "component",
        command: originalCommand,
        componentOutput: MemoizeTimer,
        props: { title: title, username },
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
    return logout();
  } else {
    const res = responseTextOutput(
      originalCommand,
      "error",
      `Error: Unknown command: ${command}!`
    );
    return res;
  }
};
