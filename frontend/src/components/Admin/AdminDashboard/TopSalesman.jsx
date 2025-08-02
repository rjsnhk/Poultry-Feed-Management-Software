import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const salesmen = [
  { name: "Ravi", sales: 120 },
  { name: "Mehak", sales: 200 },
  { name: "Aman", sales: 150 },
  { name: "Priya", sales: 180 },
  { name: "Karan", sales: 90 },
];

const TopSalesman = () => {
  return (
    <div className="rounded-lg p-5 bg-white shadow hover:shadow-md transition-all">
      <h1 className="text-xl font-semibold mb-4">Top Salesman Performance</h1>
      <div className="flex flex-col items-center justify-center" tabIndex={-1}>
        <BarChart width={570} height={300} data={salesmen}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#4CAF50" />
        </BarChart>
      </div>
    </div>
  );
};

export default TopSalesman;
