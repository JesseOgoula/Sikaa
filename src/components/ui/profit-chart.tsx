import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartData {
  month: string;
  profit: number;
  loss: number;
}

const chartData: ChartData[] = [
  { month: "Jan", profit: 35, loss: 25 },
  { month: "Feb", profit: 38, loss: 18 },
  { month: "Mar", profit: 32, loss: 22 },
  { month: "Apr", profit: 40, loss: 20 },
  { month: "May", profit: 42, loss: 28 },
  { month: "Jun", profit: 45, loss: 30 },
  { month: "Jul", profit: 38, loss: 25 },
  { month: "Aug", profit: 35, loss: 20 },
];

export function ProfitChart() {
  const maxValue = Math.max(...chartData.flatMap(d => [d.profit, d.loss]));

  return (
    <Card className="shadow-card border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Profit and Loss</CardTitle>
        <p className="text-sm text-muted-foreground">View your income in a certain period of time</p>
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-finance-primary"></div>
            <span className="text-sm font-medium">Profit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-foreground"></div>
            <span className="text-sm font-medium">Loss</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between h-48 gap-4">
          {chartData.map((data, index) => (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              <div className="flex flex-col items-center gap-1 h-40 justify-end">
                <div 
                  className="w-full bg-finance-primary rounded-t transition-all duration-300 hover:opacity-80"
                  style={{ 
                    height: `${(data.profit / maxValue) * 100}%`,
                    minHeight: '8px'
                  }}
                />
                <div 
                  className="w-full bg-foreground rounded-b transition-all duration-300 hover:opacity-80"
                  style={{ 
                    height: `${(data.loss / maxValue) * 100}%`,
                    minHeight: '8px'
                  }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {data.month}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}