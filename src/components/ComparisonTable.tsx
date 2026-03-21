import { motion } from "framer-motion";
import { Check, X, Trophy, BarChart3 } from "lucide-react";
import { ProviderLogo } from "./ProviderLogo";
import { type Provider, providers as allProviders } from "@/data/providers";
import { CopyButton } from "./CopyButton";

export interface ComparisonEntry {
  id: string;
  provider: Provider;
  model: string;
  success: boolean;
  responseTime: number;
  statusCode?: number;
  error?: string;
}

interface ComparisonTableProps {
  entries: ComparisonEntry[];
  onClear: () => void;
}

export function ComparisonTable({ entries, onClear }: ComparisonTableProps) {
  if (entries.length < 2) return null;

  const fastestSuccess = entries
    .filter((e) => e.success)
    .sort((a, b) => a.responseTime - b.responseTime)[0];

  const resultText = entries
    .map((e) => `${e.provider.name} (${e.model}): ${e.success ? "✅" : "❌"} ${e.responseTime}ms`)
    .join("\n");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Comparison Results</h3>
          <span className="text-xs text-muted-foreground">({entries.length} tests)</span>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton value={resultText} label="Copy results" />
          <button onClick={onClear} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Clear
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left text-[10px] text-muted-foreground uppercase tracking-wider px-5 py-2.5 font-medium">Provider</th>
              <th className="text-left text-[10px] text-muted-foreground uppercase tracking-wider px-3 py-2.5 font-medium">Status</th>
              <th className="text-left text-[10px] text-muted-foreground uppercase tracking-wider px-3 py-2.5 font-medium">Code</th>
              <th className="text-left text-[10px] text-muted-foreground uppercase tracking-wider px-3 py-2.5 font-medium">Response</th>
              <th className="text-left text-[10px] text-muted-foreground uppercase tracking-wider px-5 py-2.5 font-medium">Message</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const isFastest = fastestSuccess && entry.id === fastestSuccess.id;
              return (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`border-b border-border/20 last:border-0 transition-colors ${
                    !entry.success ? "bg-destructive/5" : isFastest ? "bg-success/5" : ""
                  }`}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <ProviderLogo provider={entry.provider} size={16} />
                      <span className="font-medium text-foreground text-xs">{entry.provider.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      {entry.success ? (
                        <span className="flex items-center gap-1 text-success text-xs font-medium">
                          <Check className="w-3 h-3" /> Pass
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-destructive text-xs font-medium">
                          <X className="w-3 h-3" /> Fail
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs font-mono font-medium ${
                      entry.statusCode && entry.statusCode >= 200 && entry.statusCode < 300
                        ? "text-success"
                        : entry.statusCode && entry.statusCode >= 400
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}>
                      {entry.statusCode || "—"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs font-mono font-medium ${entry.success ? "text-foreground" : "text-destructive"}`}>
                      {entry.responseTime}ms
                    </span>
                    {isFastest && (
                      <Trophy className="inline-block w-3 h-3 text-accent ml-1" />
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-muted-foreground truncate block max-w-[180px]">
                      {entry.success ? "Request successful" : entry.error || "Failed"}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
