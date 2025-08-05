import { Text } from 'react-native';

interface Props {
  title: string;
}

export const ComponentGroup = ({ title }: Props) => {
  return <Text className="mt-3 text-lg font-semibold">{title}</Text>;
};
