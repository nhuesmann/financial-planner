import { View } from 'react-native';

import { Chart } from './Chart';
import { ComponentOptions } from './ComponentOptions';

export const PlannerScreen = () => {
  return (
    <View className="flex flex-1 flex-row">
      <View className="w-1/5">
        <ComponentOptions />
      </View>
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Chart />
      </View>
    </View>
  );
};
