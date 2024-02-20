import { FC } from "react";

interface InputProps {
  inputRef: React.RefObject<HTMLInputElement>;
  input: string;
  setInput: (value: string) => void;
  handleCommand: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProps> = ({
  inputRef,
  input,
  setInput,
  handleCommand,
}) => {
  return (
    <input
      ref={inputRef}
      className="cli-input"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleCommand}
    />
  );
};

export default Input;
