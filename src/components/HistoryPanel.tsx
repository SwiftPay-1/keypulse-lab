import { Clock, Check, X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface HistoryEntry {
  id: string;
  provider: string;
  providerIcon: string;
  model: string;
  maskedKey: string;
  success: boolean;
  responseTime?: number;
  timestamp: Date;
}

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onClear: () => void;
}

export function HistoryPanel({ entries, onClear }: HistoryPanelProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-border/50 bg-card/40 p-6 text-center">
        <Clock className="w-6 h-6 text-muted-foreground mx-auto mb-2 opacity-30" />
        <p className="text-xs text-muted-foreground">No recent tests</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card/40 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Recent Tests</h3>
        <button
          onClick={onClear}
          className="text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        <AnimatePresence>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="px-4 py-2.5 border-b border-border/20 last:border-0"
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="flex items-center gap-2 text-xs">
                  <span>{entry.providerIcon}</span>
                  <span className="font-medium text-foreground">{entry.provider}</span>
                </span>
                {entry.success ? (
                  <Check className="w-3.5 h-3.5 text-success" />
                ) : (
                  <X className="w-3.5 h-3.5 text-destructive" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground">{entry.maskedKey}</span>
                {entry.responseTime && (
                  <span className="text-[10px] text-muted-foreground">{entry.responseTime}ms</span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
