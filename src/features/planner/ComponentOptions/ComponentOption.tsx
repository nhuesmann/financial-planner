import { Text, View } from 'react-native';

import { ComponentType } from '@/types';

interface Props {
  type: ComponentType;
  label: string;
}

export const ComponentOption = ({ label }: Props) => {
  return (
    <View className="flex h-14 flex-row items-center rounded-xl border-2 border-gray-300 bg-white p-2">
      <Text>{label}</Text>
    </View>
  );
};
