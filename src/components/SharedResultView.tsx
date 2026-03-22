import { Check, X, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface SharedResult {
  provider: string;
  model: string;
  success: boolean;
  responseTime: number;
  statusCode?: number;
  error?: string;
  timestamp: string;
}

interface SharedResultViewProps {
  data: SharedResult;
  onClose: () => void;
}

export function SharedResultView({ data, onClose }: SharedResultViewProps) {
  return (
    <div className="min-h-svh bg-background flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md space-y-4"
      >
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">KeyPulse</h1>
          </div>
          <p className="text-sm text-muted-foreground">Shared Test Result</p>
        </div>

        <div className={`rounded-2xl border p-6 bg-card/60 backdrop-blur-sm ${
          data.success ? "border-success/30" : "border-destructive/30"
        }`}>
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              data.success ? "bg-success/10" : "bg-destructive/10"
            }`}>
              {data.success
                ? <Check className="w-5 h-5 text-success" />
                : <X className="w-5 h-5 text-destructive" />
              }
            </div>
            <div>
              <h2 className="text-foreground font-semibold">
                {data.success ? "API Key is Active" : "API Key Failed"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Tested on {new Date(data.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/30 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Provider</p>
              <p className="text-sm font-medium text-foreground">{data.provider}</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Model</p>
              <p className="text-sm font-medium text-foreground font-mono truncate">{data.model}</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Response</p>
              <p className={`text-sm font-medium ${data.success ? "text-success" : "text-foreground"}`}>
                {data.responseTime}ms
              </p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">HTTP</p>
              <p className={`text-sm font-medium font-mono ${data.success ? "text-success" : "text-destructive"}`}>
                {data.statusCode || "N/A"}
              </p>
            </div>
          </div>

          {data.error && (
            <div className="mt-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
              <p className="text-xs text-destructive">{data.error}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Read-only shared result</span>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl py-3 text-sm font-semibold text-primary-foreground"
          style={{ background: "linear-gradient(135deg, hsl(263.4, 70%, 50.4%), hsl(199, 89%, 48%))" }}
        >
          Try KeyPulse Yourself
        </button>
      </motion.div>
    </div>
  );
}
