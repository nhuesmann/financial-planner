import {
  Component,
  ComponentEdit,
  ComponentType,
  Expense,
  FutureHomePurchase,
  Income,
  InvestmentAccount,
  InvestmentAccountType,
  SavingsAccount,
  TransactionFrequency,
} from '@/types/components';
import { TimelineDataPoint } from '@/types/timeline/chart';

export interface MonthlyFlow {
  date: Date;
  income: number;
  expenses: number;
  debtPayments: number;
  savingsContributions: number;
  investmentContributions: number;
  homeDownPayments?: number;
  homeMortgagePayments?: number;
  netFlow: number;
}

export interface AccountBalances {
  date: Date;
  checking: number;
  savings: Map<string, number>;
  investments: Map<string, number>;
  debts: Map<string, number>;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

export class AccountFlowCalculator {
  private components: Component[];
  private edits: Map<string, ComponentEdit[]>;
  private monthlyFlows: MonthlyFlow[] = [];
  private accountBalances: AccountBalances[] = [];

  /**
   * Convert any frequency amount to monthly equivalent
   */
  private convertToMonthly(amount: number, frequency: TransactionFrequency): number {
    switch (frequency) {
      case TransactionFrequency.WEEKLY:
        return (amount * 52) / 12; // 52 weeks per year / 12 months
      case TransactionFrequency.BIWEEKLY:
        return (amount * 26) / 12; // 26 bi-weekly periods per year / 12 months
      case TransactionFrequency.MONTHLY:
        return amount;
      case TransactionFrequency.YEARLY:
        return amount / 12;
      default:
        return 0;
    }
  }

  constructor(components: Component[], edits: Map<string, ComponentEdit[]> = new Map()) {
    this.components = components;
    this.edits = edits;
  }

