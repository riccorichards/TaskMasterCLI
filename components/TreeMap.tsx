import CmdsMethods from "@/utils/methods";
import RoadMapEchart from "echarts-for-react";
import { useEffect, useState } from "react";

const TreeMap = () => {
  const [mapTree, setMapTree] = useState<any>(null);

  const handleRetrieveFile = async () => {
    const fileName = "mapTree-ricco.json";
    try {
      const res = await CmdsMethods.retrieveFile(fileName);

      if (res) setMapTree(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleRetrieveFile();
  }, []);

  if (!mapTree) return <div>Loading...</div>;

  const option = {
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
    },
    series: [
      {
        type: "tree",
        data: [mapTree.userTree],
        left: "2%",
        right: "2%",
        top: "30.5%",
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
    <div className="fixed top-0 right-5 h-full w-1/3 rounded-md bg-black flex justify-center items-center z-10">
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
