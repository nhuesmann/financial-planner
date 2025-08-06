import { View } from 'react-native';

import { FinancialSidebar } from '@/components/financial-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

import { Chart } from './Chart';

export const PlannerScreen = () => {
  return (
    <SidebarProvider>
      <View className="flex flex-1 flex-row bg-background">
        <FinancialSidebar />
        <View className="flex-1">
          <View className="flex flex-row items-center border-b border-border p-2">
            <SidebarTrigger />
            <View className="ml-4">
              <span className="text-lg font-semibold text-foreground">Financial Planner</span>
            </View>
          </View>
          <View className="flex-1 p-4">
            <Chart />
          </View>
        </View>
      </View>
    </SidebarProvider>
  );
};
