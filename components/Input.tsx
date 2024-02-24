"use client";

import { Command } from "@/app/page";
import React, { FC, useEffect, useRef, useState } from "react";

export interface InputProps {
  input: string;
  setInput: (value: string) => void;
  handleCommand: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  commands: Command[];
}

const Input: FC<InputProps> = ({
  input,
  setInput,
  handleCommand,
  commands,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [commands, inputRef]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

 
  return (
    <input
      ref={inputRef}
      className="cli-input"
      value={input}
      onChange={handleInput}
      onKeyDown={handleCommand}
    />
  );
};

export default Input;
