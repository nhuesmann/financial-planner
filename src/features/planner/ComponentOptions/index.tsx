import { View } from 'react-native';

import { ComponentType } from '@/types';

import { ComponentGroup } from './ComponentGroup';
import { ComponentOption } from './ComponentOption';

export const ComponentOptions = () => {
  return (
    <View className="flex flex-1 gap-2 bg-slate-100 p-3">
      <ComponentGroup title="💰 Cash Flow" />
      <ComponentOption type={ComponentType.INCOME} label="💵 Income" />
      <ComponentOption type={ComponentType.EXPENSE} label="💸 Expense" />
      <ComponentGroup title="🏠 Assets" />
      <ComponentOption type={ComponentType.CHECKING_ACCOUNT} label="💰 Checking Account" />
      <ComponentOption type={ComponentType.SAVINGS_ACCOUNT} label="🏦 Savings Account" />
      <ComponentOption type={ComponentType.INVESTMENT_ACCOUNT} label="📈 Investment Account" />
      <ComponentOption type={ComponentType.CURRENT_HOME} label="🏠 Current Home" />
      <ComponentOption type={ComponentType.FUTURE_HOME_PURCHASE} label="🏡 Future Home" />
      <ComponentGroup title="⚠️ Liabilities" />
      <ComponentOption type={ComponentType.DEBT} label="💳 Debt" />
      <ComponentGroup title="⚡ Special Events" />
      <ComponentOption type={ComponentType.RETIREMENT_MILESTONE} label="🎉 Retirement Milestone" />
    </View>
  );
};
