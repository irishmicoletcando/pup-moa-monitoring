"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  active: {
    label: "Active",
    color: "hsla(52, 100%, 53%, 1)",
  },
  expiry: {
    label: "Expiry",
    color: "hsla(43, 74%, 49%, 1)",
  },
  expired: {
    label: "Expired",
    color: "hsla(0, 100%, 25%, 1)",
  },
}

export function PieGraph({ stats }) {
    const chartData = [
      { moaType: "active", moaNumber: stats.Active, fill: "var(--color-active)" },
      { moaType: "expiry", moaNumber: stats.Expiry, fill: "var(--color-expiry)" },
      { moaType: "expired", moaNumber: stats.Expired, fill: "var(--color-expired)" },
    ];
  
    const totalMOA = React.useMemo(() => {
      return chartData.reduce((acc, curr) => acc + curr.moaNumber, 0);
    }, [chartData]); // Now it updates when chartData changes
  
    return (
      <Card className="flex flex-col bg-transparent shadow-none border-none">
        <CardHeader className="items-center pb-0"></CardHeader>
        <CardTitle className="">Validity Distribution</CardTitle>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="moaNumber"
                nameKey="moaType"
                innerRadius={80}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                            {totalMOA.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                            Total MOAs
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="flex justify-center gap-4 mt-4">
            {Object.entries(chartConfig).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="w-4 h-4 rounded" style={{ backgroundColor: value.color }}></span>
                <span className="text-sm text-muted-foreground">{value.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  