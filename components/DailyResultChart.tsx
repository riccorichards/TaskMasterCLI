import EChartsReact from "echarts-for-react";
import { FC } from "react";

const DailyResultChart: FC<{ result: { date: string; value: number }[] }> = ({
  result,
}) => {
  const option = {
    xAxis: {
      type: "category",
      data: result.map((day) => day.date),
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#01c380",
        fontSize: 12,
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        data: result.map((day) => day.value),
        type: "line",
        smooth: true,
        lineStyle: {
          color: "#01c380",
          width: 4,
        },
        symbol: "circle",
        symbolSize: 10,
        itemStyle: {
          color: "#01c380",
        },
      },
    ],
    tooltip: {
      backgroundColor: "#01c380",
      borderColor: "white",
      textStyle: {
        color: "black",
        fontSize: 14,
      },
    },
  };
  return (
    <div>
      <EChartsReact option={option} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default DailyResultChart;
