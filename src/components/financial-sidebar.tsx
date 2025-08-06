import {
  Building,
  ChevronRight,
  CreditCard,
  DollarSign,
  Home,
  PiggyBank,
  Target,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ComponentType } from '@/types';

const componentGroups = [
  {
    title: '💰 Cash Flow',
    items: [
      {
        type: ComponentType.INCOME,
        label: 'Income',
        icon: DollarSign,
      },
      {
        type: ComponentType.EXPENSE,
        label: 'Expense',
        icon: CreditCard,
      },
    ],
  },
  {
    title: '🏠 Assets',
    items: [
      {
        type: ComponentType.CHECKING_ACCOUNT,
        label: 'Checking Account',
        icon: Wallet,
      },
      {
        type: ComponentType.SAVINGS_ACCOUNT,
        label: 'Savings Account',
        icon: PiggyBank,
      },
      {
        type: ComponentType.INVESTMENT_ACCOUNT,
        label: 'Investment Account',
        icon: TrendingUp,
      },
      {
        type: ComponentType.CURRENT_HOME,
        label: 'Current Home',
        icon: Home,
      },
      {
        type: ComponentType.FUTURE_HOME_PURCHASE,
        label: 'Future Home',
        icon: Building,
      },
    ],
  },
  {
    title: '⚠️ Liabilities',
    items: [
      {
        type: ComponentType.DEBT,
        label: 'Debt',
        icon: CreditCard,
      },
    ],
  },
  {
    title: '⚡ Special Events',
    items: [
      {
        type: ComponentType.RETIREMENT_MILESTONE,
        label: 'Retirement Milestone',
        icon: Target,
      },
    ],
  },
];

export function FinancialSidebar() {
  const handleComponentClick = (type: ComponentType) => {
    console.log('Component clicked:', type);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {componentGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.type}>
                    <SidebarMenuButton
                      onClick={() => handleComponentClick(item.type)}
                      className="cursor-pointer"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
