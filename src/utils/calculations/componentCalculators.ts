import {
  CheckingAccount,
  Component,
  ComponentEdit,
  ComponentType,
  CurrentHome,
  Debt,
  Expense,
  ExpenseFrequency,
  FutureHomePurchase,
  Income,
  InvestmentAccount,
  SavingsAccount,
} from '@/types/components';
import { TimelineDataPoint } from '@/types/timeline/chart';

/**
 * Generates monthly data points for a date range
 */
export function generateMonthlyDates(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    dates.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }

  return dates;
}

/**
 * Apply component edits to timeline data
 */
export function applyEditsToTimeline(
  timeline: TimelineDataPoint[],
  edits: ComponentEdit[],
  component: Component,
  dateRange: Date[]
): TimelineDataPoint[] {
  if (edits.length === 0) return timeline;

  const sortedEdits = [...edits].sort((a, b) => a.editDate.getTime() - b.editDate.getTime());

  // Create a new component with edits applied progressively
  let currentComponent = { ...component };
  let result: TimelineDataPoint[] = [];
  let editIndex = 0;

  for (let i = 0; i < dateRange.length; i++) {
    const date = dateRange[i];

    // Check if we need to apply an edit at this date
    while (
      editIndex < sortedEdits.length &&
      sortedEdits[editIndex].editDate.getTime() <= date.getTime()
    ) {
      // Apply the edit to the component
      currentComponent = {
        ...currentComponent,
        ...sortedEdits[editIndex].changes,
      } as Component;
      editIndex++;
    }

    // Recalculate the value with the current component state
    const newTimeline = calculateComponentTimelineWithoutEdits(currentComponent, [date]);

    // Check if this is an edit point
    const isEditPoint = sortedEdits.some(
      (edit) => Math.abs(edit.editDate.getTime() - date.getTime()) < 86400000
    );

    result.push({
      ...newTimeline[0],
      isEdit: isEditPoint,
      editId: isEditPoint ? `${component.id}-${date.getTime()}` : undefined,
    });
  }

  return result;
}

/**
 * Calculate checking account timeline
 */
export function calculateCheckingAccount(
  component: CheckingAccount,
  dateRange: Date[]
): TimelineDataPoint[] {
  return dateRange.map((date) => ({
    date,
    value: component.balance,
    componentId: component.id,
  }));
}

/**
 * Calculate savings account timeline with compound interest
 */
export function calculateSavingsAccount(
  component: SavingsAccount,
  dateRange: Date[]
): TimelineDataPoint[] {
  const monthlyRate = component.interestRate / 100 / 12;
  let balance = component.balance;

  return dateRange.map((date) => {
    if (date > component.startDate) {
      balance = balance * (1 + monthlyRate);
    }

    return {
      date,
      value: Math.round(balance * 100) / 100,
      componentId: component.id,
    };
  });
}

/**
 * Calculate investment account timeline with compound growth
 */
export function calculateInvestmentAccount(
  component: InvestmentAccount,
  dateRange: Date[],
  monthlyContribution: number = 0
): TimelineDataPoint[] {
  const monthlyReturn = component.projectedAnnualReturn / 100 / 12;
  let balance = component.balance;

  return dateRange.map((date) => {
    if (date > component.startDate) {
      balance = balance * (1 + monthlyReturn) + monthlyContribution;
    }

    return {
      date,
      value: Math.round(balance * 100) / 100,
      componentId: component.id,
    };
  });
}

/**
 * Calculate debt timeline with interest and payments
 */
export function calculateDebt(component: Debt, dateRange: Date[]): TimelineDataPoint[] {
  const monthlyRate = component.interestRate / 100 / 12;
  let balance = component.currentBalance;
  const timeline: TimelineDataPoint[] = [];

  for (const date of dateRange) {
    if (date >= component.startDate && balance > 0) {
      // Apply interest
      const interestCharge = balance * monthlyRate;
      // Apply payment
      const principalPayment = Math.min(component.monthlyPayment - interestCharge, balance);
      balance = Math.max(0, balance - principalPayment);
    }

    timeline.push({
      date,
      value: -Math.round(balance * 100) / 100, // Negative for liabilities
      componentId: component.id,
    });
  }

  return timeline;
}

/**
 * Calculate income timeline
 */
export function calculateIncome(component: Income, dateRange: Date[]): TimelineDataPoint[] {
  const monthlyGross = component.annualAmount / 12;
  const monthlyNet = monthlyGross * (1 - component.taxRate / 100);

  return dateRange.map((date) => ({
    date,
    value:
      date >= component.startDate && (!component.endDate || date <= component.endDate)
        ? Math.round(monthlyNet * 100) / 100
        : 0,
    componentId: component.id,
  }));
}

/**
 * Calculate expense timeline
 */
