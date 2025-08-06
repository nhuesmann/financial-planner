import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const data = [
  {
    month: 'Jan',
    netWorth: 4000,
    assets: 6400,
    liabilities: 2400,
  },
  {
    month: 'Feb',
    netWorth: 3000,
    assets: 5398,
    liabilities: 2398,
  },
  {
    month: 'Mar',
    netWorth: 2000,
    assets: 11800,
    liabilities: 9800,
  },
  {
    month: 'Apr',
    netWorth: 2780,
    assets: 6688,
    liabilities: 3908,
  },
  {
    month: 'May',
    netWorth: 1890,
    assets: 6680,
    liabilities: 4790,
  },
  {
    month: 'Jun',
    netWorth: 2390,
    assets: 6190,
    liabilities: 3800,
  },
  {
    month: 'Jul',
    netWorth: 3490,
    assets: 7790,
    liabilities: 4300,
  },
];

const chartConfig = {
  netWorth: {
    label: 'Net Worth',
    color: 'hsl(var(--chart-1))',
  },
  assets: {
    label: 'Assets',
    color: 'hsl(var(--chart-2))',
  },
  liabilities: {
    label: 'Liabilities',
    color: 'hsl(var(--chart-3))',
  },
};

export const Chart = () => {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="month" className="text-muted-foreground" tick={{ fill: 'currentColor' }} />
        <YAxis className="text-muted-foreground" tick={{ fill: 'currentColor' }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="netWorth"
          stroke="var(--color-netWorth)"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="assets" stroke="var(--color-assets)" strokeWidth={2} />
        <Line
          type="monotone"
          dataKey="liabilities"
          stroke="var(--color-liabilities)"
          strokeWidth={2}
        />
      </LineChart>
    </ChartContainer>
  );
};
