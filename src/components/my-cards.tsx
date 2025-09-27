import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CreditCardProps {
  variant: "dark" | "orange";
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  status: string;
}

function CreditCard({ variant, cardNumber, expiryDate, cvv, status }: CreditCardProps) {
  const cardStyles = {
    dark: "bg-gradient-to-br from-gray-900 to-black text-white",
    orange: "bg-gradient-to-br from-finance-primary to-finance-primary-light text-white"
  };

  return (
    <div className={`relative p-4 rounded-xl ${cardStyles[variant]} min-h-[120px] flex flex-col justify-between`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 bg-white/20 rounded flex items-center justify-center">
            <div className="w-4 h-3 bg-white/60 rounded-sm"></div>
          </div>
          <span className="text-xs font-medium opacity-80">{status}</span>
        </div>
        {variant === "dark" && (
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-red-500 rounded-full opacity-80"></div>
            <div className="w-6 h-6 bg-yellow-400 rounded-full opacity-80 -ml-2"></div>
          </div>
        )}
        {variant === "orange" && (
          <div className="text-2xl">💎</div>
        )}
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-xs opacity-60">Numéro de carte</p>
          <p className="font-mono text-sm">{cardNumber}</p>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="text-xs opacity-60">EXP</p>
            <p className="text-xs font-medium">{expiryDate}</p>
          </div>
          <div>
            <p className="text-xs opacity-60">CVV</p>
            <p className="text-xs font-medium">{cvv}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MyCards() {
  return (
    <Card className="shadow-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Mes Cartes</CardTitle>
          <Button variant="ghost" size="sm" className="text-finance-primary">
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CreditCard
          variant="dark"
          cardNumber="•••• •••• •••• 6782"
          expiryDate="09/28"
          cvv="611"
          status="Active"
        />
        <CreditCard
          variant="orange"
          cardNumber="•••• •••• •••• 4356"
          expiryDate="12/27"
          cvv="789"
          status="Active"
        />
      </CardContent>
    </Card>
  );
}