'use client';

import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { SAMPLE_CHART_DATA } from '@/data/dummyData';
import { ChartData } from '@/types/timeline/chart';
import {
  aggregateComponents,
  DEFAULT_AGGREGATION_CONFIG,
} from '@/utils/calculations/componentAggregator';

interface TimelineChartProps {
  data?: ChartData;
  height?: number;
  useLogScale?: boolean;
  showComponentGroups?: boolean;
}

export function TimelineChart({
  data = SAMPLE_CHART_DATA,
  height = 500,
  useLogScale = false,
  showComponentGroups = false,
}: TimelineChartProps) {
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());
  const [isLogScale, setIsLogScale] = useState(useLogScale);
  const [useGrouping, setUseGrouping] = useState(showComponentGroups);

  // Apply component aggregation if enabled
  const displayComponents = useMemo(() => {
    if (useGrouping) {
      // Need to pass the original components - for now, using the chart series
      // In production, would pass components from props
      return aggregateComponents([], data.components, DEFAULT_AGGREGATION_CONFIG);
    }
    return data.components;
  }, [data.components, useGrouping]);

  // Transform data for Recharts
  const chartData = useMemo(() => {
    // Create a map of all unique dates
    const dateMap = new Map<number, any>();

    // Add component data
    displayComponents.forEach((series) => {
      if (!hiddenSeries.has(series.id)) {
        series.data.forEach((point) => {
          if (!dateMap.has(point.x)) {
            dateMap.set(point.x, { date: point.x });
          }
          dateMap.get(point.x)[series.id] = point.y;
        });
      }
    });

    // Add net worth data
    if (!hiddenSeries.has('net-worth')) {
      data.netWorth.data.forEach((point) => {
        if (!dateMap.has(point.x)) {
          dateMap.set(point.x, { date: point.x });
        }
        dateMap.get(point.x)['netWorth'] = point.y;
      });
    }

    // Convert to array and sort by date
    return Array.from(dateMap.values()).sort((a, b) => a.date - b.date);
  }, [displayComponents, data.netWorth, hiddenSeries]);

  // Custom dot for edit markers
  const CustomDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    const series = displayComponents.find((s) => s.id === dataKey);
    const marker = series?.markers?.find(
      (m) => Math.abs(m.x - payload.date) < 86400000 // Within a day
    );

    if (marker) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill={series?.color || '#000'}
          stroke="#fff"
          strokeWidth={2}
          style={{ cursor: 'pointer' }}
        />
      );
    }
    return null;
  };

  // Toggle series visibility
  const toggleSeries = (seriesId: string) => {
    setHiddenSeries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(seriesId)) {
        newSet.delete(seriesId);
      } else {
        newSet.add(seriesId);
      }
      return newSet;
    });
  };

  // Format currency
  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      return (
        <div className="rounded-lg border bg-background p-3 shadow-lg">
          <p className="font-semibold">{format(date, 'MMM yyyy')}</p>
          {payload.map((entry: any, index: number) => {
            const displayName =
              entry.dataKey === 'netWorth'
                ? 'Net Worth'
                : displayComponents.find((c) => c.id === entry.dataKey)?.name || entry.dataKey;
            return (
              <p key={index} style={{ color: entry.color }}>
                {displayName}: {formatCurrency(entry.value)}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="mb-2 text-lg font-semibold">Financial Timeline</h3>
        <div className="mb-3 flex gap-4">
          <button
            onClick={() => setIsLogScale(!isLogScale)}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium hover:bg-gray-50"
          >
            {isLogScale ? 'Linear Scale' : 'Log Scale'}
          </button>
          <button
            onClick={() => setUseGrouping(!useGrouping)}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium hover:bg-gray-50"
          >
            {useGrouping ? 'Show All Components' : 'Group Small Items'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {displayComponents.map((series) => (
            <button
              key={series.id}
              onClick={() => toggleSeries(series.id)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-opacity ${
                hiddenSeries.has(series.id) ? 'opacity-50' : ''
              }`}
              style={{
                backgroundColor: `${series.color}20`,
                color: series.color,
                border: `1px solid ${series.color}`,
              }}
            >
              {series.name}
            </button>
          ))}
          <button
            onClick={() => toggleSeries('net-worth')}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-opacity ${
              hiddenSeries.has('net-worth') ? 'opacity-50' : ''
            }`}
            style={{
              backgroundColor: `${data.netWorth.line.color}20`,
              color: data.netWorth.line.color,
              border: `1px solid ${data.netWorth.line.color}`,
            }}
          >
            Net Worth
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="date"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(tick) => format(new Date(tick), 'MMM yy')}
          />
          <YAxis
            tickFormatter={formatCurrency}
            scale={isLogScale ? 'log' : 'linear'}
            domain={isLogScale ? ['auto', 'auto'] : undefined}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Net Worth Area */}
          {!hiddenSeries.has('net-worth') && (
            <Area
              type="monotone"
              dataKey="netWorth"
              stroke={data.netWorth.line.color}
              strokeWidth={data.netWorth.line.width}
              fill={data.netWorth.fillcolor}
              fillOpacity={0.5}
            />
          )}

          {/* Zero line */}
          <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />

          {/* Component Lines */}
          {displayComponents.map(
            (series) =>
              !hiddenSeries.has(series.id) && (
                <Line
                  key={series.id}
                  type="monotone"
                  dataKey={series.id}
                  stroke={series.color}
                  strokeWidth={2}
                  dot={<CustomDot />}
                  connectNulls
                />
              )
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TimelineChart;