export function calculateExpense(component: Expense, dateRange: Date[]): TimelineDataPoint[] {
  return dateRange.map((date) => {
    if (date < component.startDate || (component.endDate && date > component.endDate)) {
      return { date, value: 0, componentId: component.id };
    }

    let monthlyAmount = 0;

    switch (component.frequency) {
      case ExpenseFrequency.MONTHLY:
        monthlyAmount = component.amount;
        break;
      case ExpenseFrequency.WEEKLY:
        monthlyAmount = (component.amount * 52) / 12;
        break;
      case ExpenseFrequency.YEARLY:
        // Only show expense in the month it occurs
        if (date.getMonth() === component.startDate.getMonth()) {
          monthlyAmount = component.amount / 12;
        }
        break;
    }

    return {
      date,
      value: -Math.round(monthlyAmount * 100) / 100, // Negative for expenses
      componentId: component.id,
    };
  });
}

/**
 * Calculate current home timeline (equity = value - mortgage)
 */
export function calculateCurrentHome(
  component: CurrentHome,
  dateRange: Date[],
  annualAppreciation: number = 0.03
): TimelineDataPoint[] {
  const monthlyRate = component.interestRate / 100 / 12;
  const monthlyAppreciation = annualAppreciation / 12;

  let mortgageBalance = component.remainingMortgageBalance;
  let homeValue = component.currentHomeValue;

  return dateRange.map((date) => {
    if (date >= component.startDate) {
      // Apply home appreciation
      homeValue *= 1 + monthlyAppreciation;

      // Calculate mortgage payment breakdown
      if (mortgageBalance > 0) {
        const interestPayment = mortgageBalance * monthlyRate;
        const principalPayment = component.monthlyPayment - interestPayment;
        mortgageBalance = Math.max(0, mortgageBalance - principalPayment);
      }
    }

    const equity = homeValue - mortgageBalance;

    return {
      date,
      value: Math.round(equity * 100) / 100,
      componentId: component.id,
    };
  });
}

/**
 * Calculate future home purchase timeline
 */
export function calculateFutureHomePurchase(
  component: FutureHomePurchase,
  dateRange: Date[],
  annualAppreciation: number = 0.03
): TimelineDataPoint[] {
  const downPayment = component.purchasePrice * (component.downPaymentPercent / 100);
  const loanAmount = component.purchasePrice - downPayment;
  const monthlyRate = component.interestRate / 100 / 12;
  const totalPayments = component.mortgageTerm * 12;
  const monthlyPayment =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1);

  const monthlyAppreciation = annualAppreciation / 12;
  let mortgageBalance = loanAmount;
  let homeValue = component.purchasePrice;
  let monthsSincePurchase = 0;

  return dateRange.map((date) => {
    if (date < component.purchaseDate) {
      return { date, value: 0, componentId: component.id };
    }

    // Apply home appreciation
    homeValue *= 1 + monthlyAppreciation;

    // Calculate mortgage payment breakdown
    if (mortgageBalance > 0 && monthsSincePurchase > 0) {
      const interestPayment = mortgageBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      mortgageBalance = Math.max(0, mortgageBalance - principalPayment);
    }

    monthsSincePurchase++;
    const equity = homeValue - mortgageBalance;

    return {
      date,
      value: Math.round(equity * 100) / 100,
      componentId: component.id,
    };
  });
}

/**
 * Calculate component timeline without edits (used internally)
 */
function calculateComponentTimelineWithoutEdits(
  component: Component,
  dateRange: Date[]
): TimelineDataPoint[] {
  switch (component.type) {
    case ComponentType.CHECKING_ACCOUNT:
      return calculateCheckingAccount(component as CheckingAccount, dateRange);
    case ComponentType.SAVINGS_ACCOUNT:
      return calculateSavingsAccount(component as SavingsAccount, dateRange);
    case ComponentType.INVESTMENT_ACCOUNT:
      return calculateInvestmentAccount(component as InvestmentAccount, dateRange);
    case ComponentType.DEBT:
      return calculateDebt(component as Debt, dateRange);
    case ComponentType.INCOME:
      return calculateIncome(component as Income, dateRange);
    case ComponentType.EXPENSE:
      return calculateExpense(component as Expense, dateRange);
    case ComponentType.CURRENT_HOME:
      return calculateCurrentHome(component as CurrentHome, dateRange);
    case ComponentType.FUTURE_HOME_PURCHASE:
      return calculateFutureHomePurchase(component as FutureHomePurchase, dateRange);
    default:
      return dateRange.map((date) => ({
        date,
        value: 0,
        componentId: component.id,
      }));
  }
}

/**
 * Main calculator dispatcher
 */
export function calculateComponentTimeline(
  component: Component,
  dateRange: Date[],
  edits: ComponentEdit[] = []
): TimelineDataPoint[] {
  // Apply edits if present
  if (edits.length > 0) {
    return applyEditsToTimeline([], edits, component, dateRange);
  }

  // Otherwise calculate normally
  return calculateComponentTimelineWithoutEdits(component, dateRange);
}
