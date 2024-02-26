"use client";

import { help } from "@/utils/toolsUtils";

const Help = () => {
  const cmds = help();

  return (
    <div className="flex flex-col gap-3 mt-10">
      <div className="flex flex-col">
        <span>
          <i>LinkedIn: https://www.linkedin.com/in/riccot/</i>
        </span>
        <span>
          <i>Gmail: tr.riccorichards@gmail.com</i>
        </span>
        <span>
          <i>GitHub: https://github.com/riccorichards</i>
        </span>
      </div>
      <h1>List of all TaskMasterCLI commands:</h1>
      <div>
        {cmds.map((cmd) => (
          <div key={cmd.id} className="flex flex-col">
            <span className="font-bold">{cmd.title}</span>
            <span className="">
              {"//"}
              {cmd.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Help;
