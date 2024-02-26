import { createContext } from "react";

interface CommandsState {
  removeCommand: (commandToRemove: string) => void;
  runingTaskId: number | null;
  isRunTimer: boolean
}

const Context = createContext<CommandsState | null>(null);

export default Context;
