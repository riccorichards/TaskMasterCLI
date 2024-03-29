import { retrieveFile } from "@/utils/treeUtils";
import RoadMapEchart from "echarts-for-react";
import { FC, useEffect, useState } from "react";

const TreeMap: FC<{ username: string; close?: boolean }> = ({
  username,
  close = false,
}) => {
  const [mapTree, setMapTree] = useState<any>(null);

  useEffect(() => {
    if (username) {
      const handleRetrieveFile = async () => {
        const res = await retrieveFile(username);

        if (res.status === "success") return setMapTree(res.data);

        return setMapTree(res.message);
      };

      handleRetrieveFile();
    }
  }, [username]);

  if (!mapTree) return <div>Loading...</div>;

  const option = {
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
    },
    series: [
      {
        type: "tree",
        data: [mapTree],
        left: "2%",
        right: "2%",
        top: "40.5%",
        bottom: "10%",
        symbol: "emptyCircle",
        orient: "BT",
        expandAndCollapse: true,
        label: {
          position: "bottom",
          rotate: 0,
          verticalAlign: "top",
          align: "center",
        },
        leaves: {
          label: {
            position: "top",
            rotate: 90,
            verticalAlign: "middle",
            align: "left",
          },
        },
        emphasis: {
          focus: "descendant",
        },
        animationDurationUpdate: 750,
      },
    ],
  };

  return (
    <div className="fixed top-0 right-5 h-full w-2/3 rounded-md bg-black flex justify-center items-center z-10">
      {mapTree && (
        <RoadMapEchart
          option={option}
          style={{ width: "100%", height: "100vh" }}
        />
      )}
    </div>
  );
};

export default TreeMap;
