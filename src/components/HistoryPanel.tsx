import { Clock, Check, X, Trash2, RotateCw, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export interface HistoryEntry {
  id: string;
  provider: string;
  providerLogo?: string;
  providerBrandColor: string;
  model: string;
  maskedKey: string;
  success: boolean;
  responseTime?: number;
  statusCode?: number;
  timestamp: Date;
}

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onClear: () => void;
  onRerun?: (entry: HistoryEntry) => void;
}

function MiniLogo({ entry }: { entry: HistoryEntry }) {
  if (entry.providerLogo) {
    return <img src={entry.providerLogo} alt={entry.provider} className="w-4 h-4 object-contain" />;
  }
  return (
    <div
      className="w-4 h-4 rounded text-[8px] font-bold text-white flex items-center justify-center"
      style={{ backgroundColor: entry.providerBrandColor }}
    >
      {entry.provider.charAt(0)}
    </div>
  );
}

export function HistoryPanel({ entries, onClear, onRerun }: HistoryPanelProps) {
  const copyResult = (entry: HistoryEntry) => {
    const text = `Provider: ${entry.provider}\nModel: ${entry.model}\nStatus: ${entry.success ? "✅ Pass" : "❌ Fail"}\nResponse: ${entry.responseTime}ms${entry.statusCode ? `\nHTTP: ${entry.statusCode}` : ""}`;
    navigator.clipboard.writeText(text);
    toast.success("Result copied!");
  };

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
        <button onClick={onClear} className="text-muted-foreground hover:text-destructive transition-colors">
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
              className="px-4 py-2.5 border-b border-border/20 last:border-0 group"
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="flex items-center gap-2 text-xs">
                  <MiniLogo entry={entry} />
                  <span className="font-medium text-foreground">{entry.provider}</span>
                  {entry.statusCode && (
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      entry.statusCode >= 200 && entry.statusCode < 300
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}>
                      {entry.statusCode}
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-1">
                  <div className="hidden group-hover:flex items-center gap-0.5">
                    {onRerun && (
                      <button
                        onClick={() => onRerun(entry)}
                        className="p-1 rounded text-muted-foreground hover:text-primary transition-colors"
                        title="Re-run"
                      >
                        <RotateCw className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => copyResult(entry)}
                      className="p-1 rounded text-muted-foreground hover:text-primary transition-colors"
                      title="Copy result"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  {entry.success ? (
                    <Check className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-destructive" />
                  )}
                </div>
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
