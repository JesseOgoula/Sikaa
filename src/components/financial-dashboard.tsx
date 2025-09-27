import { MetricCard } from "@/components/ui/metric-card";
import { TransactionItem } from "@/components/ui/transaction-item";
import { ProfitChart } from "@/components/ui/profit-chart";
import { SpendingLimit } from "@/components/ui/spending-limit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";

const transactions = [
  {
    id: "INV_000076",
    activity: "Mobile App Purchase",
    price: "$25,500",
    status: "completed" as const,
    date: "17 Apr, 2026 03:45 PM",
    icon: "mobile" as const,
  },
  {
    id: "INV_000075",
    activity: "Hotel Booking",
    price: "$32,750",
    status: "pending" as const,
    date: "15 Apr, 2026 11:30 AM",
    icon: "hotel" as const,
  },
  {
    id: "INV_000074",
    activity: "Flight Ticket Booking",
    price: "$40,200",
    status: "completed" as const,
    date: "15 Apr, 2026 12:00 PM",
    icon: "travel" as const,
  },
  {
    id: "INV_000073",
    activity: "Grocery Purchase",
    price: "$50,200",
    status: "in-progress" as const,
    date: "14 Apr, 2026 09:15 PM",
    icon: "shopping" as const,
  },
  {
    id: "INV_000072",
    activity: "Software License",
    price: "$15,900",
    status: "completed" as const,
    date: "10 Apr, 2026 06:00 AM",
    icon: "software" as const,
  },
];

export function FinancialDashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Financial Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, manage your finances efficiently</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <Wallet className="h-4 w-4" />
            </Button>
            <Button className="bg-finance-primary hover:bg-finance-primary/90">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Transfer
            </Button>
          </div>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Balance"
            value="$689,372.00"
            change={{ percentage: "+5%", trend: "up", period: "than last month" }}
            variant="default"
          />
          <MetricCard
            title="Total Earnings"
            value="$950"
            change={{ percentage: "+7%", trend: "up", period: "This month" }}
            variant="primary"
          />
          <MetricCard
            title="Total Spending"
            value="$700"
            change={{ percentage: "+5%", trend: "down", period: "This month" }}
            variant="default"
          />
          <MetricCard
            title="Total Income"
            value="$1,050"
            change={{ percentage: "+8%", trend: "up", period: "This month" }}
            variant="default"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Total Revenue"
            value="$850"
            change={{ percentage: "+4%", trend: "down", period: "This month" }}
            variant="default"
          />
          <SpendingLimit spent={1400} limit={5500} />
          <ProfitChart />
        </div>

        {/* Recent Activities */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">Recent Activities</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  {...transaction}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}