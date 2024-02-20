import { Command } from "@/app/page";
import React, { FC, useEffect } from "react";

const Terminal: FC<{
  commands: Command[];
  inputRef: React.RefObject<HTMLInputElement>;
  terminalPlace: string;
}> = ({ commands, inputRef }) => {
  useEffect(() => {
    const inputElement = inputRef.current;
    if (inputElement) {
      const { bottom } = inputElement?.getBoundingClientRect();
      const viewportY = window.innerHeight;

      if (viewportY - bottom < 50) {
        inputElement.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  }, [commands, inputRef]);
  
  return (
    <div className="cli-output">
      {commands.map((cmd, index) => (
        <div key={index}>
          <div>{cmd.command}</div>
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
  );
};

const MemoizedTerminal = React.memo(Terminal);

export default MemoizedTerminal;
