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
import React, { useState, useEffect } from "react";

type Transaction = {
  id: string;
  activity: string;
  amount: number;
  type: "income" | "expense";
  status: "completed" | "pending" | "in-progress";
  date: string;
  icon: string;
  category: string;
};


const initialTransactions: Transaction[] = [
  {
    id: "FAC_000076",
    activity: "Achat d'application mobile",
    amount: 25500,
    type: "expense",
    status: "completed",
    date: "2026-04-17T15:45",
    icon: "mobile",
    category: "Autre",
  },
  {
    id: "FAC_000075",
    activity: "Réservation d'hôtel",
    amount: 32750,
    type: "expense",
    status: "pending",
    date: "2026-04-15T11:30",
    icon: "hotel",
    category: "Transport",
  },
  {
    id: "FAC_000074",
    activity: "Billet d'avion",
    amount: 40200,
    type: "expense",
    status: "completed",
    date: "2026-04-15T12:00",
    icon: "travel",
    category: "Transport",
  },
  {
    id: "FAC_000073",
    activity: "Achat d'épicerie",
    amount: 50200,
    type: "expense",
    status: "in-progress",
    date: "2026-04-14T21:15",
    icon: "shopping",
    category: "Alimentation",
  },
  {
    id: "FAC_000072",
    activity: "Licence logicielle",
    amount: 15900,
    type: "expense",
    status: "completed",
    date: "2026-04-10T06:00",
    icon: "software",
    category: "Autre",
  },
];

