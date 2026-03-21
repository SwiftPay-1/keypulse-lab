import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Loader2, Check, X, Wifi, ShieldCheck, FileSearch, Zap } from "lucide-react";
import { ProviderLogo } from "./ProviderLogo";
import { type Provider } from "@/data/providers";

export type TestPhase = "idle" | "connecting" | "authenticating" | "validating" | "done";

const steps = [
  { label: "Connecting to API...", icon: Wifi, phase: "connecting" as TestPhase },
  { label: "Authenticating key...", icon: ShieldCheck, phase: "authenticating" as TestPhase },
  { label: "Validating response...", icon: FileSearch, phase: "validating" as TestPhase },
  { label: "Complete", icon: Zap, phase: "done" as TestPhase },
];

const phaseProgress: Record<TestPhase, number> = {
  idle: 0,
  connecting: 15,
  authenticating: 45,
  validating: 75,
  done: 100,
};

interface TestingOverlayProps {
  active: boolean;
  provider: Provider | null;
  model: string;
  phase: TestPhase;
  result: { success: boolean; responseTime: number; error?: string } | null;
  onDismiss: () => void;
}

export function TestingOverlay({ active, provider, model, phase, result, onDismiss }: TestingOverlayProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Smoothly animate progress toward target based on phase
  useEffect(() => {
    if (!active) {
      setDisplayProgress(0);
      setShowResult(false);
      return;
    }

    const target = phaseProgress[phase];

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Animate toward target smoothly
    intervalRef.current = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev >= target) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          return target;
        }
        // Move faster when far from target, slower when close
        const diff = target - prev;
        const step = Math.max(0.5, diff * 0.15);
        return Math.min(prev + step, target);
      });
    }, 30);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, phase]);

  // Show result card after progress hits 100
  useEffect(() => {
    if (result && displayProgress >= 99) {
      const t = setTimeout(() => setShowResult(true), 300);
      return () => clearTimeout(t);
    }
  }, [result, displayProgress]);

  const getActiveStepIndex = () => {
    const idx = steps.findIndex((s) => s.phase === phase);
    return idx === -1 ? 0 : idx;
  };

  const activeStep = getActiveStepIndex();

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={showResult ? onDismiss : undefined}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Center Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md mx-4 rounded-2xl border border-border/50 bg-card shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top glow bar */}
            <div className="absolute top-0 left-0 right-0 h-1">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: result?.success === false
                    ? "hsl(var(--destructive))"
                    : "linear-gradient(90deg, hsl(263.4, 70%, 50.4%), hsl(199, 89%, 48%))",
                }}
                animate={{ width: `${displayProgress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>

            <div className="p-6 sm:p-8">
              {/* Provider info */}
              {provider && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center">
                    <ProviderLogo provider={provider} size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{provider.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{model}</p>
                  </div>
                </div>
              )}

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-medium">Progress</span>
                  <span className="text-xs font-bold text-foreground tabular-nums">{Math.round(displayProgress)}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-secondary/50 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: result?.success === false
                        ? "hsl(var(--destructive))"
                        : result?.success
                        ? "hsl(var(--success))"
                        : "linear-gradient(90deg, hsl(263.4, 70%, 50.4%), hsl(199, 89%, 48%))",
                    }}
                    animate={{ width: `${displayProgress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3 mb-6">
                {steps.map((step, i) => {
                  const StepIcon = step.icon;
                  const isDone = i < activeStep || (phase === "done");
                  const isActive = i === activeStep && phase !== "done";

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.3 }}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-300 ${
                        isActive
                          ? "bg-primary/5"
                          : isDone
                          ? "bg-success/5"
                          : "opacity-40"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        isDone ? "bg-success/10" : isActive ? "bg-primary/10" : "bg-muted/30"
                      }`}>
                        {isDone ? (
                          <Check className="w-3.5 h-3.5 text-success" />
                        ) : isActive ? (
                          <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                        ) : (
                          <StepIcon className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </div>
                      <span className={`text-sm font-medium ${
                        isDone ? "text-success" : isActive ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {step.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Result */}
              <AnimatePresence>
                {showResult && result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {result.success ? (
                      <div className="rounded-xl bg-success/10 border border-success/20 p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                          <Check className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-success">API Key is Valid</p>
                          <p className="text-xs text-muted-foreground">Response in {result.responseTime}ms</p>
                        </div>
                      </div>
                    ) : (
                      <motion.div
                        animate={{ x: [0, -4, 4, -3, 3, 0] }}
                        transition={{ duration: 0.4 }}
                        className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
                          <X className="w-5 h-5 text-destructive" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-destructive">Validation Failed</p>
                          <p className="text-xs text-muted-foreground truncate">{result.error || "Unknown error"}</p>
                        </div>
                      </motion.div>
                    )}

                    <button
                      onClick={onDismiss}
                      className="w-full mt-4 rounded-xl py-2.5 text-sm font-medium text-foreground bg-secondary/50 hover:bg-secondary/80 transition-colors active:scale-[0.98]"
                    >
                      View Details
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
