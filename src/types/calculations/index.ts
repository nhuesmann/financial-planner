export type Currency = number;

export interface Money {
  amount: Currency;
  currency?: string;
}

export type InterestRate = number;
export type TaxRate = number;
export type InflationRate = number;

export interface CompoundInterestParams {
  principal: Currency;
  rate: InterestRate;
  timePeriods: number;
  compoundingFrequency: number;
  additionalContributions?: Currency;
}

export interface CompoundInterestResult {
  futureValue: Currency;
  totalContributions: Currency;
  totalInterestEarned: Currency;
}

export interface AmortizationScheduleItem {
  period: number;
  date: Date;
  payment: Currency;
  principal: Currency;
  interest: Currency;
  balance: Currency;
}

export interface LoanCalculationParams {
  principal: Currency;
  interestRate: InterestRate;
  termMonths: number;
  extraPayment?: Currency;
}

export interface LoanCalculationResult {
  monthlyPayment: Currency;
  totalPayment: Currency;
  totalInterest: Currency;
  payoffDate: Date;
  amortizationSchedule: AmortizationScheduleItem[];
}

export interface TaxCalculationParams {
  grossIncome: Currency;
  taxRate: TaxRate;
  deductions?: Currency;
  credits?: Currency;
}

export interface TaxCalculationResult {
  taxableIncome: Currency;
  taxOwed: Currency;
  effectiveTaxRate: TaxRate;
  afterTaxIncome: Currency;
}

export interface RetirementCalculationParams {
  currentAge: number;
  retirementAge: number;
  currentSavings: Currency;
  monthlyContribution: Currency;
  expectedReturn: InterestRate;
  inflationRate: InflationRate;
  expectedRetirementExpenses: Currency;
  withdrawalRate: number;
}

export interface RetirementCalculationResult {
  projectedRetirementBalance: Currency;
  inflationAdjustedBalance: Currency;
  monthlyRetirementIncome: Currency;
  canRetire: boolean;
  shortfall?: Currency;
  yearsOfRetirement: number;
}

export interface FIRECalculationParams {
  annualExpenses: Currency;
  currentNetWorth: Currency;
  annualSavings: Currency;
  expectedReturn: InterestRate;
  safeWithdrawalRate: number;
}

export interface FIRECalculationResult {
  fireNumber: Currency;
  yearsToFIRE: number;
  currentProgress: number;
  projectedFIREDate: Date;
}

export interface NetWorthCalculation {
  assets: {
    cash: Currency;
    investments: Currency;
    realEstate: Currency;
    otherAssets: Currency;
  };
  liabilities: {
    mortgages: Currency;
    loans: Currency;
    creditCards: Currency;
    otherDebts: Currency;
  };
  totalAssets: Currency;
  totalLiabilities: Currency;
  netWorth: Currency;
}

export interface CashFlowCalculation {
  income: {
    salary: Currency;
    investments: Currency;
    other: Currency;
  };
  expenses: {
    housing: Currency;
    transportation: Currency;
    food: Currency;
    utilities: Currency;
    entertainment: Currency;
    other: Currency;
  };
  totalIncome: Currency;
  totalExpenses: Currency;
  netCashFlow: Currency;
  savingsRate: number;
}

export interface ProjectionPoint {
  date: Date;
  value: Currency;
  breakdown?: Record<string, Currency>;
}

export interface FinancialProjection {
  timeline: ProjectionPoint[];
  summary: {
    startValue: Currency;
    endValue: Currency;
    totalGrowth: Currency;
    averageGrowthRate: number;
  };
}
