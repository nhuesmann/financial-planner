import { Component } from '../components';

export enum TimelineGranularity {
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  DECADE = 'DECADE',
}

export interface TimelineRange {
  startDate: Date;
  endDate: Date;
}

export interface TimelinePosition {
  x: number;
  y: number;
  date: Date;
}

export interface TimelineLane {
  id: string;
  name: string;
  order: number;
}

export interface DragDropPayload {
  componentType: Component['type'];
  sourceId?: string;
  position: TimelinePosition;
}

export interface TimelineEditPoint {
  id: string;
  componentId: string;
  date: Date;
  position: TimelinePosition;
  values: Partial<Component>;
}

export interface TimelineInteraction {
  type: 'click' | 'hover' | 'drag';
  position: TimelinePosition;
  componentId?: string;
  editPointId?: string;
}

export interface NetWorthPoint {
  date: Date;
  value: number;
  isProjected: boolean;
}

export interface TimelineState {
  range: TimelineRange;
  granularity: TimelineGranularity;
  currentDate: Date;
  netWorthLine: NetWorthPoint[];
  components: Component[];
  editPoints: TimelineEditPoint[];
  selectedComponentId?: string;
  hoveredComponentId?: string;
}

export interface TimelineViewport {
  width: number;
  height: number;
  scrollX: number;
  scrollY: number;
  zoom: number;
}

export interface ComponentVisualization {
  componentId: string;
  path: string;
  color: string;
  strokeWidth: number;
  fillOpacity?: number;
}

export interface TimelineTheme {
  cashFlow: {
    income: string;
    expense: string;
  };
  assets: {
    primary: string;
    secondary: string;
  };
  liabilities: {
    primary: string;
    secondary: string;
  };
  specialEvents: {
    primary: string;
    secondary: string;
  };
  netWorth: {
    positive: string;
    negative: string;
  };
}
