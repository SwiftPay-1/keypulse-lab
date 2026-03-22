import { Trophy, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import type { HistoryEntry } from "./HistoryPanel";

interface BestProviderCardProps {
  entries: HistoryEntry[];
}

export function BestProviderCard({ entries }: BestProviderCardProps) {
  const successful = entries.filter((e) => e.success && e.responseTime);
  if (successful.length < 2) return null;

  // Group by provider
  const providerStats: Record<string, { times: number[]; successes: number; total: number }> = {};
  entries.forEach((e) => {
    if (!providerStats[e.provider]) providerStats[e.provider] = { times: [], successes: 0, total: 0 };
    providerStats[e.provider].total++;
    if (e.success) {
      providerStats[e.provider].successes++;
      if (e.responseTime) providerStats[e.provider].times.push(e.responseTime);
    }
  });

  const fastest = Object.entries(providerStats)
    .filter(([, s]) => s.times.length > 0)
    .sort((a, b) => {
      const avgA = a[1].times.reduce((s, t) => s + t, 0) / a[1].times.length;
      const avgB = b[1].times.reduce((s, t) => s + t, 0) / b[1].times.length;
      return avgA - avgB;
    })[0];

  const mostStable = Object.entries(providerStats)
    .sort((a, b) => (b[1].successes / b[1].total) - (a[1].successes / a[1].total))[0];

  if (!fastest && !mostStable) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-4 space-y-3"
    >
      <div className="flex items-center gap-2">
        <Trophy className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Recommendation</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {fastest && (
          <div className="bg-card/60 rounded-lg p-3 border border-border/30">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="w-3 h-3 text-accent" />
              <span className="text-[10px] text-muted-foreground uppercase">Fastest</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{fastest[0]}</p>
            <p className="text-xs text-accent">
              Avg {Math.round(fastest[1].times.reduce((s, t) => s + t, 0) / fastest[1].times.length)}ms
            </p>
          </div>
        )}
        {mostStable && (
          <div className="bg-card/60 rounded-lg p-3 border border-border/30">
            <div className="flex items-center gap-1.5 mb-1">
              <Shield className="w-3 h-3 text-success" />
              <span className="text-[10px] text-muted-foreground uppercase">Most Stable</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{mostStable[0]}</p>
            <p className="text-xs text-success">
              {Math.round((mostStable[1].successes / mostStable[1].total) * 100)}% success
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
