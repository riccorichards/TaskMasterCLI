import { FC } from "react";

const TreeMap: FC<{ mainNode: string }> = ({ mainNode }) => {
  return (
    <div className="fixed top-0 right-5 h-full w-1/3 rounded-md bg-black border-4 flex justify-center items-center z-10">
      <div className="flex-col items-center gap-5">
        <h1>Map Tree</h1>
        <h3>{mainNode}</h3>
      </div>
    </div>
  );
};

export default TreeMap;
