import { ComponentType } from '../components';

/**
 * Represents a single data point on the timeline
 */
export interface TimelineDataPoint {
  date: Date;
  value: number;
  componentId: string;
  isEdit?: boolean;
  editId?: string;
}

/**
 * Component timeline data for chart visualization
 */
export interface ComponentTimeline {
  componentId: string;
  componentType: ComponentType;
  name: string;
  color: string;
  dataPoints: TimelineDataPoint[];
  visible: boolean;
}

/**
 * Net worth data point with breakdown
 */
export interface NetWorthDataPoint {
  date: Date;
  value: number;
  assets: number;
  liabilities: number;
  breakdown: {
    cash: number;
    investments: number;
    realEstate: number;
    debts: number;
  };
}

/**
 * Chart-ready data format for visualization library
 */
export interface ChartDataSeries {
  id: string;
  name: string;
  color: string;
  data: {
    x: number; // Unix timestamp
    y: number;
  }[];
  markers?: {
    x: number;
    y: number;
    id: string;
  }[];
}

/**
 * Complete chart data structure
 */
export interface ChartData {
  components: ChartDataSeries[];
  netWorth: {
    id: string;
    name: string;
    data: {
      x: number;
      y: number;
    }[];
    fill: 'tozeroy';
    fillcolor: string;
    line: {
      color: string;
      width: number;
    };
  };
  dateRange: {
    start: Date;
    end: Date;
  };
}

/**
 * Component calculation state
 */
export interface ComponentCalculationState {
  componentId: string;
  timeline: TimelineDataPoint[];
  lastCalculated: Date;
  isDirty: boolean;
}

/**
 * Timeline calculation cache
 */
export interface TimelineCache {
  components: Map<string, ComponentCalculationState>;
  netWorth: NetWorthDataPoint[];
  lastUpdated: Date;
}
