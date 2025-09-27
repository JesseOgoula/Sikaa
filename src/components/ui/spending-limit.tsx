import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SpendingLimitProps {
  spent: number;
  limit: number;
}

export function SpendingLimit({ spent, limit }: SpendingLimitProps) {
  const percentage = (spent / limit) * 100;
  const remaining = limit - spent;

  return (
    <Card className="shadow-card border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Limite de Dépenses Mensuelle</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress 
          value={percentage} 
          className="h-3"
        />
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold text-foreground">
              {spent.toLocaleString()} FCFA
            </p>
            <p className="text-sm text-muted-foreground">dépensé sur</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-muted-foreground">
              {limit.toLocaleString()} FCFA
            </p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {remaining.toLocaleString()} FCFA restant ce mois
        </div>
      </CardContent>
    </Card>
  );
}