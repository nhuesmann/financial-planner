export enum ComponentType {
  CHECKING_ACCOUNT = 'CHECKING_ACCOUNT',
  SAVINGS_ACCOUNT = 'SAVINGS_ACCOUNT',
  INVESTMENT_ACCOUNT = 'INVESTMENT_ACCOUNT',
  DEBT = 'DEBT',
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  CURRENT_HOME = 'CURRENT_HOME',
  FUTURE_HOME_PURCHASE = 'FUTURE_HOME_PURCHASE',
  RETIREMENT_MILESTONE = 'RETIREMENT_MILESTONE',
}

export enum InvestmentAccountType {
  FOUR_ZERO_ONE_K = '401k',
  ROTH_IRA = 'Roth IRA',
  TRADITIONAL_IRA = 'Traditional IRA',
  BROKERAGE = 'Brokerage',
  CRYPTO = 'Crypto',
  HSA = 'HSA',
}

export enum ExpenseFrequency {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum MortgageTerm {
  FIFTEEN_YEARS = 15,
  THIRTY_YEARS = 30,
}

export interface BaseComponent {
  id: string;
  name: string;
  type: ComponentType;
  startDate: Date;
  endDate?: Date;
  notes?: string;
  color?: string; // For chart visualization
}

export interface CheckingAccount extends BaseComponent {
  type: ComponentType.CHECKING_ACCOUNT;
  balance: number;
}

export interface SavingsAccount extends BaseComponent {
  type: ComponentType.SAVINGS_ACCOUNT;
  balance: number;
  interestRate: number;
}

export interface InvestmentAccount extends BaseComponent {
  type: ComponentType.INVESTMENT_ACCOUNT;
  balance: number;
  projectedAnnualReturn: number;
  accountType: InvestmentAccountType;
}

export interface Debt extends BaseComponent {
  type: ComponentType.DEBT;
  currentBalance: number;
  interestRate: number;
  monthlyPayment: number;
}

export interface Income extends BaseComponent {
  type: ComponentType.INCOME;
  annualAmount: number;
  taxRate: number;
}

export interface Expense extends BaseComponent {
  type: ComponentType.EXPENSE;
  amount: number;
  frequency: ExpenseFrequency;
  isRecurring: boolean;
}

export interface CurrentHome extends BaseComponent {
  type: ComponentType.CURRENT_HOME;
  currentHomeValue: number;
  remainingMortgageBalance: number;
  monthlyPayment: number;
  interestRate: number;
  yearsRemainingOnMortgage: number;
}

export interface FutureHomePurchase extends BaseComponent {
  type: ComponentType.FUTURE_HOME_PURCHASE;
  purchasePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  mortgageTerm: MortgageTerm;
  purchaseDate: Date;
}

export interface RetirementMilestone extends BaseComponent {
  type: ComponentType.RETIREMENT_MILESTONE;
  targetRetirementAge?: number;
  targetNetWorth?: number;
  expectedRetirementExpensesPercent: number;
  withdrawalRate: number;
}

export type Component =
  | CheckingAccount
  | SavingsAccount
  | InvestmentAccount
  | Debt
  | Income
  | Expense
  | CurrentHome
  | FutureHomePurchase
  | RetirementMilestone;

export interface ComponentEdit {
  componentId: string;
  editDate: Date;
  changes: Partial<Component>;
}

export interface ComponentWithEdits {
  component: Component;
  edits: ComponentEdit[];
}
