"use client";

import Input from "@/components/Input";
import MemoizedTerminal from "@/components/Terminal";
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
  const [terminalPlace, setTerminalPlace] = useState<string>("/basic");
  const [input, setInput] = useState<string>("");
  const [commands, setCommands] = useState<Command[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const isExistRunTimeCmd = useRef<boolean>(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [commands]);

  const handleCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input) {
      const newCommand = `Beta version/ricco${terminalPlace}/> ${input.trim()}`;

      const output = await processCommand(newCommand);

      if (output) {
        setCommands([...commands, output]);
      }

      setInput("");
    }
  };

  useEffect(() => {
    const handleKeyboard = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (commands.length > 1) {
        if (e.key === "Up") {
          const previousCmd = commands[commands.length - 1].command;
          setInput(previousCmd);
        } else if (e.key === "Down") {
        }
      }
    };
    handleKeyboard;
  }, [commands]);

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
      <div>
        <MemoizedTerminal
          commands={commands}
          inputRef={inputRef}
          terminalPlace={terminalPlace}
        />
        <span className="flex gap-2 items-center">
          <span className="whitespace-nowrap">
            {`Beta version/ricco${terminalPlace}`}/&gt;
          </span>{" "}
          <Input
            inputRef={inputRef}
            input={input}
            setInput={setInput}
            handleCommand={handleCommand}
          />
        </span>
      </div>
    </Context.Provider>
  );
}
