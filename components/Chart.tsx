"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyFeeChartProps {
  labels: string[];
  data: number[];
  fillType?: "none" | "filled" | "gradient";
  gradientColors?: string[];
  lineColor: string;
  width?: string;
  maxWidth?: string;
  height?: string;
}

const MonthlyFeeChart: React.FC<MonthlyFeeChartProps> = ({
  labels,
  data,
  fillType = "none",
  gradientColors,
  lineColor,
  width,
  maxWidth,
  height,
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Collection Recorded",
        data,
        borderColor: lineColor,
        backgroundColor:
          fillType === "filled" ? "rgba(54, 162, 235, 0.2)" : undefined,
        borderWidth: 2,
        fill: fillType !== "none",
        tension: 0.3,
        ...(fillType === "gradient" && gradientColors
          ? {
              backgroundColor: (context: any) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(
                  0,
                  0,
                  0,
                  ctx.canvas.height
                );
                gradient.addColorStop(0, gradientColors[0]);
                gradient.addColorStop(1, gradientColors[1]);
                return gradient;
              },
            }
          : {}),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width, height, maxWidth }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MonthlyFeeChart;
