import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WalletItemProps {
  currency: string;
  flag: string;
  amount: string;
  subtitle: string;
  status?: string;
}

function WalletItem({ currency, flag, amount, subtitle, status }: WalletItemProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-sm">
          {flag}
        </div>
        <span className="font-medium text-foreground">{currency}</span>
      </div>
      <div className="text-right">
        <p className="font-semibold text-foreground">{amount}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
        {status && (
          <p className="text-xs text-finance-success">{status}</p>
        )}
      </div>
    </div>
  );
}

export function WalletSection() {
  return (
    <Card className="shadow-card border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Portefeuilles</CardTitle>
          <CardTitle className="text-sm font-medium text-muted-foreground">Total 6 portefeuilles</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <WalletItem
          currency="FCFA"
          flag="🇫🇷"
          amount="27 678 000 FCFA"
          subtitle="Limite: 50M FCFA/mois"
          status="Actif"
        />
        <WalletItem
          currency="FCFA"
          flag="🇪🇺"
          amount="18 345 000 FCFA"
          subtitle="Limite: 40M FCFA/mois"
          status="Actif"
        />
        <WalletItem
          currency="FCFA"
          flag="🇬🇧"
          amount="15 000 000 FCFA"
          subtitle="Limite: 75M FCFA/mois"
          status="Inactif"
        />
      </CardContent>
    </Card>
  );
}