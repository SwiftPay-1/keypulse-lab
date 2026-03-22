import { useState } from "react";
import { Play, Check, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DemoModeProps {
  onTryDemo: () => void;
}

export function DemoMode({ onTryDemo }: DemoModeProps) {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="space-y-3">
      <button
        onClick={() => { setShowDemo(!showDemo); onTryDemo(); }}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-primary/30 bg-primary/5 text-sm font-medium text-primary hover:bg-primary/10 hover:border-primary/50 transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        Try Demo — See how it works
      </button>

      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden"
          >
            {/* Success example */}
            <div className="rounded-xl border border-success/20 bg-success/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm font-semibold text-success">Success Example</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-secondary/30 rounded-lg p-2">
                  <p className="text-muted-foreground text-[10px] uppercase">Provider</p>
                  <p className="font-medium text-foreground">OpenAI</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-2">
                  <p className="text-muted-foreground text-[10px] uppercase">Response</p>
                  <p className="font-medium text-success">245ms</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-2">
                  <p className="text-muted-foreground text-[10px] uppercase">HTTP</p>
                  <p className="font-medium text-success font-mono">200</p>
                </div>
              </div>
            </div>

            {/* Error example */}
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <X className="w-4 h-4 text-destructive" />
                <span className="text-sm font-semibold text-destructive">Error Example</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-secondary/30 rounded-lg p-2">
                  <p className="text-muted-foreground text-[10px] uppercase">Provider</p>
                  <p className="font-medium text-foreground">Anthropic</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-2">
                  <p className="text-muted-foreground text-[10px] uppercase">HTTP</p>
                  <p className="font-medium text-destructive font-mono">401</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-2">
                  <p className="text-muted-foreground text-[10px] uppercase">Error</p>
                  <p className="font-medium text-destructive">Invalid key</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground italic">
                💡 Your API key may be incorrect or missing permissions
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
