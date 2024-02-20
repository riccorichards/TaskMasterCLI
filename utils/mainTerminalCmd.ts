import { Command } from "@/app/page";
import Help from "@/components/Help";

interface TerminalOpType {
  command: string;
  reset: () => void;
  resetExceptTimerCmds: () => void;
  setTerminalPlace: (v: string) => void;
}
const mainTerminalCmd = ({
  command,
  reset,
  resetExceptTimerCmds,
  setTerminalPlace,
}: TerminalOpType): Command | void => {
  switch (command) {
    case "help":
      return {
        type: "component",
        command,
        componentOutput: Help,
        props: "",
      };
    case "clear":
      reset();
    case "clear except timer commands":
      resetExceptTimerCmds();
      break;
    case "/c timer":
      setTerminalPlace("/timer");
      break;
    case "/c general":
      setTerminalPlace("/general");
      break;
    case "/c tree":
      setTerminalPlace("/tree");
      break;
    default:
      return {
        type: "text",
        command,
        textOutput: "Error: Unknown command",
      };
  }
};

export default mainTerminalCmd;
