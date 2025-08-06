import { Component, ComponentEdit } from '@/types/components';
import {
  ChartData,
  ChartDataSeries,
  ComponentTimeline,
  NetWorthDataPoint,
  TimelineDataPoint,
} from '@/types/timeline/chart';

import { AccountFlowCalculator } from './accountFlowCalculator';
import { calculateComponentTimeline } from './componentCalculators';

/**
 * Transform component timeline to chart series
 */
export function transformToChartSeries(timeline: ComponentTimeline): ChartDataSeries {
  return {
    id: timeline.componentId,
    name: timeline.name,
    color: timeline.color,
    data: timeline.dataPoints.map((point) => ({
      x: point.date.getTime(),
      y: point.value,
    })),
    markers: timeline.dataPoints
      .filter((point) => point.isEdit)
      .map((point) => ({
        x: point.date.getTime(),
        y: point.value,
        id: point.editId || '',
      })),
  };
}

/**
 * Calculate net worth from all components using flow-based accounting
 */
export function calculateNetWorth(
  components: Component[],
  dateRange: Date[],
  componentEdits: Map<string, ComponentEdit[]>
): NetWorthDataPoint[] {
  const netWorthPoints: NetWorthDataPoint[] = [];

  // Use the new AccountFlowCalculator for proper money flow tracking
  const flowCalculator = new AccountFlowCalculator(components, componentEdits);
  const { balances } = flowCalculator.calculateFlows(dateRange);

  // Process home components separately (they don't go through cash flow)
  const homeComponents = components.filter(
    (c) => c.type === 'CURRENT_HOME' || c.type === 'FUTURE_HOME_PURCHASE'
  );

  const homeTimelines = new Map<string, TimelineDataPoint[]>();
  for (const component of homeComponents) {
    const edits = componentEdits.get(component.id) || [];
    const timeline = calculateComponentTimeline(component, dateRange, edits);
    homeTimelines.set(component.id, timeline);
  }

  // Build net worth data points from account balances
  for (let i = 0; i < dateRange.length; i++) {
    const date = dateRange[i];
    const balance = balances[i];

    // Calculate real estate value for this date
    let realEstate = 0;
    for (const component of homeComponents) {
      const timeline = homeTimelines.get(component.id);
      realEstate += timeline?.[i]?.value || 0;
    }

    // Aggregate cash (checking + savings)
    const cash =
      balance.checking + Array.from(balance.savings.values()).reduce((sum, val) => sum + val, 0);

    // Aggregate investments
    const investments = Array.from(balance.investments.values()).reduce((sum, val) => sum + val, 0);

    // Get total debts
    const debts = balance.totalLiabilities;

    const assets = cash + investments + realEstate;
    const liabilities = debts;

    netWorthPoints.push({
      date,
      value: assets - liabilities,
      assets,
      liabilities,
      breakdown: {
        cash,
        investments,
        realEstate,
        debts,
      },
    });
  }

  return netWorthPoints;
}

/**
 * Transform net worth data for chart visualization
 */
export function transformNetWorthToChart(netWorthData: NetWorthDataPoint[]): ChartData['netWorth'] {
  // Determine color based on current net worth value
  const currentNetWorth = netWorthData[netWorthData.length - 1]?.value || 0;
  const isPositive = currentNetWorth >= 0;

  return {
    id: 'net-worth',
    name: 'Net Worth',
    data: netWorthData.map((point) => ({
      x: point.date.getTime(),
      y: point.value,
    })),
    fill: 'tozeroy',
    fillcolor: isPositive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
    line: {
      color: isPositive ? '#22c55e' : '#ef4444',
      width: 3,
    },
  };
}

/**
 * Create complete chart data from components
 */
export function createChartData(
  components: Component[],
  dateRange: Date[],
  componentEdits: Map<string, ComponentEdit[]> = new Map(),
  componentColors: Map<string, string> = new Map(),
  useFlowBasedCalculation: boolean = true
): ChartData {
  let componentTimelines: ComponentTimeline[];

  if (useFlowBasedCalculation) {
    // Use the new flow-based calculator for accurate account relationships
    const flowCalculator = new AccountFlowCalculator(components, componentEdits);
    const { componentTimelines: flowTimelines } = flowCalculator.calculateFlows(dateRange);

    // Also calculate home components separately (they don't go through flow)
    const homeComponents = components.filter(
      (c) => c.type === 'CURRENT_HOME' || c.type === 'FUTURE_HOME_PURCHASE'
    );

    for (const component of homeComponents) {
      const edits = componentEdits.get(component.id) || [];
      const timeline = calculateComponentTimeline(component, dateRange, edits);
      flowTimelines.set(component.id, timeline);
    }

    // Convert to ComponentTimeline format
    componentTimelines = components.map((component) => ({
      componentId: component.id,
      componentType: component.type,
      name: component.name,
      color:
        componentColors.get(component.id) || component.color || getDefaultColor(component.type),
      dataPoints: flowTimelines.get(component.id) || [],
      visible: true,
    }));
  } else {
    // Fall back to original calculation method
    componentTimelines = components.map((component) => ({
      componentId: component.id,
      componentType: component.type,
      name: component.name,
      color:
        componentColors.get(component.id) || component.color || getDefaultColor(component.type),
      dataPoints: calculateComponentTimeline(
        component,
        dateRange,
        componentEdits.get(component.id) || []
      ),
      visible: true,
    }));
  }

  // Transform to chart series
  const chartSeries = componentTimelines.map(transformToChartSeries);

  // Calculate net worth
  const netWorthData = calculateNetWorth(components, dateRange, componentEdits);

  return {
    components: chartSeries,
    netWorth: transformNetWorthToChart(netWorthData),
    dateRange: {
      start: dateRange[0],
      end: dateRange[dateRange.length - 1],
    },
  };
}

/**
 * Get default color for component type
 */
export function getDefaultColor(type: string): string {
  const colorMap: Record<string, string> = {
    CHECKING_ACCOUNT: '#3b82f6', // blue
    SAVINGS_ACCOUNT: '#10b981', // emerald
    INVESTMENT_ACCOUNT: '#8b5cf6', // violet
    DEBT: '#ef4444', // red
    INCOME: '#22c55e', // green
    EXPENSE: '#f97316', // orange
    CURRENT_HOME: '#06b6d4', // cyan
    FUTURE_HOME_PURCHASE: '#0ea5e9', // sky
    RETIREMENT_MILESTONE: '#fbbf24', // amber
  };

  return colorMap[type] || '#6b7280'; // gray as fallback
}

/**
 * Filter chart data by date range
 */
export function filterChartDataByDateRange(
  chartData: ChartData,
  startDate: Date,
  endDate: Date
): ChartData {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  return {
    ...chartData,
    components: chartData.components.map((series) => ({
      ...series,
      data: series.data.filter((point) => point.x >= startTime && point.x <= endTime),
      markers: series.markers?.filter((marker) => marker.x >= startTime && marker.x <= endTime),
    })),
    netWorth: {
      ...chartData.netWorth,
      data: chartData.netWorth.data.filter((point) => point.x >= startTime && point.x <= endTime),
    },
    dateRange: {
      start: startDate,
      end: endDate,
    },
  };
}

/**
 * Aggregate chart data for different time granularities
 */
export function aggregateChartData(
  chartData: ChartData,
  granularity: 'MONTH' | 'QUARTER' | 'YEAR'
): ChartData {
  // For now, return as-is. In production, we'd aggregate data points
  // to reduce the number of points for better performance with large date ranges
  return chartData;
}
