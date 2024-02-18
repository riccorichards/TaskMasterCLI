import CmdsMethods from "@/utils/methods";

const Help = () => {
  const cmds = CmdsMethods.help();

  return (
    <div className="flex flex-col gap-3 pt-3  text-white">
      {cmds.map((cmd) => (
        <div key={cmd.id} className="border-b border-gray-600 pb-2">
          <span className="font-bold">{cmd.title}</span>
          <span className="pl-2 text-gray-400">{cmd.desc}</span>
        </div>
      ))}
    </div>
  );
};

export default Help;
