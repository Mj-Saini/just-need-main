import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from "recharts";

const data = [
  { name: "Jan", value: 50 },
  { name: "Feb", value: 43 },
  { name: "Mar", value: 53 },
  { name: "Apr", value: 61 },
  { name: "May", value: 75 },
  { name: "Jun", value: 77 },
  { name: "Jul", value: 80 },
  { name: "Aug", value: 78 },
  { name: "Sep", value: 60 },
  { name: "Oct", value: 72 },
  { name: "Nov", value: 88 },
  { name: "Dec", value: 68 },
];

const PerformanceChart = () => {
  return (
    <div style={{ width: "100%", height: 300 }}>
      
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          {/* Gradient for the shaded area */}
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#314CFF" stopOpacity={0.8} borderwidth="100px" />
              <stop offset="95%" stopColor="#314CFF" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Move XAxis to the top */}
          <XAxis
            dataKey="name"
            orientation="top"
            tick={{ fill: "black" }}
            axisLine={false}
            tickLine={false}
            borderwidth="100px"
          />

          <YAxis hide />
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <Tooltip />

          {/* Smooth Area */}
          <Area
            type="monotone"
            dataKey="value"
            stroke="#314CFF"
            fillOpacity={1}
            fill="url(#colorValue)"
          />

          {/* Dashed line after September */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#314CFF"
            strokeDasharray="5 5"
            dot={{ stroke: "#000000", strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;









