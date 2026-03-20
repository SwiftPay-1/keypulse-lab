import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader2, Check, X, Wifi, ShieldCheck, FileSearch } from "lucide-react";
import { ProviderLogo } from "./ProviderLogo";
import { type Provider } from "@/data/providers";
import { Progress } from "@/components/ui/progress";

const steps = [
  { label: "Connecting to API...", icon: Wifi, threshold: 15 },
  { label: "Authenticating key...", icon: ShieldCheck, threshold: 45 },
  { label: "Validating response...", icon: FileSearch, threshold: 75 },
  { label: "Finalizing...", icon: Loader2, threshold: 95 },
];

interface TestingOverlayProps {
  active: boolean;
  provider: Provider | null;
  model: string;
  result: { success: boolean; responseTime: number; error?: string } | null;
  onDismiss: () => void;
}

export function TestingOverlay({ active, provider, model, result, onDismiss }: TestingOverlayProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"testing" | "done">("testing");

  useEffect(() => {
    if (!active) {
      setProgress(0);
      setPhase("testing");
      return;
    }

    setPhase("testing");
    setProgress(0);

    // Simulate smooth progress that slows down near end
    const intervals = [
      { target: 20, duration: 400 },
      { target: 45, duration: 600 },
      { target: 70, duration: 800 },
      { target: 85, duration: 1000 },
      { target: 92, duration: 1500 },
    ];

    let currentTarget = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;

    intervals.forEach((step) => {
      elapsed += step.duration;
      timers.push(
        setTimeout(() => {
          currentTarget = step.target;
          setProgress(currentTarget);
        }, elapsed)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [active]);

  // When result arrives, jump to 100%
  useEffect(() => {
    if (result && active) {
      setProgress(100);
      const t = setTimeout(() => setPhase("done"), 500);
      return () => clearTimeout(t);
    }
  }, [result, active]);

  const currentStep = steps.findIndex((s) => progress < s.threshold);
  const activeStep = currentStep === -1 ? steps.length - 1 : currentStep;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={phase === "done" ? onDismiss : undefined}
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
            {/* Top glow */}
            <div className="absolute top-0 left-0 right-0 h-1">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: result?.success === false
                    ? "hsl(var(--destructive))"
                    : "linear-gradient(90deg, hsl(263.4, 70%, 50.4%), hsl(199, 89%, 48%))",
                  width: `${progress}%`,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
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
                  <span className="text-xs font-bold text-foreground tabular-nums">{Math.round(progress)}%</span>
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
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3 mb-6">
                {steps.map((step, i) => {
                  const StepIcon = step.icon;
                  const isDone = progress >= step.threshold;
                  const isActive = i === activeStep && phase === "testing";

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
                {phase === "done" && result && (
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