  calculateFlows(dateRange: Date[]): {
    flows: MonthlyFlow[];
    balances: AccountBalances[];
    componentTimelines: Map<string, TimelineDataPoint[]>;
  } {
    const componentTimelines = new Map<string, TimelineDataPoint[]>();

    // Initialize starting balances
    let checkingBalance = this.getInitialCheckingBalance();
    const savingsBalances = new Map<string, number>();
    const investmentBalances = new Map<string, number>();
    const debtBalances = new Map<string, number>();

    // Initialize account balances from components
    this.components.forEach((component) => {
      switch (component.type) {
        case ComponentType.SAVINGS_ACCOUNT:
          savingsBalances.set(component.id, component.balance);
          break;
        case ComponentType.INVESTMENT_ACCOUNT:
          investmentBalances.set(component.id, component.balance);
          break;
        case ComponentType.DEBT:
          debtBalances.set(component.id, component.currentBalance);
          break;
      }
    });

    // Process each month
    for (let i = 0; i < dateRange.length; i++) {
      const date = dateRange[i];

      // Calculate monthly flows
      const monthlyIncome = this.calculateMonthlyIncome(date);
      const monthlyExpenses = this.calculateMonthlyExpenses(date);
      const monthlyDebtPayments = this.calculateMonthlyDebtPayments(date, debtBalances);
      const monthlySavingsContributions = this.calculateMonthlySavingsContributions(date);
      const monthlyInvestmentContributions = this.calculateMonthlyInvestmentContributions(date);
      const monthlyHomeMortgagePayments = this.calculateMonthlyHomeMortgagePayments(date);

      // Calculate net flow for the month
      const netFlow =
        monthlyIncome -
        monthlyExpenses -
        monthlyDebtPayments -
        monthlySavingsContributions -
        monthlyInvestmentContributions -
        monthlyHomeMortgagePayments;

      // Update checking account balance
      checkingBalance += netFlow;

      // Handle home down payments (one-time deduction on purchase date)
      const homeDownPayments = this.calculateHomeDownPayments(date);
      checkingBalance -= homeDownPayments;

      // Update savings accounts (add contributions and apply interest)
      savingsBalances.forEach((balance, id) => {
        const component = this.components.find((c) => c.id === id);
        if (component?.type === ComponentType.SAVINGS_ACCOUNT) {
          const monthlyRate = component.interestRate / 100 / 12;
          const contribution = this.getSavingsContribution(id, date);
          savingsBalances.set(id, balance * (1 + monthlyRate) + contribution);
        }
      });

      // Update investment accounts (add contributions and apply returns)
      investmentBalances.forEach((balance, id) => {
        const component = this.components.find((c) => c.id === id);
        if (component?.type === ComponentType.INVESTMENT_ACCOUNT) {
          const investmentAccount = component as InvestmentAccount;
          const monthlyReturn = investmentAccount.projectedAnnualReturn / 100 / 12;
          const employeeContribution = this.getInvestmentContribution(id, date);
          const employerMatch = this.getEmployerMatch(
            investmentAccount,
            employeeContribution,
            date
          );
          const totalContribution = employeeContribution + employerMatch;
          investmentBalances.set(id, balance * (1 + monthlyReturn) + totalContribution);
        }
      });

      // Update debt balances (apply interest and payments)
      debtBalances.forEach((balance, id) => {
        const component = this.components.find((c) => c.id === id);
        if (component?.type === ComponentType.DEBT && balance > 0) {
          const monthlyRate = component.interestRate / 100 / 12;
          const interestCharge = balance * monthlyRate;
          const payment = Math.min(component.monthlyPayment, balance + interestCharge);
          const principalPayment = payment - interestCharge;
          debtBalances.set(id, Math.max(0, balance - principalPayment));
        }
      });

      // Store monthly flow
      this.monthlyFlows.push({
        date,
        income: monthlyIncome,
        expenses: monthlyExpenses,
        debtPayments: monthlyDebtPayments,
        savingsContributions: monthlySavingsContributions,
        investmentContributions: monthlyInvestmentContributions,
        homeDownPayments: homeDownPayments > 0 ? homeDownPayments : undefined,
        homeMortgagePayments:
          monthlyHomeMortgagePayments > 0 ? monthlyHomeMortgagePayments : undefined,
        netFlow: netFlow - homeDownPayments, // Include down payment in net flow
      });

      // Calculate totals for this month
      const totalSavings = Array.from(savingsBalances.values()).reduce((sum, val) => sum + val, 0);
      const totalInvestments = Array.from(investmentBalances.values()).reduce(
        (sum, val) => sum + val,
        0
      );
      const totalDebts = Array.from(debtBalances.values()).reduce((sum, val) => sum + val, 0);
      const totalAssets = checkingBalance + totalSavings + totalInvestments;
      const totalLiabilities = totalDebts;

      // Store account balances
      this.accountBalances.push({
        date,
        checking: checkingBalance,
        savings: new Map(savingsBalances),
        investments: new Map(investmentBalances),
        debts: new Map(debtBalances),
        totalAssets,
        totalLiabilities,
        netWorth: totalAssets - totalLiabilities,
      });

      // Build component timelines
      // Checking account
      const checkingComponent = this.components.find(
        (c) => c.type === ComponentType.CHECKING_ACCOUNT
      );
      if (checkingComponent) {
        if (!componentTimelines.has(checkingComponent.id)) {
          componentTimelines.set(checkingComponent.id, []);
        }
        componentTimelines.get(checkingComponent.id)!.push({
          date,
          value: checkingBalance,
          componentId: checkingComponent.id,
        });
      }

      // Savings accounts
      savingsBalances.forEach((balance, id) => {
        if (!componentTimelines.has(id)) {
          componentTimelines.set(id, []);
        }
        componentTimelines.get(id)!.push({
          date,
          value: balance,
          componentId: id,
        });
      });

      // Investment accounts
      investmentBalances.forEach((balance, id) => {
        if (!componentTimelines.has(id)) {
          componentTimelines.set(id, []);
        }
        componentTimelines.get(id)!.push({
          date,
          value: balance,
          componentId: id,
        });
      });

      // Debts (negative values)
      debtBalances.forEach((balance, id) => {
        if (!componentTimelines.has(id)) {
          componentTimelines.set(id, []);
        }
        componentTimelines.get(id)!.push({
          date,
          value: -balance,
          componentId: id,
        });
      });

      // Income (monthly values)
      this.components
        .filter((c) => c.type === ComponentType.INCOME)
        .forEach((component) => {
          if (!componentTimelines.has(component.id)) {
            componentTimelines.set(component.id, []);
          }
          const monthlyValue = this.getComponentMonthlyValue(component, date);
          componentTimelines.get(component.id)!.push({
            date,
            value: monthlyValue,
            componentId: component.id,
          });
        });

      // Expenses (negative monthly values)
      this.components
        .filter((c) => c.type === ComponentType.EXPENSE)
        .forEach((component) => {
          if (!componentTimelines.has(component.id)) {
            componentTimelines.set(component.id, []);
          }
          const monthlyValue = this.getComponentMonthlyValue(component, date);
          componentTimelines.get(component.id)!.push({
            date,
            value: -Math.abs(monthlyValue),
            componentId: component.id,
          });
        });
    }

    return {
      flows: this.monthlyFlows,
      balances: this.accountBalances,
      componentTimelines,
    };
  }

