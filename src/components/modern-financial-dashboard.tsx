import { MetricCard } from "@/components/ui/metric-card";
import { TransactionItem } from "@/components/ui/transaction-item";
import { SpendingLimit } from "@/components/ui/spending-limit";
import { MyCards } from "@/components/my-cards";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Bell, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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

export function ModernFinancialDashboard() {
  const maxValue = Math.max(...chartData.flatMap(d => [d.profit, d.loss]));
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Header */}
      <div className="bg-white dark:bg-card border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tableau de Bord Financier</h1>
            <p className="text-muted-foreground">Gérez vos finances en toute simplicité</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="h-6 w-6 text-muted-foreground" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
              JD
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-200 transition"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Column */}
          <div className="col-span-4 space-y-6">
            {/* Total Balance Card */}
            <Card className="bg-white dark:bg-card border-0 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">Solde total</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      🇫🇷 FCFA
                    </div>
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-foreground">56023 FCFA</h2>
                    <div className="flex items-center gap-1 mt-2">
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">4,3%</span>
                      <span className="text-sm text-muted-foreground">par rapport au mois dernier</span>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white flex-1 rounded-xl">
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Transférer
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-xl">
                      <ArrowDownLeft className="h-4 w-4 mr-2" />
                      Demander
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallets */}
            <Card className="bg-white dark:bg-card border-0 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Portefeuilles</h3>
                  <span className="text-sm text-muted-foreground">Total 3 portefeuilles</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        🇫🇷
                      </div>
                      <span className="font-medium">FCFA</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">22 678 FCFA</p>
                      <p className="text-xs text-green-500">Actif</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        🇪🇺
                      </div>
                      <span className="font-medium">FCFA</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">18 345 FCFA</p>
                      <p className="text-xs text-green-500">Actif</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        🇬🇧
                      </div>
                      <span className="font-medium">FCFA</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">15 000 FCFA</p>
                      <p className="text-xs text-gray-500">Inactif</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Spending Limit */}
            <Card className="bg-white dark:bg-card border-0 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Plafond de dépenses mensuel</h3>
                <div className="space-y-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-orange-500 h-3 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-2xl font-bold text-orange-500">1400 FCFA</p>
                      <p className="text-sm text-muted-foreground">dépensé sur</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">5500 FCFA</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Column */}
          <div className="col-span-5 space-y-6">
            {/* Top Row - Earnings and Spending */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-orange-500 text-white border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80">Total Earnings</span>
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                  <div className="text-3xl font-bold mb-1">950 FCFA</div>
                  <div className="text-white/80 text-sm">+7% Ce mois</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-card border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Total Spending</span>
                    <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                      <ArrowDownLeft className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">1646 FCFA</div>
                  <div className="text-red-500 text-sm">-5% Ce mois</div>
                </CardContent>
              </Card>
            </div>

            {/* Second Row - Income and Revenue */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white dark:bg-card border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Total Income</span>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="text-3xl font-bold mb-1">950 FCFA</div>
                  <div className="text-green-500 text-sm">+8% Ce mois</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-card border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Total Revenue</span>
                    <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                      $
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">808 FCFA</div>
                  <div className="text-green-500 text-sm">+4% Ce mois</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card className="bg-white dark:bg-card border-0 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Activités Récentes</h3>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher"
                        className="pl-10 w-48 rounded-xl"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtrer
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {transactions.map((transaction, index) => (
                    <div key={`${transaction.id}-${index}`} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 dark:text-orange-400">📱</span>
                        </div>
                        <div>
                          <p className="font-medium">{transaction.activity}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{transaction.price}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="col-span-3 space-y-6">
            {/* Total Income Chart */}
            <Card className="bg-white dark:bg-card border-0 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Total Income</h3>
                <p className="text-sm text-muted-foreground mb-6">Visualisez vos revenus sur une période donnée</p>
                
                {/* Legend */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-sm font-medium">Bénéfices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-foreground"></div>
                    <span className="text-sm font-medium">Pertes</span>
                  </div>
                </div>

                {/* Chart */}
                <div className="space-y-4">
                  <div className="flex items-end justify-between h-32 gap-2">
                    {chartData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center gap-1 flex-1">
                        <div className="flex flex-col items-center justify-end h-24 w-full gap-0">
                          <div 
                            className="w-full bg-orange-500 rounded-t-sm transition-all duration-300"
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
                  
                  {/* Progress bar */}
                  <div className="flex justify-between text-xs text-muted-foreground mt-4">
                    <span>0%</span>
                    <span>20%</span>
                    <span>40%</span>
                    <span>60%</span>
                    <span>80%</span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* My Cards */}
            <Card className="bg-white dark:bg-card border-0 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">My Cards</h3>
                  <Button variant="ghost" size="sm" className="text-orange-500">
                    + Add new
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-gray-900 to-black text-white p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs opacity-70">Active</span>
                      <div className="flex gap-1">
                        <div className="w-6 h-6 bg-red-500 rounded-full opacity-80"></div>
                        <div className="w-6 h-6 bg-yellow-400 rounded-full opacity-80 -ml-2"></div>
                      </div>
                    </div>
                    <p className="text-sm opacity-70 mb-1">Numéro de carte</p>
                    <p className="font-mono text-sm mb-3">•••• •••• •••• 6782</p>
                    <div className="flex justify-between text-xs">
                      <div>
                        <p className="opacity-70">EXP</p>
                        <p>09/28</p>
                      </div>
                      <div>
                        <p className="opacity-70">CVV</p>
                        <p>611</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}