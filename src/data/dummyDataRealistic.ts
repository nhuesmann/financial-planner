import {
  Component,
  ComponentEdit,
  ComponentType,
  InvestmentAccountType,
  MortgageTerm,
  TransactionFrequency,
} from '@/types/components';
import { ChartData } from '@/types/timeline/chart';
import { createChartData } from '@/utils/calculations/chartTransformers';
import { generateMonthlyDates } from '@/utils/calculations/componentCalculators';

/**
 * Generate dummy components for testing
 */
export function generateDummyComponents(): Component[] {
  const today = new Date();
  const startOfMonth = new Date(today);
  startOfMonth.setDate(1);

  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const components: Component[] = [
    // Income - Software Engineer with raise
    {
      id: 'income-1',
      name: 'Software Engineer Salary',
      type: ComponentType.INCOME,
      startDate: startOfMonth,
      annualAmount: 180000,
      taxRate: 33,
      color: '#22c55e',
    },

    // Income - Teacher Salary
    {
      id: 'income-2',
      name: 'Teacher Salary',
      type: ComponentType.INCOME,
      startDate: startOfMonth,
      annualAmount: 133000,
      taxRate: 33,
      color: '#22c55e',
    },

    // Monthly Rent
    // {
    //   id: 'expense-1',
    //   name: 'Rent',
    //   type: ComponentType.EXPENSE,
    //   startDate: startOfMonth,
    //   amount: 2500,
    //   frequency: TransactionFrequency.MONTHLY,
    //   isRecurring: true,
    //   color: '#ef4444',
    // },

    // All expenses
    {
      id: 'expense-1',
      name: 'Groceries',
      type: ComponentType.EXPENSE,
      startDate: startOfMonth,
      amount: 10000,
      frequency: TransactionFrequency.MONTHLY,
      isRecurring: true,
      color: '#fb923c',
    },

    // Checking Account
    {
      id: 'checking-1',
      name: 'Main Checking',
      type: ComponentType.CHECKING_ACCOUNT,
      startDate: startOfMonth,
      balance: 10000,
      color: '#3b82f6',
    },

    // High-Yield Savings with monthly contribution
    {
      id: 'savings-1',
      name: 'Ally Savings',
      type: ComponentType.SAVINGS_ACCOUNT,
      startDate: startOfMonth,
      balance: 25000,
      interestRate: 3.5,
      contributionAmount: 0,
      contributionFrequency: TransactionFrequency.MONTHLY,
      color: '#10b981',
    },

    // T-Bill ladder
    {
      id: 'savings-2',
      name: 'T-Bill Ladder',
      type: ComponentType.SAVINGS_ACCOUNT,
      startDate: startOfMonth,
      balance: 120000,
      interestRate: 4.4,
      contributionAmount: 2500,
      contributionFrequency: TransactionFrequency.MONTHLY,
      color: '#10b981',
    },

    // 401k Investment Account with employer match (biweekly payroll)
    // {
    //   id: 'investment-1',
    //   name: '401(k)',
    //   type: ComponentType.INVESTMENT_ACCOUNT,
    //   startDate: startOfMonth,
    //   balance: 50000,
    //   projectedAnnualReturn: 8,
    //   accountType: InvestmentAccountType.FOUR_ZERO_ONE_K,
    //   contributionAmount: 250, // $250 per paycheck (biweekly)
    //   contributionFrequency: TransactionFrequency.BIWEEKLY,
    //   employerMatchPercent: 4, // 4% match
    //   employerMatchLimit: 6000, // $6k annual match limit
    //   color: '#8b5cf6',
    // },

    // Roth IRA
    {
      id: 'investment-1',
      name: 'Roth IRA',
      type: ComponentType.INVESTMENT_ACCOUNT,
      startDate: startOfMonth,
      balance: 20000,
      projectedAnnualReturn: 7,
      accountType: InvestmentAccountType.ROTH_IRA,
      color: '#a855f7',
    },

    // // Car Loan
    // {
    //   id: 'debt-1',
    //   name: 'Car Loan',
    //   type: ComponentType.DEBT,
    //   startDate: startOfMonth,
    //   currentBalance: 18000,
    //   interestRate: 4.5,
    //   monthlyPayment: 550,
    //   color: '#dc2626',
    // },

    // // Student Loan
    // {
    //   id: 'debt-2',
    //   name: 'Student Loan',
    //   type: ComponentType.DEBT,
    //   startDate: startOfMonth,
    //   currentBalance: 35000,
    //   interestRate: 5.5,
    //   monthlyPayment: 400,
    //   color: '#b91c1c',
    // },

    // Future Home Purchase (6 months from now)
    {
      id: 'home-1',
      name: 'Future Home Purchase',
      type: ComponentType.FUTURE_HOME_PURCHASE,
      startDate: startOfMonth,
      purchasePrice: 1000000,
      downPaymentPercent: 20, // 20% down payment
      interestRate: 6.5,
      mortgageTerm: MortgageTerm.THIRTY_YEARS,
      purchaseDate: (() => {
        const date = new Date(today);
        date.setMonth(today.getMonth() + 36);
        return date;
      })(),
      // monthlyPayment will be calculated automatically
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

  const newRaiseDate = new Date(today);
  newRaiseDate.setDate(today.getDate() + 12);

  // Salary raise after 6 months
  edits.set('income-1', [
    {
      componentId: 'income-1',
      editDate: sixMonthsAgo,
      changes: {
        annualAmount: 180000,
      },
    },
    {
      componentId: 'income-1',
      editDate: newRaiseDate,
      changes: {
        annualAmount: 215000,
      },
    },
  ]);

  // // Increase 401k contribution
  // edits.set('investment-1', [
  //   {
  //     componentId: 'investment-1',
  //     editDate: today,
  //     changes: {
  //       balance: 55000, // Bonus contribution
  //     },
  //   },
  // ]);

  // // Pay off car loan early
  // const oneYearFromNow = new Date(today);
  // oneYearFromNow.setFullYear(today.getFullYear() + 1);

  // edits.set('debt-1', [
  //   {
  //     componentId: 'debt-1',
  //     editDate: oneYearFromNow,
  //     changes: {
  //       monthlyPayment: 1000, // Increase payment to pay off faster
  //     },
  //   },
  // ]);

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
      frequency: TransactionFrequency.MONTHLY,
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