export function ModernFinancialDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const defaultCategories = [
    "Salaire",
    "Alimentation",
    "Transport",
    "Divertissement",
    "Santé",
    "Logement",
    "Autre"
  ];
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [form, setForm] = useState({
    activity: "",
    amount: "",
    type: "income",
    category: defaultCategories[0],
  });
  // Charger les catégories et transactions depuis Supabase au montage
  useEffect(() => {
    // Charger les catégories
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .order('name', { ascending: true });
      if (error) {
        setCategories(defaultCategories);
      } else if (data && data.length > 0) {
        setCategories(data.map((c: { name: string }) => c.name));
      } else {
        setCategories(defaultCategories);
      }
    };
    fetchCategories();

    // Charger les transactions de l'utilisateur connecté
    const fetchTransactions = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();
      if (!user || userError) {
        setTransactions([]);
        return;
      }
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false });
      if (!error && data) {
        setTransactions(
          data.map((tx: any) => ({
            id: tx.id,
            activity: tx.activity,
            amount: Number(tx.amount),
            type: tx.transaction_type === 'income' ? 'income' : 'expense',
            status: tx.status === 'completed' || tx.status === 'pending' || tx.status === 'in-progress' ? tx.status : 'completed',
            date: tx.transaction_date || tx.created_at || new Date().toISOString(),
            icon: tx.transaction_type === 'income' ? 'shopping' : 'travel',
            category: tx.category,
          }))
        );
      } else {
        setTransactions([]);
      }
    };
    fetchTransactions();
  }, []);
  const navigate = useNavigate();

  // Solde total = somme de toutes les entrées (income)
  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);

  // Génère les données du graphique dynamiquement à partir des transactions (6 derniers mois)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthLabel = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    const profit = transactions.filter(t => t.type === "income" && new Date(t.date).getMonth() === d.getMonth() && new Date(t.date).getFullYear() === d.getFullYear()).reduce((sum, t) => sum + t.amount, 0);
    const loss = transactions.filter(t => t.type === "expense" && new Date(t.date).getMonth() === d.getMonth() && new Date(t.date).getFullYear() === d.getFullYear()).reduce((sum, t) => sum + t.amount, 0);
    return { month: monthLabel, profit, loss };
  });
  const maxValue = Math.max(...chartData.flatMap(d => [d.profit, d.loss, 1]));

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleAddTransaction = () => setShowAddForm(true);
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value);
  };
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory)) {
      // Récupérer l'utilisateur connecté
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();
      if (!user || userError) {
        alert("Utilisateur non connecté. Veuillez vous reconnecter.");
        return;
      }
      // Ajout en base avec user_id
      const { error } = await supabase.from('categories').insert({ name: newCategory, user_id: user.id });
      if (!error) {
        // Ajoute la nouvelle catégorie à la suite des catégories par défaut
        setCategories([...defaultCategories, ...categories.filter(cat => !defaultCategories.includes(cat)), newCategory]);
        setForm({ ...form, category: newCategory });
        setNewCategory("");
      } else {
        alert("Erreur lors de l'ajout de la catégorie");
      }
    }
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Récupérer l'utilisateur connecté
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();
    if (!user || userError) {
      alert("Utilisateur non connecté. Veuillez vous reconnecter.");
      return;
    }
    // Générer un order_id unique (ex: timestamp + random)
    const order_id = `ORD_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    // Préparer la transaction à insérer
    const newTx = {
      user_id: user.id,
      order_id,
      activity: form.activity,
      amount: Number(form.amount),
      transaction_type: form.type,
      status: "completed",
      category: form.category,
      // transaction_date et created_at sont gérés par défaut SQL
    };
    // Insérer dans Supabase
    const { data, error } = await supabase
      .from('transactions')
      .insert([newTx])
      .select();
    if (!error && data && data.length > 0) {
      const inserted = data[0];
      setTransactions([
        {
          id: inserted.id,
          activity: inserted.activity,
          amount: Number(inserted.amount),
          type: inserted.transaction_type === 'income' ? 'income' : 'expense',
          status: inserted.status === 'completed' || inserted.status === 'pending' || inserted.status === 'in-progress' ? inserted.status : 'completed',
          date: inserted.transaction_date || new Date().toISOString(),
          icon: inserted.transaction_type === "income" ? "shopping" : "travel",
          category: inserted.category,
        },
        ...transactions,
      ]);
      setShowAddForm(false);
      setForm({ activity: "", amount: "", type: "income", category: categories[0] });
    } else {
      alert("Erreur lors de l'ajout de la transaction");
    }
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
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">🇫🇷 FCFA</div>
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-foreground">{totalIncome.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} FCFA</h2>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white flex-1 rounded-xl" onClick={handleAddTransaction}>
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                  {showAddForm && (
                    <form className="mt-4 space-y-3 bg-gray-50 p-4 rounded-xl border" onSubmit={handleFormSubmit}>
                      <input name="activity" value={form.activity} onChange={handleFormChange} placeholder="Description" className="w-full rounded p-2 border focus:ring-2 focus:ring-orange-400" required />
                      <input name="amount" value={form.amount} onChange={handleFormChange} placeholder="Montant" type="number" min="0" className="w-full rounded p-2 border focus:ring-2 focus:ring-orange-400" required />
                      <select name="type" value={form.type} onChange={handleFormChange} className="w-full rounded p-2 border focus:ring-2 focus:ring-orange-400 bg-white">
                        <option value="income">Revenu</option>
                        <option value="expense">Dépense</option>
                      </select>
                      <div className="relative">
                        <select name="category" value={form.category} onChange={handleFormChange} className="w-full rounded p-2 border focus:ring-2 focus:ring-orange-400 bg-white appearance-none pr-10">
                          {categories.map((cat, idx) => (
                            <option key={cat + idx} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <input type="text" value={newCategory} onChange={handleNewCategoryChange} placeholder="Nouvelle catégorie" className="flex-1 rounded p-2 border focus:ring-2 focus:ring-orange-400" />
                        <Button type="button" className="bg-orange-100 text-orange-600 hover:bg-orange-200 px-3 py-1 rounded" onClick={handleAddCategory}>Ajouter</Button>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Annuler</Button>
                        <Button type="submit" className="bg-orange-500 text-white">Ajouter</Button>
                      </div>
                    </form>
                  )}
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
                    <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 dark:text-orange-400">{transaction.icon === 'shopping' ? '🛒' : transaction.icon === 'travel' ? '✈️' : transaction.icon === 'mobile' ? '📱' : transaction.icon === 'hotel' ? '🏨' : transaction.icon === 'software' ? '💻' : '💰'}</span>
                        </div>
                        <div>
                          <p className="font-medium">{transaction.activity}</p>
                          <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{Number(transaction.amount).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} FCFA</p>
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