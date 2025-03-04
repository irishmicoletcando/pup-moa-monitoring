"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis, LabelList } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function BarGraph({ stats }) {
  const [activeIndex, setActiveIndex] = useState(null); // Track active bar index

  const chartConfig = {
    employment: { label: "Employment", color: "hsla(52, 100%, 53%, 1)" },
    research: { label: "Research", color: "hsla(43, 74%, 49%, 1)" },
    practicum: { label: "Practicum", color: "hsla(0, 100%, 25%, 1)" },
    scholarship: { label: "Scholarship", color: "hsl(var(--chart-4))" },
    others:{ label: "Others", color: "rgb(255, 214, 90)" },
  };

  const chartData = [
    { moaType: "employment", moaNumber: stats.employment, fill: "var(--color-employment)" },
    { moaType: "research", moaNumber: stats.research, fill: "var(--color-research)" },
    { moaType: "practicum", moaNumber: stats.practicum, fill: "var(--color-practicum)" },
    { moaType: "scholarship", moaNumber: stats.scholarship, fill: "var(--color-scholarship)" },
    { moaType: "others", moaNumber: stats.others, fill: "var(--color-others)" },
  ].sort((a, b) => b.moaNumber - a.moaNumber);

  return (
    <Card className="flex flex-col justify-between h-full">
      <CardHeader>
        <CardTitle className="text-md">MOA Types Count</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="moaType"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value] ? chartConfig[value].label : value
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              nameKey="moaType"
            />
            <Bar
              dataKey="moaNumber"
              strokeWidth={2}
              radius={8}
              activeIndex={activeIndex}
              activeBar={({ ...props }) => (
                <Rectangle
                  {...props}
                  fillOpacity={0.8}
                  stroke={props.payload.fill}
                />
              )}
              onMouseMove={(_, index) => setActiveIndex(index)} // Set active bar on click
            >
              <LabelList
                dataKey="moaNumber"
                position="top"
                fill="black"
                fontSize={12}
                fontWeight="bold"
                formatter={(value, entry, index) =>
                  index === activeIndex ? value : ""
                }
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total MOAs for each type.
        </div>
      </CardFooter>
    </Card>
  );
}
