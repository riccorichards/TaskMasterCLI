"use client";

import Input from "@/components/Input";
import IntroDetails from "@/components/IntroDetails";
import MemoizedNewCmd from "@/components/NewCommand";
import SubmitDoneTask from "@/components/SubmitDoneTask";
import MemoizedTerminal from "@/components/Terminal";
import { useAuthStore } from "@/store/AuthStore";
import { useTimerStore } from "@/store/TimerStore";
import Context from "@/utils/Context";
import { defineProcess } from "@/utils/defineProcess";
import CmdsMethods from "@/utils/methods";
import { useState, useEffect, useRef } from "react";

export type TextCommand = {
  type: "text";
  command: string;
  textOutput: string;
};

type ComponentCommand = {
  type: "component";
  command: string;
  componentOutput: React.ComponentType<any>;
  props: any;
};

export type Command = TextCommand | ComponentCommand;

export default function Home() {
  const { user } = useAuthStore();
  const [terminalPlace, setTerminalPlace] = useState<string>("/unauthorized");
  const [input, setInput] = useState<string>("");
  const [commands, setCommands] = useState<Command[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const isExistRunTimeCmd = useRef<boolean>(false);
  const { ms, taskTitle } = useTimerStore();
  const [userFromStorage, setUserFromStorage] = useState<string | null>(null);

  useEffect(() => {
    const takeUserFromLocalStorage = () => {
      const getUser = localStorage.getItem("CLI-user");
      if (getUser) {
        setUserFromStorage(JSON.parse(getUser));
      }
    };

    takeUserFromLocalStorage();

    window.addEventListener("storage", takeUserFromLocalStorage);

    return () => {
      window.removeEventListener("storage", takeUserFromLocalStorage);
    };
  }, []);

  const handleCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input) {
      const newCommand =
        user || userFromStorage
          ? `Beta version/${
              user || userFromStorage
            }${terminalPlace}/> ${input.trim()}`
          : `Beta version${terminalPlace}/> ${input.trim()}`;

      const output = await processCommand(newCommand);

      if (output) {
        setCommands([...commands, output]);
      }

      setInput("");
    }
  };

  useEffect(() => {
    if (user || userFromStorage) {
      return setTerminalPlace("/basic");
    }
  }, [user, userFromStorage]);

  useEffect(() => {
    if (ms && taskTitle) {
      const newCommandRespose = {
        type: "component",
        command: `Beta version/${
          user || userFromStorage
        }${terminalPlace}/> completion process...`,
        componentOutput: SubmitDoneTask,
        props: { ms, taskTitle },
      };
      setCommands((prev) => [...prev, newCommandRespose as Command]);
    }
  }, [ms, taskTitle, terminalPlace, userFromStorage, user]);

  const reset = () => {
    setCommands([]);
  };

  const resetExceptTimerCmds = () => {
    const cmdTimer = "timer";
    const filteredCmds = commands.filter((cmd) => {
      const cmdWords = cmd.command.split(" ");
      return cmdWords.includes(cmdTimer) && cmd.type === "component";
    });
    setCommands(filteredCmds);
  };

  useEffect(() => {
    isExistRunTimeCmd.current = CmdsMethods.isRuntimer(
      "run timer for",
      commands,
      "timer"
    );
  }, [commands]);

  const processCommand = async (command: string): Promise<Command | void> => {
    const outPut = await defineProcess({
      originalCommand: command,
      reset,
      resetExceptTimerCmds,
      setTerminalPlace,
      terminalPlace,
      isRunTimer: isExistRunTimeCmd.current,
    });
    return outPut;
  };

  const removeCommand = (commandToRemove: string): void => {
    setCommands((currentCommands) =>
      currentCommands.filter(
        (cmd) => cmd.command.split("/>")[1].trim() !== commandToRemove
      )
    );
  };

  return (
    <Context.Provider value={{ removeCommand }}>
      <div className="flex flex-col gap-1">
        {terminalPlace === "/unauthorized" && <IntroDetails />}
        <MemoizedTerminal commands={commands} inputRef={inputRef} />
        <MemoizedNewCmd
          setInput={setInput}
          handleCommand={handleCommand}
          terminalPlace={terminalPlace}
          input={input}
          commands={commands}
          userRef={userFromStorage}
        />
      </div>
    </Context.Provider>
  );
}
