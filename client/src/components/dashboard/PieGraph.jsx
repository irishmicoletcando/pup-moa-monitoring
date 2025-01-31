"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
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
    const [radius, setRadius] = useState(80);

    useEffect(() => {
        function handleResize() {
          // Define different divisors based on screen width
          let divisor = 15; // Default divisor
    
          // Change divisor based on screen size
          if (window.innerWidth < 480) {
            divisor = 8; // Very small screens (mobile in portrait)
          } else if (window.innerWidth < 768) {
            divisor = 10; // Small screens (mobile in landscape)
          } else if (window.innerWidth < 1024) {
            divisor = 18; // Medium screens (tablets or small laptops)
          } else if (window.innerWidth < 1440) {
            divisor = 14; // Larger screens (small desktops or large tablets)
          }
    
          const newRadius = Math.max(30, window.innerWidth / divisor);
          setRadius(newRadius);
        }
    
        window.addEventListener("resize", handleResize);
        handleResize(); // Initial call to set the radius on load
    
        return () => window.removeEventListener("resize", handleResize);
        }, []);

    const chartData = [
      { moaType: "active", moaNumber: stats.Active, fill: "var(--color-active)" },
      { moaType: "expiry", moaNumber: stats.Expiry, fill: "var(--color-expiry)" },
      { moaType: "expired", moaNumber: stats.Expired, fill: "var(--color-expired)" },
    ];

    const totalMOA = chartData.reduce((acc, curr) => acc + curr.moaNumber, 0);
  
    return (
      <Card className="flex flex-col justify-between h-full">
        <CardHeader>
          <CardTitle className="text-md">Validity Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
          >
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="moaNumber"
                nameKey="moaType"
                innerRadius={radius}
                outerRadius={radius * 1.4}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-xl md:text-3xl font-bold">
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
          <div className="flex justify-center gap-2">
            {Object.entries(chartConfig).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="w-4 h-4 rounded" style={{ backgroundColor: value.color }}></span>
                <span className="text-sm text-muted-foreground">{value.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="leading-none text-muted-foreground">
            Showing MOA Distribution in terms of validity.
            </div>
        </CardFooter>
      </Card>
    );
  }
  