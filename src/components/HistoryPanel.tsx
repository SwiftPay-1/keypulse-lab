import { maskApiKey } from "@/data/providers";
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
      <div className="glass rounded-2xl p-6 text-center">
        <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-40" />
        <p className="text-sm text-muted-foreground">No recent tests</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <h3 className="text-sm font-semibold text-foreground">Recent Tests</h3>
        <button
          onClick={onClear}
          className="text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        <AnimatePresence>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="px-4 py-3 border-b border-border/30 last:border-0"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-2 text-sm">
                  <span>{entry.providerIcon}</span>
                  <span className="font-medium text-foreground">{entry.provider}</span>
                </span>
                {entry.success ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <X className="w-4 h-4 text-destructive" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">{entry.maskedKey}</span>
                {entry.responseTime && (
                  <span className="text-xs text-muted-foreground">{entry.responseTime}ms</span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
