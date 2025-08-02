import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const AdvanceVsDue = () => {
  const data = [
    { name: "Week 1", advance: 4000, due: 2400 },
    { name: "Week 2", advance: 3000, due: 1398 },
    { name: "Week 3", advance: 2000, due: 980 },
    { name: "Week 4", advance: 2780, due: 3908 },
  ];

  return (
    <div className="rounded-lg p-5 bg-white shadow hover:shadow-md transition-all">
      <h1 className="text-xl font-semibold mb-4">Advance vs Due</h1>
      <div className="flex flex-col items-center justify-center" tabIndex={-1}>
        <BarChart width={570} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="advance" fill="#4CAF50" />
          <Bar dataKey="due" fill="#F44336" />
        </BarChart>
      </div>
    </div>
  );
};

export default AdvanceVsDue;
