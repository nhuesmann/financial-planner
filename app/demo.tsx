import { TimelineChart } from '@/components/TimelineChart';
// import { generateDummyChartData } from '@/data/dummyData';
import { generateDummyChartData } from '@/data/dummyDataRealistic';

export default function DemoPage() {
  const chartData = generateDummyChartData();

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-2 text-3xl font-bold">Financial Timeline Demo</h1>
      <p className="mb-8 text-muted-foreground">
        Interactive visualization of your financial components over time. Click the legend items to
        show/hide components.
      </p>

      <div className="rounded-lg bg-card p-6">
        <TimelineChart data={chartData} height={600} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Components Included</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              Software Engineer Salary ($120k → $145k)
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500"></span>
              Checking Account ($15k)
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
              Emergency Fund (4.5% APY)
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-violet-500"></span>
              401(k) & Roth IRA
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-cyan-500"></span>
              Primary Residence
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
              Car & Student Loans
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-orange-500"></span>
              Monthly Expenses
            </li>
          </ul>
        </div>

        <div className="rounded-lg bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Key Features</h2>
          <ul className="space-y-2 text-sm">
            <li>• Net worth area chart (green when positive, red when negative)</li>
            <li>• Individual component lines with custom colors</li>
            <li>• Edit points marked with circles on the timeline</li>
            <li>• Interactive legend to show/hide components</li>
            <li>• Hover tooltips with detailed values</li>
            <li>• Monthly granularity calculations</li>
            <li>• 5-year projection window</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-muted p-6">
        <h2 className="mb-4 text-xl font-semibold">Data Model Highlights</h2>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
          <div>
            <h3 className="mb-2 font-semibold">Component Types</h3>
            <ul className="space-y-1">
              <li>• Checking Account</li>
              <li>• Savings Account</li>
              <li>• Investment Account</li>
              <li>• Debt</li>
              <li>• Income</li>
              <li>• Expense</li>
              <li>• Current Home</li>
              <li>• Future Home</li>
              <li>• Retirement</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Calculations</h3>
            <ul className="space-y-1">
              <li>• Compound interest</li>
              <li>• Loan amortization</li>
              <li>• Tax calculations</li>
              <li>• Home appreciation</li>
              <li>• Investment returns</li>
              <li>• Net worth aggregation</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Timeline Features</h3>
            <ul className="space-y-1">
              <li>• Monthly data points</li>
              <li>• Component edits</li>
              <li>• Real-time updates</li>
              <li>• Date range filtering</li>
              <li>• Granularity options</li>
              <li>• Performance optimization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
