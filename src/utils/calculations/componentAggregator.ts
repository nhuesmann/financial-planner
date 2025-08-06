import { Component, ComponentType } from '@/types/components';
import { ChartDataSeries } from '@/types/timeline/chart';

export interface AggregationConfig {
  groupExpenses: boolean;
  expenseThreshold: number; // Group expenses below this monthly amount
  groupDebts: boolean;
  debtThreshold: number; // Group debts below this balance
}

export const DEFAULT_AGGREGATION_CONFIG: AggregationConfig = {
  groupExpenses: true,
  expenseThreshold: 500, // Group expenses under $500/month
  groupDebts: true,
  debtThreshold: 5000, // Group debts under $5k
};

/**
 * Aggregate small components into groups for better visualization
 */
export function aggregateComponents(
  components: Component[],
  chartSeries: ChartDataSeries[],
  config: AggregationConfig = DEFAULT_AGGREGATION_CONFIG
): ChartDataSeries[] {
  if (!config.groupExpenses && !config.groupDebts) {
    return chartSeries;
  }

  const aggregatedSeries: ChartDataSeries[] = [];
  const expensesToGroup: ChartDataSeries[] = [];
  const debtsToGroup: ChartDataSeries[] = [];

  // Separate components into groups
  chartSeries.forEach((series) => {
    const component = components.find((c) => c.id === series.id);
    if (!component) {
      aggregatedSeries.push(series);
      return;
    }

    // Check if expense should be grouped
    if (config.groupExpenses && component.type === ComponentType.EXPENSE) {
      const avgValue = getAverageValue(series);
      if (Math.abs(avgValue) < config.expenseThreshold) {
        expensesToGroup.push(series);
        return;
      }
    }

    // Check if debt should be grouped
    if (config.groupDebts && component.type === ComponentType.DEBT) {
      const avgValue = getAverageValue(series);
      if (Math.abs(avgValue) < config.debtThreshold) {
        debtsToGroup.push(series);
        return;
      }
    }

    // Otherwise, keep the component as-is
    aggregatedSeries.push(series);
  });

  // Create aggregated expense series
  if (expensesToGroup.length > 0) {
    const aggregatedExpense = createAggregatedSeries(
      expensesToGroup,
      'grouped-expenses',
      'Other Expenses',
      '#94a3b8' // slate-400
    );
    aggregatedSeries.push(aggregatedExpense);
  }

  // Create aggregated debt series
  if (debtsToGroup.length > 0) {
    const aggregatedDebt = createAggregatedSeries(
      debtsToGroup,
      'grouped-debts',
      'Other Debts',
      '#f87171' // red-400
    );
    aggregatedSeries.push(aggregatedDebt);
  }

  return aggregatedSeries;
}

/**
 * Get the average value of a series
 */
function getAverageValue(series: ChartDataSeries): number {
  if (series.data.length === 0) return 0;
  const sum = series.data.reduce((acc, point) => acc + point.y, 0);
  return sum / series.data.length;
}

/**
 * Create an aggregated series from multiple series
 */
function createAggregatedSeries(
  seriesToGroup: ChartDataSeries[],
  id: string,
  name: string,
  color: string
): ChartDataSeries {
  // Find all unique timestamps
  const timestampMap = new Map<number, number>();

  seriesToGroup.forEach((series) => {
    series.data.forEach((point) => {
      const currentValue = timestampMap.get(point.x) || 0;
      timestampMap.set(point.x, currentValue + point.y);
    });
  });

  // Convert to sorted array
  const data = Array.from(timestampMap.entries())
    .map(([x, y]) => ({ x, y }))
    .sort((a, b) => a.x - b.x);

  // Collect all markers from grouped series
  const markers: ChartDataSeries['markers'] = [];
  seriesToGroup.forEach((series) => {
    if (series.markers) {
      markers.push(...series.markers);
    }
  });

  return {
    id,
    name,
    color,
    data,
    markers,
  };
}

/**
 * Get details about which components were grouped
 */
export function getGroupedComponentDetails(
  components: Component[],
  chartSeries: ChartDataSeries[],
  config: AggregationConfig = DEFAULT_AGGREGATION_CONFIG
): {
  groupedExpenses: Component[];
  groupedDebts: Component[];
} {
  const groupedExpenses: Component[] = [];
  const groupedDebts: Component[] = [];

  chartSeries.forEach((series) => {
    const component = components.find((c) => c.id === series.id);
    if (!component) return;

    // Check if expense should be grouped
    if (config.groupExpenses && component.type === ComponentType.EXPENSE) {
      const avgValue = getAverageValue(series);
      if (Math.abs(avgValue) < config.expenseThreshold) {
        groupedExpenses.push(component);
      }
    }

    // Check if debt should be grouped
    if (config.groupDebts && component.type === ComponentType.DEBT) {
      const avgValue = getAverageValue(series);
      if (Math.abs(avgValue) < config.debtThreshold) {
        groupedDebts.push(component);
      }
    }
  });

  return { groupedExpenses, groupedDebts };
}
