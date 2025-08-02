import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const RateChart = () => {
  const data = [
    { date: "01 Jul", rate: 120 },
    { date: "05 Jul", rate: 135 },
    { date: "10 Jul", rate: 110 },
    { date: "15 Jul", rate: 145 },
    { date: "20 Jul", rate: 150 },
  ];

  return (
    <div className="bg-white rounded-lg p-5 shadow hover:shadow-md transition-all">
      <h1 className="text-xl font-semibold mb-4">Rate Chart</h1>
      <div className="flex flex-col items-center justify-center" tabIndex={-1}>
        <AreaChart width={570} height={300} data={data}>
          <defs>
            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="rate"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorRate)"
          />
        </AreaChart>
      </div>
    </div>
  );
};

export default RateChart;
