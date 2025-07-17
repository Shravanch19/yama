import React, { useMemo } from "react";
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

const PerformanceChart = () => {
  const performanceChart = useMemo(() => {
    const history = [
      { date: "2025-06-10", value: 10 },
      { date: "2025-06-11", value: 15 },
      { date: "2025-06-12", value: 12 },
      { date: "2025-06-13", value: 12 },
      { date: "2025-06-14", value: 11 },
      { date: "2025-06-15", value: 13 },
      { date: "2025-06-16", value: 12 },
      { date: "2025-06-17", value: 17 },
      { date: "2025-06-18", value: 21 },
      { date: "2025-06-19", value: 19 },
    ];
    const labels = history.map((e) =>
      new Date(e.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    );
    const values = history.map((e) => e.value);
    return {
      data: {
        labels,
        datasets: [
          {
            label: "Performance",
            data: values,
            borderColor: values.at(-1) >= values[0] ? "#22c55e" : "#ef4444",
            backgroundColor:
              values.at(-1) >= values[0]
                ? "rgba(34,197,94,0.1)"
                : "rgba(239,68,68,0.1)",
            fill: true,
            tension: 0.2,
            pointRadius: 0,
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "\ud83d\udcc8 Performance Over Time",
            color: "#E5E7EB",
            font: { family: "'Inter', sans-serif", size: 18, weight: "bold" },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `Score: ${ctx.parsed.y}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: "#374151" },
            ticks: { color: "#E5E7EB" },
          },
          y: {
            grid: { color: "#374151" },
            ticks: { color: "#E5E7EB" },
            beginAtZero: false,
          },
        },
      },
    };
  }, []);

  return <Line data={performanceChart.data} options={performanceChart.options} height={80} />;
};

export default PerformanceChart; 