import { View } from 'react-native';

import { ComponentGroup } from './ComponentGroup';
import { ComponentOption } from './ComponentOption';

export const ComponentOptions = () => {
  return (
    <View className="flex flex-1 gap-2 bg-slate-100 p-3">
      <ComponentGroup title="💰 Cash Flow" />
      <ComponentOption type="💵 Income" />
      <ComponentOption type="💸 Expense" />
      <ComponentGroup title="🏠 Assets" />
      <ComponentOption type="💰 Checking Account" />
      <ComponentOption type="🏦 Savings Account" />
      <ComponentOption type="📈 Investment Account" />
      <ComponentOption type="🏠 Current Home" />
      <ComponentOption type="🏡 Future Home" />
      <ComponentGroup title="⚠️ Liabilities" />
      <ComponentOption type="💳 Debt" />
      <ComponentGroup title="⚡ Special Events" />
      <ComponentOption type="🎉 Retirement Milestone" />
    </View>
  );
};
