import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartData = [
  { month: "Jan", profit: 35, loss: 25 },
  { month: "Feb", profit: 38, loss: 18 },
  { month: "Mar", profit: 32, loss: 22 },
  { month: "Apr", profit: 40, loss: 20 },
  { month: "May", profit: 42, loss: 28 },
  { month: "Jun", profit: 45, loss: 30 },
  { month: "Jul", profit: 38, loss: 25 },
  { month: "Aug", profit: 35, loss: 20 },
];

export function TotalIncomeCard() {
  const maxValue = Math.max(...chartData.flatMap(d => [d.profit, d.loss]));

  return (
    <Card className="shadow-card border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Revenus Totaux</CardTitle>
        <p className="text-sm text-muted-foreground">Visualisez vos revenus sur une période donnée</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Legend */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-finance-primary"></div>
                <span className="text-sm font-medium">Bénéfices</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-foreground"></div>
                <span className="text-sm font-medium">Pertes</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="space-y-4">
            <div className="flex items-end justify-between h-32 gap-2">
              {chartData.map((data, index) => (
                <div key={index} className="flex flex-col items-center gap-1 flex-1">
                  <div className="flex flex-col items-center justify-end h-24 w-full gap-0">
                    <div 
                      className="w-full bg-finance-primary rounded-t-sm transition-all duration-300"
                      style={{ 
                        height: `${(data.profit / maxValue) * 80}%`,
                        minHeight: '4px'
                      }}
                    />
                    <div 
                      className="w-full bg-foreground rounded-b-sm transition-all duration-300"
                      style={{ 
                        height: `${(data.loss / maxValue) * 80}%`,
                        minHeight: '4px'
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground mt-2">
                    {data.month}
                  </span>
                </div>
              ))}
            </div>

            {/* Y-axis labels */}
            <div className="flex flex-col items-start space-y-1 text-xs text-muted-foreground">
              <span>50M</span>
              <span>40M</span>
              <span>30M</span>
              <span>20M</span>
              <span>10M</span>
              <span>0M</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}