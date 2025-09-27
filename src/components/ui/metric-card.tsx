import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: {
    percentage: string;
    trend: "up" | "down";
    period: string;
  };
  variant?: "default" | "primary" | "success" | "danger";
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  variant = "default",
  className 
}: MetricCardProps) {
  const variants = {
    default: "bg-card",
    primary: "bg-gradient-to-br from-finance-primary to-finance-primary-light text-white",
    success: "bg-finance-success text-white",
    danger: "bg-finance-danger text-white"
  };

  const textVariants = {
    default: "text-card-foreground",
    primary: "text-white",
    success: "text-white", 
    danger: "text-white"
  };

  return (
    <Card className={cn(
      "shadow-card border-0 transition-all duration-200 hover:shadow-elevated",
      variants[variant],
      className
    )}>
      <CardContent className="p-6">
        <div className="space-y-2">
          <p className={cn(
            "text-sm font-medium opacity-80",
            textVariants[variant]
          )}>
            {title}
          </p>
          <p className={cn(
            "text-3xl font-bold tracking-tight",
            textVariants[variant]
          )}>
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1">
              {change.trend === "up" ? (
                <TrendingUp className={cn(
                  "h-4 w-4",
                  variant === "default" ? "text-finance-success" : "text-white opacity-80"
                )} />
              ) : (
                <TrendingDown className={cn(
                  "h-4 w-4",
                  variant === "default" ? "text-finance-danger" : "text-white opacity-80"
                )} />
              )}
              <span className={cn(
                "text-sm font-medium",
                variant === "default" 
                  ? change.trend === "up" ? "text-finance-success" : "text-finance-danger"
                  : "text-white opacity-80"
              )}>
                {change.percentage}
              </span>
              <span className={cn(
                "text-sm opacity-60",
                textVariants[variant]
              )}>
                {change.period}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}