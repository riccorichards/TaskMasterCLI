"use client";

const MemoizedNewCmd = React.lazy(() => import("@/components/NewCommand"));
const IntroDetails = React.lazy(() => import("@/components/IntroDetails"));
const SubmitDoneTask = React.lazy(() => import("@/components/SubmitDoneTask"));
const MemoizedTerminal = React.lazy(() => import("@/components/Terminal"));
import { useAuthStore } from "@/store/AuthStore";
import { useTimerStore } from "@/store/TimerStore";
import { ComponentCommand, TextCommand } from "@/types/type";
import Context from "@/utils/Context";
import { defineProcess } from "@/utils/defineProcess";
import { isRuntimer } from "@/utils/timerUtils";
import React, { Suspense, useState, useEffect, useRef } from "react";

export type Command = TextCommand | ComponentCommand;

export default function Home() {
  const { user } = useAuthStore();
  const [terminalPlace, setTerminalPlace] = useState<string>("/unauthorized");
  const [input, setInput] = useState<string>("");
  const [commands, setCommands] = useState<Command[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const isExistRunTimeCmd = useRef<boolean>(false);
  const { ms } = useTimerStore();
  const [userFromStorage, setUserFromStorage] = useState<string | null>(null);
  const [runingTaskId, setRunningTaskId] = useState<number | null>(null);
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
    if (ms && runingTaskId) {
      const defineUser = user || userFromStorage;
      const newCommandRespose = {
        type: "component",
        command: `Beta version/${defineUser}${terminalPlace}/> completion process...`,
        componentOutput: SubmitDoneTask,
        props: { ms, taskId: runingTaskId, username: defineUser },
      };
      setCommands((prev) => [...prev, newCommandRespose as Command]);
    }
  }, [ms, terminalPlace, userFromStorage, runingTaskId, user]);

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
    isExistRunTimeCmd.current = isRuntimer("run timer for", commands, "timer");
  }, [commands]);

  const processCommand = async (command: string): Promise<Command | void> => {
    const outPut = await defineProcess({
      originalCommand: command,
      reset,
      resetExceptTimerCmds,
      setTerminalPlace,
      terminalPlace,
      isRunTimer: isExistRunTimeCmd.current,
      setRunningTaskId,
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
    <Context.Provider
      value={{
        removeCommand,
        runingTaskId,
        isRunTimer: isExistRunTimeCmd.current,
      }}
    >
      <div className="flex flex-col gap-1">
        {terminalPlace === "/unauthorized" && (
          <Suspense fallback={<div>Loading...</div>}>
            <IntroDetails />
          </Suspense>
        )}
        <Suspense fallback={<div>Loading...</div>}>
          <MemoizedTerminal commands={commands} inputRef={inputRef} />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <MemoizedNewCmd
            setInput={setInput}
            handleCommand={handleCommand}
            terminalPlace={terminalPlace}
            input={input}
            inputRef={inputRef}
            commands={commands}
            userRef={userFromStorage}
          />
        </Suspense>
      </div>
    </Context.Provider>
  );
}
