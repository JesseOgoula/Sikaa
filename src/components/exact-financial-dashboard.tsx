import { MetricCard } from "@/components/ui/metric-card";
import { TransactionItem } from "@/components/ui/transaction-item";
import { SpendingLimit } from "@/components/ui/spending-limit";
import { WalletSection } from "@/components/wallet-section";
import { MyCards } from "@/components/my-cards";
import { TotalIncomeCard } from "@/components/total-income-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowUpRight, ArrowDownLeft, MoreHorizontal } from "lucide-react";

const transactions = [
  {
    id: "FAC_000076",
    activity: "Achat d'application mobile",
    price: "25 500 FCFA",
    status: "completed" as const,
    date: "17 Avr, 2026 15:45",
    icon: "mobile" as const,
  },
  {
    id: "FAC_000075",
    activity: "Réservation d'hôtel",
    price: "32 750 FCFA",
    status: "pending" as const,
    date: "15 Avr, 2026 11:30",
    icon: "hotel" as const,
  },
  {
    id: "FAC_000074",
    activity: "Billet d'avion",
    price: "40 200 FCFA",
    status: "completed" as const,
    date: "15 Avr, 2026 12:00",
    icon: "travel" as const,
  },
  {
    id: "FAC_000073",
    activity: "Achat d'épicerie",
    price: "50 200 FCFA",
    status: "in-progress" as const,
    date: "14 Avr, 2026 21:15",
    icon: "shopping" as const,
  },
  {
    id: "FAC_000072",
    activity: "Licence logicielle",
    price: "15 900 FCFA",
    status: "completed" as const,
    date: "10 Avr, 2026 06:00",
    icon: "software" as const,
  },
];

export function ExactFinancialDashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Column */}
          <div className="col-span-4 space-y-6">
            {/* Total Balance Card */}
            <Card className="shadow-card border-0">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">Solde Total</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      🇫🇷 FCFA
                      <MoreHorizontal className="h-3 w-3 ml-1" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">689 372 000 FCFA</h2>
                    <div className="flex items-center gap-1 mt-2">
                      <ArrowUpRight className="h-4 w-4 text-finance-success" />
                      <span className="text-sm font-medium text-finance-success">+5%</span>
                      <span className="text-sm text-muted-foreground">par rapport au mois dernier</span>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button className="bg-foreground text-white hover:bg-foreground/90 flex-1">
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Transférer
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <ArrowDownLeft className="h-4 w-4 mr-2" />
                      Demander
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallets */}
            <WalletSection />

            {/* Monthly Spending Limit */}
            <SpendingLimit spent={1400} limit={5500} />

            {/* My Cards */}
            <MyCards />
          </div>

          {/* Center Column */}
          <div className="col-span-5 space-y-6">
            {/* Top Row - Earnings and Spending */}
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                title="Total des Gains"
                value="950 000 FCFA"
                change={{ percentage: "+7%", trend: "up", period: "Ce mois" }}
                variant="primary"
              />
              <MetricCard
                title="Total des Dépenses"
                value="700 000 FCFA"
                change={{ percentage: "+5%", trend: "down", period: "Ce mois" }}
                variant="default"
              />
            </div>

            {/* Second Row - Income and Revenue */}
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                title="Total des Revenus"
                value="1 050 000 FCFA"
                change={{ percentage: "+8%", trend: "up", period: "Ce mois" }}
                variant="default"
              />
              <MetricCard
                title="Chiffre d'Affaires"
                value="850 000 FCFA"
                change={{ percentage: "-4%", trend: "down", period: "Ce mois" }}
                variant="default"
              />
            </div>

            {/* Recent Activities */}
            <Card className="shadow-card border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Activités Récentes</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher"
                        className="pl-10 w-48"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtrer
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground pt-4">
                  <span>ID Commande</span>
                  <span>Activité</span>
                  <span>Prix</span>
                  <span>Statut</span>
                  <span>Date</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {transactions.map((transaction, index) => (
                    <TransactionItem
                      key={`${transaction.id}-${index}`}
                      {...transaction}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="col-span-3">
            <TotalIncomeCard />
          </div>

        </div>
      </div>
    </div>
  );
}