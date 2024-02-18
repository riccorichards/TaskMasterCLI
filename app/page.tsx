"use client";

import { defineProcess } from "@/utils/defineProcess";
import { useState, useEffect, useRef } from "react";

type TextCommand = {
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
  const [input, setInput] = useState<string>("");
  const [commands, setCommands] = useState<Command[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [commands]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input) {
      const newCommand = input.trim();

      const output = processCommand(newCommand);

      if (output) {
        setCommands([...commands, output]);
      }

      setInput("");
    }
  };

  const reset = () => {
    return setCommands([]);
  };

  const processCommand = (command: string): Command | void => {
    const outPut = defineProcess({ command, reset });
    return outPut;
  };

  return (
    <div>
      <div className="cli-output">
        {commands.map((cmd, index) => (
          <div key={index}>
            <div>
              <span className="whitespace-nowrap">Beta version/Ricco/&gt;</span>{" "}
              {cmd.command}
            </div>
            <div>
              {cmd.type === "text" ? (
                cmd.textOutput
              ) : cmd.type === "component" ? (
                cmd.props ? (
                  <cmd.componentOutput {...cmd.props} />
                ) : (
                  <cmd.componentOutput />
                )
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <span className="flex gap-2 items-center">
        <span className="whitespace-nowrap">Beta version/Ricco/&gt;</span>
        <input
          ref={inputRef}
          className="cli-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
        />
      </span>
    </div>
  );
}
