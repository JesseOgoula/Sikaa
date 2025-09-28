import { MetricCard } from "@/components/ui/metric-card";
import { TransactionItem } from "@/components/ui/transaction-item";
import { SpendingLimit } from "@/components/ui/spending-limit";
import { MyCards } from "@/components/my-cards";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Bell, User, LogOut, Settings } from "lucide-react";
import { ValidatePotentialIncomeButton } from "@/components/ui/ValidatePotentialIncomeButton";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

type Transaction = {
  id: string;
  activity: string;
  amount: number;
  type: "income" | "expense" | "potential_income";
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
  // Filtres avancés pour l'historique
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  // Recherche texte pour l'historique
  const [search, setSearch] = useState("");
  // Fonction pour valider un revenu potentiel
  const handleValidatePotentialIncome = async (transactionId: string) => {
    // Mettre à jour la transaction dans Supabase
    const { data, error } = await supabase
      .from('transactions')
      .update({ transaction_type: 'income', status: 'completed' })
      .eq('id', transactionId)
      .select();
    if (!error && data && data.length > 0) {
      // Mettre à jour le state local
      setTransactions(prev => prev.map(tx =>
        tx.id === transactionId
          ? { ...tx, type: 'income', status: 'completed' }
          : tx
      ));
    } else {
      alert("Erreur lors de la validation du revenu potentiel");
    }
  };
  // ...existing code...
  // ...existing code...
  // (après l'initialisation de transactions et avant le return)
  // Plafond de dépenses mensuel dynamique (avec sauvegarde Supabase)
  const [spendingLimit, setSpendingLimit] = useState<number | null>(null);
  const [showLimitEdit, setShowLimitEdit] = useState(false);
  const [limitInput, setLimitInput] = useState("");
  const [limitLoading, setLimitLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Charger le plafond depuis Supabase au montage
  useEffect(() => {
    const fetchLimit = async () => {
      setLimitLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user || userError) {
        setUserId(null);
        setLimitLoading(false);
        return;
      }
      setUserId(user.id);
      // On suppose une table 'user_settings' avec user_id, spending_limit
      const { data, error } = await supabase
        .from('user_settings')
        .select('spending_limit')
        .eq('user_id', user.id)
        .single();
      if (!error && data && data.spending_limit) {
        setSpendingLimit(Number(data.spending_limit));
      } else {
        setSpendingLimit(null);
      }
      setLimitLoading(false);
    };
    fetchLimit();
  }, []);

  // Sauvegarder le plafond dans Supabase
  const handleSaveLimit = async () => {
    const value = Number(limitInput);
    if (!isNaN(value) && value > 0 && userId) {
      setLimitLoading(true);
      // Upsert dans user_settings
      const { error } = await supabase
        .from('user_settings')
        .upsert({ user_id: userId, spending_limit: value }, { onConflict: 'user_id' });
      if (!error) {
        setSpendingLimit(value);
        setShowLimitEdit(false);
      } else {
        alert("Erreur lors de la sauvegarde du plafond côté serveur");
      }
      setLimitLoading(false);
    }
  };
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

  // Solde total historique (tous les revenus réels, hors revenus potentiels)
  const totalIncomeAllTime = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);


  // Helpers pour dates
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Total Earnings (revenus du mois en cours)
  const earningsThisMonth = transactions.filter(t => t.type === "income" && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear).reduce((sum, t) => sum + t.amount, 0);
  // Total Earnings mois précédent
  const earningsPrevMonth = transactions.filter(t => t.type === "income" && new Date(t.date).getMonth() === prevMonth && new Date(t.date).getFullYear() === prevMonthYear).reduce((sum, t) => sum + t.amount, 0);
  // % évolution revenus
  const earningsPercent = earningsPrevMonth === 0 ? 0 : ((earningsThisMonth - earningsPrevMonth) / earningsPrevMonth) * 100;

  // Total Spending (dépenses du mois en cours)
  const spendingThisMonth = transactions.filter(t => t.type === "expense" && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear).reduce((sum, t) => sum + t.amount, 0);
  // Total Spending mois précédent
  const spendingPrevMonth = transactions.filter(t => t.type === "expense" && new Date(t.date).getMonth() === prevMonth && new Date(t.date).getFullYear() === prevMonthYear).reduce((sum, t) => sum + t.amount, 0);
  // % évolution dépenses
  const spendingPercent = spendingPrevMonth === 0 ? 0 : ((spendingThisMonth - spendingPrevMonth) / spendingPrevMonth) * 100;

  // Total Income (solde disponible = revenus - dépenses du mois en cours)
  const availableBalance = earningsThisMonth - spendingThisMonth;

  // Total Revenue (revenus potentiels du mois en cours)
  const potentialRevenue = transactions.filter(t => t.type === "potential_income" && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear).reduce((sum, t) => sum + t.amount, 0);

  // Génère les données du graphique dynamiquement à partir des transactions (6 derniers mois)
  const months = ["Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
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

  // Handler pour la recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
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
      status: form.type === "potential_income" ? "pending" : "completed",
      category: form.category,
      // transaction_date et created_at sont gérés par défaut SQL
    };
    console.log("Payload envoyé à Supabase:", newTx);
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
          type: inserted.transaction_type === 'income' ? 'income' : (inserted.transaction_type === 'potential_income' ? 'potential_income' : 'expense'),
          status: inserted.status === 'completed' || inserted.status === 'pending' || inserted.status === 'in-progress' ? inserted.status : 'completed',
          date: inserted.transaction_date || new Date().toISOString(),
          icon: inserted.transaction_type === "income" ? "shopping" : (inserted.transaction_type === "potential_income" ? "💡" : "travel"),
          category: inserted.category,
        },
        ...transactions,
      ]);
      setShowAddForm(false);
      setForm({ activity: "", amount: "", type: "income", category: categories[0] });
    } else {
      console.error("Erreur Supabase lors de l'insertion:", error);
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
                    <h2 className="text-4xl font-bold text-foreground">{totalIncomeAllTime.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} FCFA</h2>
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
                        <option value="potential_income">Revenu potentiel</option>
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
              <CardContent className="p-0">
                <div className="rounded-2xl shadow-xl p-7 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex flex-col items-center">
                  <div className="flex items-center justify-between w-full mb-6">
                    <h3 className="text-lg font-bold text-orange-700 tracking-tight">Note de santé financière</h3>
                    <span className="text-xs text-muted-foreground font-medium">Sur 10</span>
                  </div>
                  {(() => {
                    const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
                    const totalSpending = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
                    const totalPotential = transactions.filter(t => t.type === "potential_income").reduce((sum, t) => sum + t.amount, 0);
                    const available = totalIncome - totalSpending;
                    const ratio = totalIncome > 0 ? totalSpending / totalIncome : 1;
                    let score = 10;
                    let comments: string[] = [];
                    if (totalIncome === 0) {
                      score = 2;
                      comments.push("Aucun revenu enregistré. Ajoutez vos revenus pour une meilleure analyse.");
                    } else {
                      if (ratio < 0.5) {
                        score -= 0;
                        comments.push("Excellent contrôle des dépenses.");
                      } else if (ratio < 0.7) {
                        score -= 1;
                        comments.push("Bonne gestion, continuez ainsi.");
                      } else if (ratio < 0.9) {
                        score -= 2;
                        comments.push("Attention à la hausse des dépenses.");
                      } else {
                        score -= 4;
                        comments.push("Dépenses trop élevées par rapport aux revenus.");
                      }
                      if (available < 0) {
                        score -= 2;
                        comments.push("Solde négatif : vous dépensez plus que vos revenus.");
                      } else if (available < totalIncome * 0.1) {
                        score -= 1;
                        comments.push("Solde faible, attention à vos réserves.");
                      } else {
                        comments.push("Solde sain, continuez à épargner.");
                      }
                      if (totalPotential > totalIncome * 0.3) {
                        score -= 1;
                        comments.push("Beaucoup de revenus potentiels non validés.");
                      }
                      if (spendingLimit && spendingThisMonth > spendingLimit) {
                        score -= 1;
                        comments.push("Vous avez dépassé votre plafond de dépenses mensuel.");
                      }
                    }
                    if (score < 1) score = 1;
                    if (score > 10) score = 10;
                    // Couleur dynamique
                    let accent = score >= 8 ? '#16a34a' : score >= 6 ? '#eab308' : '#dc2626';
                    // Ticks style
                    const TICKS = 50;
                    const percent = score / 10;
                    const activeTicks = Math.round(TICKS * percent);
                    const ticks = Array.from({ length: TICKS }, (_, i) => i);
                    return (
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative w-40 h-40 flex items-center justify-center">
                          <svg width="160" height="160" viewBox="0 0 160 160" className="block">
                            {ticks.map(i => {
                              const angle = (i / TICKS) * 2 * Math.PI - Math.PI / 2;
                              const r1 = 72, r2 = 78;
                              const x1 = 80 + r1 * Math.cos(angle);
                              const y1 = 80 + r1 * Math.sin(angle);
                              const x2 = 80 + r2 * Math.cos(angle);
                              const y2 = 80 + r2 * Math.sin(angle);
                              return (
                                <line
                                  key={i}
                                  x1={x1}
                                  y1={y1}
                                  x2={x2}
                                  y2={y2}
                                  stroke={i < activeTicks ? accent : '#e5e7eb'}
                                  strokeWidth={3}
                                  strokeLinecap="round"
                                />
                              );
                            })}
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">{score}</span>
                            <span className="mt-1 text-base font-medium text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1 shadow-sm">{score} / 10</span>
                          </div>
                        </div>
                        <div className="w-full mt-6">
                          <div className="flex items-center gap-2 mb-2">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#a3a3a3" strokeWidth="2"/><path d="M12 8v4" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="16" r="1" fill="#a3a3a3"/></svg>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Commentaires</span>
                          </div>
                          <ul className="space-y-2 w-full bg-white/90 dark:bg-gray-900/80 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-800">
                            {comments.map((c, i) => (
                              <li key={i} className="text-sm text-gray-700 dark:text-gray-200 flex items-start gap-2 leading-snug"><span className="mt-0.5">•</span> {c}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Spending Limit */}
            <Card className="bg-white dark:bg-card border-0 shadow-lg rounded-2xl">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(120deg, #fff7ed 60%, #fbbf24 120%)' }}>
                  <div className="flex items-center justify-between px-6 pt-6 pb-2">
                    <div>
                      <h3 className="text-lg font-bold text-orange-700 drop-shadow-sm">Plafond de dépenses mensuel</h3>
                    </div>
                    <button
                      className="p-2 rounded-full hover:bg-orange-200/60 transition disabled:opacity-50"
                      title="Paramétrer le plafond"
                      onClick={() => { setShowLimitEdit(true); setLimitInput(spendingLimit ? spendingLimit.toString() : ""); }}
                      disabled={limitLoading}
                    >
                      <Settings className="w-5 h-5 text-orange-400" />
                    </button>
                  </div>
                  <div className="px-6 pb-6">
                    {limitLoading ? (
                      <div className="py-8 text-center text-muted-foreground">Chargement...</div>
                    ) : showLimitEdit ? (
                      <div className="flex flex-col gap-3 bg-white/80 rounded-xl p-4 mt-2 shadow">
                        <label className="text-sm text-muted-foreground font-semibold">Définir le plafond mensuel (FCFA)</label>
                        <input
                          type="number"
                          min="1"
                          className="rounded border p-2 focus:ring-2 focus:ring-orange-400"
                          value={limitInput}
                          onChange={e => setLimitInput(e.target.value)}
                          placeholder="Ex: 5000"
                          disabled={limitLoading}
                        />
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" type="button" onClick={() => setShowLimitEdit(false)} disabled={limitLoading}>Annuler</Button>
                          <Button className="bg-orange-500 text-white" type="button" onClick={handleSaveLimit} disabled={limitLoading}>Enregistrer</Button>
                        </div>
                      </div>
                    ) : spendingLimit ? (
                      <div className="space-y-4">
                        {/* Barre de progression circulaire + badge */}
                        <div className="flex items-center gap-4 mt-2">
                          <div className="relative w-16 h-16">
                            <svg className="absolute top-0 left-0" width="64" height="64">
                              <circle cx="32" cy="32" r="28" fill="#fff7ed" />
                              <circle
                                cx="32" cy="32" r="28"
                                fill="none"
                                stroke="#fb923c"
                                strokeWidth="6"
                                strokeDasharray={2 * Math.PI * 28}
                                strokeDashoffset={2 * Math.PI * 28 * (1 - Math.min(1, spendingThisMonth / spendingLimit))}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(.4,2,.6,1)' }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-lg font-bold text-orange-600">{Math.min(100, Math.round((spendingThisMonth / spendingLimit) * 100))}%</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-orange-600">{spendingThisMonth.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} FCFA</span>
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${spendingThisMonth > spendingLimit ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                                {spendingThisMonth > spendingLimit ? 'Dépassé' : 'OK'}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">dépensé sur <span className="font-semibold text-orange-700">{spendingLimit.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} FCFA</span></p>
                          </div>
                        </div>
                        {/* Barre horizontale fine pour accessibilité */}
                        <div className="w-full bg-orange-100 rounded-full h-2 mt-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(100, Math.round((spendingThisMonth / spendingLimit) * 100))}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <span className="text-orange-300 text-4xl mb-2 animate-pulse"><Settings className="inline w-8 h-8" /></span>
                        <p className="text-center text-muted-foreground font-medium">Vous n'avez pas encore défini de plafond de dépenses mensuelles.<br/>Cliquez sur <span className='inline-block align-middle'><Settings className='inline w-4 h-4' /></span> pour le paramétrer.</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Column */}
          <div className="col-span-5 space-y-6">
            {/* Top Row - Earnings and Spending */}
            <div className="grid grid-cols-2 gap-4">
              {/* Total Earnings */}
              <Card className="bg-orange-500 text-white border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80">Revenus du mois</span>
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{earningsThisMonth.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} FCFA</div>
                  <div className="text-white/80 text-sm">{earningsPercent >= 0 ? '+' : ''}{earningsPercent.toFixed(0)}% Ce mois</div>
                </CardContent>
              </Card>
              {/* Total Spending */}
              <Card className="bg-white dark:bg-card border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Dépenses du mois</span>
                    <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                      <ArrowDownLeft className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{spendingThisMonth.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} FCFA</div>
                  <div className="text-red-500 text-sm">{spendingPercent >= 0 ? '+' : ''}{spendingPercent.toFixed(0)}% Ce mois</div>
                </CardContent>
              </Card>
            </div>

            {/* Second Row - Income and Revenue */}
            <div className="grid grid-cols-2 gap-4">
              {/* Total Income (solde disponible) */}
              <Card className="bg-white dark:bg-card border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Solde disponible</span>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{availableBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} FCFA</div>
                  <div className="text-green-500 text-sm">Montant restant après dépenses</div>
                </CardContent>
              </Card>
              {/* Total Revenue (revenus potentiels) */}
              <Card className="bg-white dark:bg-card border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Revenus potentiels</span>
                    <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                      $
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{potentialRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} FCFA</div>
                  <div className="text-green-500 text-sm">Total des revenus attendus</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card className="bg-white dark:bg-card border-0 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold tracking-tight">Activités récentes</h3>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher"
                        className="pl-10 w-44 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                        value={search}
                        onChange={handleSearchChange}
                      />
                    </div>
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg border border-gray-200 dark:border-gray-700 text-xs px-3 py-1"
                        onClick={() => setShowFilters(v => !v)}
                        type="button"
                      >
                        <Filter className="h-4 w-4 mr-1" />
                        Filtrer
                      </Button>
                      {showFilters && (
                        <div className="absolute right-0 mt-2 z-20 bg-white dark:bg-gray-900 border border-border rounded-xl shadow-lg p-4 w-64 flex flex-col gap-3 animate-fade-in">
                          <div>
                            <label className="block text-xs font-semibold mb-1">Type</label>
                            <select className="w-full rounded p-1 border" value={filterType} onChange={e => setFilterType(e.target.value)}>
                              <option value="">Tous</option>
                              <option value="income">Revenu</option>
                              <option value="expense">Dépense</option>
                              <option value="potential_income">Revenu potentiel</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">Statut</label>
                            <select className="w-full rounded p-1 border" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                              <option value="">Tous</option>
                              <option value="completed">Complété</option>
                              <option value="pending">En attente</option>
                              <option value="in-progress">En cours</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">Catégorie</label>
                            <select className="w-full rounded p-1 border" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                              <option value="">Toutes</option>
                              {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex gap-2 mt-2 justify-end">
                            <Button size="sm" variant="outline" onClick={() => { setFilterType(""); setFilterStatus(""); setFilterCategory(""); }}>Réinitialiser</Button>
                            <Button size="sm" className="bg-orange-500 text-white" onClick={() => setShowFilters(false)}>OK</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200 rounded-xl overflow-hidden bg-white dark:bg-background border border-gray-200 dark:border-gray-800" style={{ maxHeight: 380, overflowY: 'auto' }}>
                  {transactions.length === 0 && (
                    <div className="py-8 text-center text-muted-foreground text-sm">Aucune activité récente</div>
                  )}
                  {(() => {
                    const filteredTransactions = transactions.filter(tx => {
                      const q = search.trim().toLowerCase();
                      let match = true;
                      if (q) {
                        match = (
                          tx.activity.toLowerCase().includes(q) ||
                          tx.category.toLowerCase().includes(q) ||
                          String(tx.amount).includes(q)
                        );
                      }
                      if (filterType && tx.type !== filterType) match = false;
                      if (filterStatus && tx.status !== filterStatus) match = false;
                      if (filterCategory && tx.category !== filterCategory) match = false;
                      return match;
                    });
                    if (filteredTransactions.length === 0) {
                      return <div className="py-8 text-center text-muted-foreground text-sm">Aucune activité récente</div>;
                    }
                    // Afficher seulement les 5 dernières transactions (plus récentes en haut)
                    return filteredTransactions.slice(0, 5).map((transaction, index) => {
                      // Palette projet : orange-500, bleu-600, gris-700, gris-200, minimalisme
                      let amountColor = 'text-gray-900';
                      if (transaction.type === 'income') amountColor = 'text-orange-600 dark:text-orange-400';
                      if (transaction.type === 'expense') amountColor = 'text-gray-500 dark:text-gray-400';
                      if (transaction.type === 'potential_income') amountColor = 'text-blue-600 dark:text-blue-300';

                      // Icônes minimalistes (emoji ou SVG unicode simples)
                      let icon = '●';
                      if (transaction.type === 'income') icon = '↑';
                      else if (transaction.type === 'expense') icon = '↓';
                      else if (transaction.type === 'potential_income') icon = '…';

                      return (
                        <div
                          key={transaction.id}
                          className="group flex items-center justify-between px-3 py-4 bg-white dark:bg-card hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors cursor-pointer border-l-4 border-transparent hover:border-orange-500"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center text-lg font-bold text-orange-500 dark:text-orange-400">
                              {icon}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate max-w-[180px] text-base">{transaction.activity}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleString()}</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-normal bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                  {transaction.category}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 min-w-[120px]">
                            <span className={`font-semibold text-base ${amountColor}`}>{Number(transaction.amount).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} FCFA</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {/* Badge statut (Complété / En attente) */}
                              {(transaction.status === 'completed' || transaction.status === 'pending') && (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-normal ${
                                  transaction.status === 'completed'
                                    ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                    : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}>
                                  {transaction.status === 'completed' ? 'Complété' : 'En attente'}
                                </span>
                              )}
                              {/* Badge type de transaction */}
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-normal ${
                                transaction.type === 'income'
                                  ? 'bg-orange-50 text-orange-600 dark:bg-orange-900 dark:text-orange-200'
                                  : transaction.type === 'expense'
                                    ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                    : 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                              }`}>
                                {transaction.type === 'income'
                                  ? 'Revenu'
                                  : transaction.type === 'expense'
                                    ? 'Dépense'
                                    : 'Revenu potentiel'}
                              </span>
                            </div>
                            {transaction.type === 'potential_income' && (
                              <ValidatePotentialIncomeButton onValidate={() => handleValidatePotentialIncome(transaction.id)} />
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="col-span-3 space-y-6">
            {/* Total Income Chart */}
            <div className="bg-white dark:bg-card rounded-[2rem] shadow-xl p-8 w-full max-w-full border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                <div>
                  <h3 className="text-2xl font-extrabold text-blue-700 dark:text-cyan-300 tracking-tight mb-1">Revenus totaux</h3>
                  <p className="text-base text-gray-500 dark:text-gray-300">Évolution sur les 6 derniers mois</p>
                </div>
              </div>
              <div className="h-64 w-full flex items-center justify-center">
                <Line
                  data={{
                    labels: chartData.map(d => d.month),
                    datasets: [
                      {
                        label: 'Revenus',
                        data: chartData.map(d => d.profit),
                        borderColor: '#2563eb',
                        backgroundColor: 'transparent',
                        pointRadius: 3,
                        pointBackgroundColor: '#2563eb',
                        borderWidth: 3.5,
                        tension: 0.5,
                        fill: false,
                      },
                      {
                        label: 'Dépenses',
                        data: chartData.map(d => d.loss),
                        borderColor: '#06b6d4',
                        backgroundColor: 'transparent',
                        pointRadius: 3,
                        pointBackgroundColor: '#06b6d4',
                        borderWidth: 3.5,
                        tension: 0.5,
                        fill: false,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                          color: '#2563eb',
                          font: { size: 16, weight: 'bold', family: 'inherit' },
                          boxWidth: 18,
                          boxHeight: 3,
                          usePointStyle: false,
                          padding: 24,
                        },
                      },
                      title: { display: false },
                      tooltip: { enabled: true },
                    },
                    scales: {
                      x: {
                        grid: { display: false },
                        ticks: { color: '#64748b', font: { size: 15, weight: 'bold' }, padding: 8 },
                      },
                      y: {
                        grid: { color: '#e0e7ef' },
                        ticks: { color: '#64748b', font: { size: 15, weight: 'bold' }, stepSize: 100, padding: 8 },
                        beginAtZero: true,
                        min: 0,
                      },
                    },
                    layout: { padding: { top: 20, right: 20, left: 20, bottom: 20 } },
                    animation: { duration: 1300, easing: 'easeOutQuart' },
                  }}
                />
              </div>
            </div>

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