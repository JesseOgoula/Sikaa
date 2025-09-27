import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  ShoppingBag, 
  Plane, 
  Smartphone, 
  Home, 
  Briefcase,
  MoreHorizontal 
} from "lucide-react";

interface TransactionItemProps {
  id: string;
  activity: string;
  price: string;
  status: "completed" | "pending" | "in-progress";
  date: string;
  icon: "shopping" | "travel" | "mobile" | "hotel" | "software";
}

const iconMap = {
  shopping: ShoppingBag,
  travel: Plane,
  mobile: Smartphone,
  hotel: Home,
  software: Briefcase,
};

const statusVariants = {
  completed: "bg-finance-success text-white",
  pending: "bg-finance-danger text-white",
  "in-progress": "bg-warning text-white",
};

export function TransactionItem({
  id,
  activity,
  price,
  status,
  date,
  icon,
}: TransactionItemProps) {
  const IconComponent = iconMap[icon];

  return (
    <div className="flex items-center justify-between py-4 px-1 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
          <IconComponent className="w-5 h-5 text-finance-neutral" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-sm text-foreground">{activity}</p>
          <p className="text-xs text-muted-foreground">{id}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <p className="font-semibold text-foreground">{price}</p>
        <Badge 
          variant="secondary" 
          className={cn("text-xs px-2 py-1", statusVariants[status])}
        >
          {status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
        <p className="text-xs text-muted-foreground min-w-[120px] text-right">{date}</p>
        <button className="p-1 hover:bg-secondary rounded">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}