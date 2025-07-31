import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartData, ChartPeriod } from "@/types/crypto";
import { formatCurrency } from "@/lib/coingecko";

interface CoinChartProps {
  chartData?: ChartData;
  isLoading: boolean;
  period: ChartPeriod;
  onPeriodChange: (period: ChartPeriod) => void;
}

export function CoinChart({ chartData, isLoading, period, onPeriodChange }: CoinChartProps) {
  const formatChartData = (data: ChartData) => {
    return data.prices.map(([timestamp, price], index) => ({
      timestamp,
      price,
      date: new Date(timestamp).toLocaleDateString(),
      time: new Date(timestamp).toLocaleTimeString(),
    }));
  };

  const formatTooltipLabel = (timestamp: number) => {
    const date = new Date(timestamp);
    if (period === "1") {
      return date.toLocaleTimeString();
    }
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Price Chart</CardTitle>
            <div className="flex space-x-1">
              {["1", "7", "30", "90"].map((p) => (
                <Skeleton key={p} className="h-8 w-12" />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  const data = chartData ? formatChartData(chartData) : [];
  const isPositiveChange = data.length > 1 && data[data.length - 1].price > data[0].price;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Price Chart</CardTitle>
          <div className="flex border border-slate-300 rounded-lg">
            {[
              { value: "1", label: "24H" },
              { value: "7", label: "7D" },
              { value: "30", label: "30D" },
              { value: "90", label: "90D" },
            ].map(({ value, label }) => (
              <Button
                key={value}
                variant={period === value ? "default" : "ghost"}
                size="sm"
                className={`${
                  value === "1" ? "rounded-r-none" :
                  value === "90" ? "rounded-l-none" :
                  "rounded-none border-x"
                }`}
                onClick={() => onPeriodChange(value as ChartPeriod)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTooltipLabel}
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                stroke="#64748b"
                fontSize={12}
              />
              <Tooltip
                labelFormatter={(timestamp) => formatTooltipLabel(timestamp as number)}
                formatter={(value) => [formatCurrency(value as number), "Price"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPositiveChange ? "#16a34a" : "#dc2626"}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: isPositiveChange ? "#16a34a" : "#dc2626" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center bg-slate-50 rounded-lg">
            <div className="text-center">
              <div className="text-slate-400 mb-2">📈</div>
              <p className="text-slate-600">No chart data available</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