  private getInitialCheckingBalance(): number {
    const checkingAccount = this.components.find((c) => c.type === ComponentType.CHECKING_ACCOUNT);
    return checkingAccount?.balance || 0;
  }

  private calculateMonthlyIncome(date: Date): number {
    return this.components
      .filter((c) => c.type === ComponentType.INCOME)
      .reduce((total, income) => {
        if (date >= income.startDate && (!income.endDate || date <= income.endDate)) {
          const monthlyGross = income.annualAmount / 12;
          const monthlyNet = monthlyGross * (1 - income.taxRate / 100);
          return total + monthlyNet;
        }
        return total;
      }, 0);
  }

  private calculateMonthlyExpenses(date: Date): number {
    return this.components
      .filter((c) => c.type === ComponentType.EXPENSE)
      .reduce((total, expense) => {
        if (date >= expense.startDate && (!expense.endDate || date <= expense.endDate)) {
          let monthlyAmount = 0;
          switch (expense.frequency) {
            case 'MONTHLY':
              monthlyAmount = expense.amount;
              break;
            case 'WEEKLY':
              monthlyAmount = (expense.amount * 52) / 12;
              break;
            case 'YEARLY':
              if (date.getMonth() === expense.startDate.getMonth()) {
                monthlyAmount = expense.amount / 12;
              }
              break;
          }
          return total + monthlyAmount;
        }
        return total;
      }, 0);
  }

  private calculateMonthlyDebtPayments(date: Date, debtBalances: Map<string, number>): number {
    return this.components
      .filter((c) => c.type === ComponentType.DEBT)
      .reduce((total, debt) => {
        const balance = debtBalances.get(debt.id) || 0;
        if (balance > 0 && date >= debt.startDate) {
          return total + Math.min(debt.monthlyPayment, balance);
        }
        return total;
      }, 0);
  }

  private calculateMonthlySavingsContributions(date: Date): number {
    return this.components
      .filter((c) => c.type === ComponentType.SAVINGS_ACCOUNT)
      .reduce((total, component) => {
        const savings = component as SavingsAccount;
        if (date >= component.startDate && (!component.endDate || date <= component.endDate)) {
          if (savings.contributionAmount && savings.contributionFrequency) {
            return (
              total +
              this.convertToMonthly(savings.contributionAmount, savings.contributionFrequency)
            );
          }
        }
        return total;
      }, 0);
  }

  private calculateMonthlyInvestmentContributions(date: Date): number {
    return this.components
      .filter((c) => c.type === ComponentType.INVESTMENT_ACCOUNT)
      .reduce((total, component) => {
        const investment = component as InvestmentAccount;
        if (date >= component.startDate && (!component.endDate || date <= component.endDate)) {
          if (investment.contributionAmount && investment.contributionFrequency) {
            return (
              total +
              this.convertToMonthly(investment.contributionAmount, investment.contributionFrequency)
            );
          }
        }
        return total;
      }, 0);
  }

  private getSavingsContribution(accountId: string, date: Date): number {
    const component = this.components.find((c) => c.id === accountId);
    if (component?.type === ComponentType.SAVINGS_ACCOUNT) {
      const savings = component as SavingsAccount;
      if (date >= component.startDate && (!component.endDate || date <= component.endDate)) {
        if (savings.contributionAmount && savings.contributionFrequency) {
          return this.convertToMonthly(savings.contributionAmount, savings.contributionFrequency);
        }
      }
    }
    return 0;
  }

