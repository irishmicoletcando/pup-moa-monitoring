"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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
  const chartConfig = {
    employment: {
      label: "Employment",
      color: "hsla(52, 100%, 53%, 1)",
    },
    research: {
      label: "Research",
      color: "hsla(43, 74%, 49%, 1)",
    },
    practicum: {
      label: "Practicum",
      color: "hsla(0, 100%, 25%, 1)",
    },
    scholarship: {
      label: "Scholarship",
      color: "hsl(var(--chart-4))",
    },
  };

  // Create chart data and sort it by moaNumber in descending order
  const chartData = [
    { moaType: "employment", moaNumber: stats.employment, fill: "var(--color-employment)" },
    { moaType: "research", moaNumber: stats.research, fill: "var(--color-research)" },
    { moaType: "practicum", moaNumber: stats.practicum, fill: "var(--color-practicum)" },
    { moaType: "scholarship", moaNumber: stats.scholarship, fill: "var(--color-scholarship)" },
  ]
  .sort((a, b) => b.moaNumber - a.moaNumber);  // Sorting in descending order by moaNumber

  return (
    <Card className="flex flex-col justify-between h-full">
      <CardHeader>
        <CardTitle className="text-md">MOA Types Count</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
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
            />
            <Bar
              dataKey="moaNumber"
              strokeWidth={2}
              radius={8}
              activeIndex={2}
              activeBar={({ ...props }) => (
                <Rectangle
                  {...props}
                  fillOpacity={0.8}
                  stroke={props.payload.fill}
                  strokeDasharray={4}
                  strokeDashoffset={4}
                />
              )}
            />
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
