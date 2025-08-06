import {
  Component,
  ComponentEdit,
  ComponentType,
  ExpenseFrequency,
  InvestmentAccountType,
} from '@/types/components';
import { ChartData } from '@/types/timeline/chart';
import { createChartData } from '@/utils/calculations/chartTransformers';
import { generateMonthlyDates } from '@/utils/calculations/componentCalculators';

/**
 * Generate dummy components for testing
 */
export function generateDummyComponents(): Component[] {
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const components: Component[] = [
    // Income - Software Engineer with raise
    {
      id: 'income-1',
      name: 'Software Engineer Salary',
      type: ComponentType.INCOME,
      startDate: oneYearAgo,
      annualAmount: 120000,
      taxRate: 28,
      color: '#22c55e',
    },

    // Monthly Rent
    {
      id: 'expense-1',
      name: 'Rent',
      type: ComponentType.EXPENSE,
      startDate: oneYearAgo,
      amount: 2500,
      frequency: ExpenseFrequency.MONTHLY,
      isRecurring: true,
      color: '#ef4444',
    },

    // Utilities
    {
      id: 'expense-2',
      name: 'Utilities',
      type: ComponentType.EXPENSE,
      startDate: oneYearAgo,
      amount: 200,
      frequency: ExpenseFrequency.MONTHLY,
      isRecurring: true,
      color: '#f97316',
    },

    // Groceries
    {
      id: 'expense-3',
      name: 'Groceries',
      type: ComponentType.EXPENSE,
      startDate: oneYearAgo,
      amount: 150,
      frequency: ExpenseFrequency.WEEKLY,
      isRecurring: true,
      color: '#fb923c',
    },

    // Checking Account
    {
      id: 'checking-1',
      name: 'Main Checking',
      type: ComponentType.CHECKING_ACCOUNT,
      startDate: oneYearAgo,
      balance: 15000,
      color: '#3b82f6',
    },

    // High-Yield Savings
    {
      id: 'savings-1',
      name: 'Emergency Fund',
      type: ComponentType.SAVINGS_ACCOUNT,
      startDate: oneYearAgo,
      balance: 25000,
      interestRate: 4.5,
      color: '#10b981',
    },

    // 401k Investment Account
    {
      id: 'investment-1',
      name: '401(k)',
      type: ComponentType.INVESTMENT_ACCOUNT,
      startDate: oneYearAgo,
      balance: 50000,
      projectedAnnualReturn: 8,
      accountType: InvestmentAccountType.FOUR_ZERO_ONE_K,
      color: '#8b5cf6',
    },

    // Roth IRA
    {
      id: 'investment-2',
      name: 'Roth IRA',
      type: ComponentType.INVESTMENT_ACCOUNT,
      startDate: oneYearAgo,
      balance: 20000,
      projectedAnnualReturn: 7,
      accountType: InvestmentAccountType.ROTH_IRA,
      color: '#a855f7',
    },

    // Car Loan
    {
      id: 'debt-1',
      name: 'Car Loan',
      type: ComponentType.DEBT,
      startDate: oneYearAgo,
      currentBalance: 18000,
      interestRate: 4.5,
      monthlyPayment: 550,
      color: '#dc2626',
    },

    // Student Loan
    {
      id: 'debt-2',
      name: 'Student Loan',
      type: ComponentType.DEBT,
      startDate: oneYearAgo,
      currentBalance: 35000,
      interestRate: 5.5,
      monthlyPayment: 400,
      color: '#b91c1c',
    },

    // Current Home
    {
      id: 'home-1',
      name: 'Primary Residence',
      type: ComponentType.CURRENT_HOME,
      startDate: oneYearAgo,
      currentHomeValue: 450000,
      remainingMortgageBalance: 320000,
      monthlyPayment: 2200,
      interestRate: 3.5,
      yearsRemainingOnMortgage: 25,
      color: '#06b6d4',
    },
  ];

  return components;
}

/**
 * Generate dummy component edits
 */
