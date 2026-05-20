import { TrendingDown, TrendingUp } from "lucide-react";
import Card from "../common/Card";

function StatCard({
  label,
  value,
  accent,
  trend,
}: {
  label: string;
  value: string | number;
  accent: string;
  trend?: number;
}) {
  const isPositive = trend !== undefined && trend >= 0;
  const hasTrend = trend !== undefined;

  return (
    <Card className="relative overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: accent }}
      />
      <p className="text-sm font-medium text-[var(--muted-foreground)]">
        {label}
      </p>
      <div className="mt-4 flex items-baseline justify-between">
        <p className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          {value}
        </p>
        {hasTrend && (
          <div
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-rose-500/10 text-rose-500"
            }`}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>
              {isPositive ? "+" : ""}
              {trend}%
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

export default StatCard;
