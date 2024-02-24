import React, { FC } from "react";
import { InputProps } from "./Input";
import Input from "@/components/Input";
import { useAuthStore } from "@/store/AuthStore";

interface NewCommandType extends InputProps {
  terminalPlace: string;
  userRef: string | null;
}

const NewCommand: FC<NewCommandType> = ({
  input,
  setInput,
  handleCommand,
  commands,
  terminalPlace,
  userRef,
}) => {
  const { user } = useAuthStore();
  return (
    <span className="flex gap-2 items-center">
      <span className="whitespace-nowrap">
        {user || userRef
          ? `Beta version/${user || userRef}${terminalPlace}/>`
          : `Beta version${terminalPlace}/>`}
      </span>{" "}
      <Input
        input={input}
        setInput={setInput}
        handleCommand={handleCommand}
        commands={commands}
      />
    </span>
  );
};

const MemoizedNewCmd = React.memo(NewCommand);

export default MemoizedNewCmd;
