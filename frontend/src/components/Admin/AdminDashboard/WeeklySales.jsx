import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const WeeklySales = () => {
  const data = [
    { day: "Mon", sales: 1200 },
    { day: "Tue", sales: 2100 },
    { day: "Wed", sales: 800 },
    { day: "Thu", sales: 1700 },
    { day: "Fri", sales: 2400 },
    { day: "Sat", sales: 3000 },
    { day: "Sun", sales: 2000 },
  ];

  return (
    <div className="rounded-lg p-5 bg-white shadow hover:shadow-md transition-all">
      <h1 className="text-xl font-semibold mb-4">Weekly Sales</h1>
      <div className="flex flex-col items-center justify-center" tabIndex={-1}>
        <LineChart width={570} height={300} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="#8884d8" />
        </LineChart>
      </div>
    </div>
  );
};

export default WeeklySales;
