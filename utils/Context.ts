import { createContext } from "react";

interface CommandsState {
  removeCommand: (commandToRemove: string) => void;
}

const Context = createContext<CommandsState | null>(null);

export default Context;
