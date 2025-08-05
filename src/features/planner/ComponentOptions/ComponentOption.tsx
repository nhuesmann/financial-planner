import { Text, View } from 'react-native';

interface Props {
  type: string;
}

export const ComponentOption = ({ type }: Props) => {
  return (
    <View className="flex h-14 flex-row items-center rounded-xl border-2 border-gray-300 bg-white p-2">
      <Text>{type}</Text>
    </View>
  );
};
