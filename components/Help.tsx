import CmdsMethods from "@/utils/methods";

const Help = () => {
  const cmds = CmdsMethods.help();

  return (
    <div className="flex flex-col gap-3 mt-10">
      <div className="flex flex-col">
       <span><i>LinkedIn: https://www.linkedin.com/in/riccot/</i></span>
       <span><i>Gmail: tr.riccorichards@gmail.com</i></span>
      </div>
      <h1>List of all TaskMasterCLI commands:</h1>
      <div className="flex items-center gap-2">
      <span>(/b) for basic area</span>
      <span>(/t) for timer area</span>
      <span>(/tm) for tree map area</span>
      <span>(/q) for quit</span>
      </div>
      <div>
      {cmds.map((cmd) => (
        <div key={cmd.id} className="flex flex-col">
          <span className="font-bold">{cmd.title}</span>
          <span className="">{"//"}{cmd.desc}</span>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Help;
