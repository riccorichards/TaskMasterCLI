import { Command } from "@/app/page";
import Help from "@/components/Help";
import { responseTextOutput } from "./toolsUtils";

interface TerminalOpType {
  originalCommand: string;
  reset: () => void;
  setTerminalPlace: (v: string) => void;
  isRunTime: boolean;
  resetExceptTimerCmds: () => void;
}

const mainTerminalCmd = ({
  originalCommand,
  reset,
  setTerminalPlace,
  isRunTime,
  resetExceptTimerCmds,
}: TerminalOpType): Command | void => {
  const command = originalCommand.split("/>")[1].trim();
  switch (command) {
    case "help":
      return {
        type: "component",
        command: originalCommand,
        componentOutput: Help,
        props: "",
      };
    case "clear":
      if (isRunTime) {
        const confirmReset = window.confirm(
          "Are you sure to clear the entire terminal? If so, the running timer would be cleared too!"
        );
        if (confirmReset) {
          return reset();
        }
        return responseTextOutput(
          originalCommand,
          "success",
          "Canceled clear command to avoid resetting the timer."
        );
      } else {
        return reset();
      }
    case "clear except timer command":
      resetExceptTimerCmds();
      break;
    case "/c timer":
      setTerminalPlace("/timer");
      break;
    case "/c basic":
      setTerminalPlace("/basic");
      break;
    case "/c tree":
      setTerminalPlace("/tree");
      break;
    default:
      return {
        type: "text",
        command: originalCommand,
        textOutput: "Error: Unknown command",
      };
  }
};

export default mainTerminalCmd;