export function generateDummyEdits(): Map<string, ComponentEdit[]> {
  const edits = new Map<string, ComponentEdit[]>();

  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  const threeMonthsFromNow = new Date(today);
  threeMonthsFromNow.setMonth(today.getMonth() + 3);

  // Salary raise after 6 months
  edits.set('income-1', [
    {
      componentId: 'income-1',
      editDate: sixMonthsAgo,
      changes: {
        annualAmount: 135000,
      },
    },
    {
      componentId: 'income-1',
      editDate: threeMonthsFromNow,
      changes: {
        annualAmount: 145000,
      },
    },
  ]);

  // Increase 401k contribution
  edits.set('investment-1', [
    {
      componentId: 'investment-1',
      editDate: today,
      changes: {
        balance: 55000, // Bonus contribution
      },
    },
  ]);

  // Pay off car loan early
  const oneYearFromNow = new Date(today);
  oneYearFromNow.setFullYear(today.getFullYear() + 1);

  edits.set('debt-1', [
    {
      componentId: 'debt-1',
      editDate: oneYearFromNow,
      changes: {
        monthlyPayment: 1000, // Increase payment to pay off faster
      },
    },
  ]);

  return edits;
}

/**
 * Generate complete dummy chart data
 */
export function generateDummyChartData(): ChartData {
  const components = generateDummyComponents();
  const edits = generateDummyEdits();

  // Generate 5 years of monthly data
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 4);

  const dateRange = generateMonthlyDates(startDate, endDate);

  return createChartData(components, dateRange, edits);
}

/**
 * Get sample chart data for immediate use
 */
export function getSampleChartData(): ChartData {
  // Generate a smaller dataset for quick rendering
  const today = new Date();
  const twoYearsAgo = new Date(today);
  twoYearsAgo.setFullYear(today.getFullYear() - 2);
  const threeYearsFromNow = new Date(today);
  threeYearsFromNow.setFullYear(today.getFullYear() + 3);

  const dateRange = generateMonthlyDates(twoYearsAgo, threeYearsFromNow);

  // Create a simpler set of components for demo
  const components: Component[] = [
    {
      id: 'income-demo',
      name: 'Salary',
      type: ComponentType.INCOME,
      startDate: twoYearsAgo,
      annualAmount: 100000,
      taxRate: 25,
      color: '#22c55e',
    },
    {
      id: 'expense-demo',
      name: 'Living Expenses',
      type: ComponentType.EXPENSE,
      startDate: twoYearsAgo,
      amount: 4000,
      frequency: ExpenseFrequency.MONTHLY,
      isRecurring: true,
      color: '#ef4444',
    },
    {
      id: 'savings-demo',
      name: 'Savings Account',
      type: ComponentType.SAVINGS_ACCOUNT,
      startDate: twoYearsAgo,
      balance: 20000,
      interestRate: 4.0,
      color: '#10b981',
    },
    {
      id: 'investment-demo',
      name: 'Investment Portfolio',
      type: ComponentType.INVESTMENT_ACCOUNT,
      startDate: twoYearsAgo,
      balance: 40000,
      projectedAnnualReturn: 7,
      accountType: InvestmentAccountType.BROKERAGE,
      color: '#8b5cf6',
    },
    {
      id: 'debt-demo',
      name: 'Personal Loan',
      type: ComponentType.DEBT,
      startDate: twoYearsAgo,
      currentBalance: 15000,
      interestRate: 6,
      monthlyPayment: 500,
      color: '#dc2626',
    },
  ];

  // Add some edits
  const edits = new Map<string, ComponentEdit[]>();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  edits.set('income-demo', [
    {
      componentId: 'income-demo',
      editDate: oneYearAgo,
      changes: {
        annualAmount: 110000,
      },
    },
    {
      componentId: 'income-demo',
      editDate: today,
      changes: {
        annualAmount: 120000,
      },
    },
  ]);

  return createChartData(components, dateRange, edits);
}

/**
 * Export pre-calculated sample data for instant rendering
 */
export const SAMPLE_CHART_DATA = getSampleChartData();
