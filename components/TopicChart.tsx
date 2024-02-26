import { TopTopicType } from "@/types/type";
import Chart from "echarts-for-react";
import { FC } from "react";

const TopicChart: FC<{ topTopic: TopTopicType[] }> = ({ topTopic }) => {
  const option = {
    title: {
      text: "Top Learned Topics",
      left: "center",
      top: 20,
      textStyle: {
        color: "#ccc",
      },
    },
    tooltip: {
      trigger: "item",
    },
    visualMap: {
      show: false,
      min: 20,
      max: 200,
      inRange: {
        colorLightness: [1, 0],
      },
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "55%",
        center: ["50%", "50%"],
        data: topTopic,
        roseType: "radius",
        label: {
          color: "#fff",
        },
        labelLine: {
          lineStyle: {
            color: "#01c380",
          },
          smooth: 0.1,
          length: 5,
          length2: 10,
        },
        itemStyle: {
          color: "#01c380",
          shadowBlur: 400,
          shadowColor: "rgba(0, 0, 0, 0.8)",
        },
        animationType: "scale",
        animationEasing: "elasticOut",
      },
    ],
  };

  return (
    <div className="w-2/3">
      <Chart option={option} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default TopicChart;