  private getInvestmentContribution(accountId: string, date: Date): number {
    const component = this.components.find((c) => c.id === accountId);
    if (component?.type === ComponentType.INVESTMENT_ACCOUNT) {
      const investment = component as InvestmentAccount;
      if (date >= component.startDate && (!component.endDate || date <= component.endDate)) {
        if (investment.contributionAmount && investment.contributionFrequency) {
          return this.convertToMonthly(
            investment.contributionAmount,
            investment.contributionFrequency
          );
        }
      }
    }
    return 0;
  }

  private getEmployerMatch(
    investment: InvestmentAccount,
    employeeContribution: number,
    date: Date
  ): number {
    // Only 401k accounts get employer match
    if (investment.accountType !== InvestmentAccountType.FOUR_ZERO_ONE_K) {
      return 0;
    }

    if (!investment.employerMatchPercent || investment.employerMatchPercent === 0) {
      return 0;
    }

    if (date < investment.startDate || (investment.endDate && date > investment.endDate)) {
      return 0;
    }

    // Calculate match amount
    const matchAmount = employeeContribution * (investment.employerMatchPercent / 100);

    // Apply annual limit if specified
    if (investment.employerMatchLimit) {
      // Track how much has been matched this year
      // For simplicity, we'll apply monthly limit (annual / 12)
      const monthlyLimit = investment.employerMatchLimit / 12;
      return Math.min(matchAmount, monthlyLimit);
    }

    return matchAmount;
  }

  private calculateHomeDownPayments(date: Date): number {
    // Check if any future home purchases happen this month
    return this.components
      .filter((c) => c.type === ComponentType.FUTURE_HOME_PURCHASE)
      .reduce((total, component) => {
        const home = component as FutureHomePurchase;

        // Check if this is the purchase month
        const purchaseMonth = home.purchaseDate.getMonth();
        const purchaseYear = home.purchaseDate.getFullYear();
        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();

        if (purchaseMonth === currentMonth && purchaseYear === currentYear) {
          // Calculate down payment
          const downPayment = home.purchasePrice * (home.downPaymentPercent / 100);
          return total + downPayment;
        }
        return total;
      }, 0);
  }

  private calculateMonthlyHomeMortgagePayments(date: Date): number {
    return this.components
      .filter((c) => c.type === ComponentType.FUTURE_HOME_PURCHASE)
      .reduce((total, component) => {
        const home = component as FutureHomePurchase;

        // Only add payment if we're past the purchase date
        if (date >= home.purchaseDate) {
          // Calculate monthly payment if not provided
          if (home.monthlyPayment) {
            return total + home.monthlyPayment;
          } else {
            // Calculate payment using standard mortgage formula
            const loanAmount = home.purchasePrice * (1 - home.downPaymentPercent / 100);
            const monthlyRate = home.interestRate / 100 / 12;
            const numPayments = home.mortgageTerm * 12;

            if (monthlyRate === 0) {
              // Simple case: no interest
              return total + loanAmount / numPayments;
            }

            const monthlyPayment =
              (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
              (Math.pow(1 + monthlyRate, numPayments) - 1);

            return total + monthlyPayment;
          }
        }
        return total;
      }, 0);
  }

  private getComponentMonthlyValue(component: Component, date: Date): number {
    if (date < component.startDate || (component.endDate && date > component.endDate)) {
      return 0;
    }

    switch (component.type) {
      case ComponentType.INCOME:
        const income = component as Income;
        const monthlyGross = income.annualAmount / 12;
        return monthlyGross * (1 - income.taxRate / 100);

      case ComponentType.EXPENSE:
        const expense = component as Expense;
        switch (expense.frequency) {
          case 'MONTHLY':
            return expense.amount;
          case 'WEEKLY':
            return (expense.amount * 52) / 12;
          case 'YEARLY':
            return date.getMonth() === expense.startDate.getMonth() ? expense.amount / 12 : 0;
          default:
            return 0;
        }

      default:
        return 0;
    }
  }
}
