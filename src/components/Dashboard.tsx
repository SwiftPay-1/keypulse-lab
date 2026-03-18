import { useState, useCallback } from "react";
import { AnimatedBackground } from "./AnimatedBackground";
import { ProviderSelector } from "./ProviderSelector";
import { CodeOutput } from "./CodeOutput";
import { HistoryPanel, type HistoryEntry } from "./HistoryPanel";
import { type Provider, maskApiKey } from "@/data/providers";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Key, ArrowLeft, Check, X, AlertTriangle,
  Loader2, ChevronDown, ExternalLink
} from "lucide-react";

interface DashboardProps {
  onBack: () => void;
}

type TestState = "idle" | "testing" | "success" | "error";

interface TestResult {
  responseTime: number;
  error?: string;
  errorType?: string;
}

const errorSuggestions: Record<string, { message: string; link?: string }[]> = {
  invalid_key: [
    { message: "Double-check your API key for typos" },
    { message: "Ensure you copied the full key including prefix" },
    { message: "Generate a new key from your provider dashboard" },
  ],
  expired: [
    { message: "Your API key may have expired" },
    { message: "Check your provider dashboard for key status" },
  ],
  no_credits: [
    { message: "Your account may have insufficient credits" },
    { message: "Check your billing page and add credits" },
  ],
  wrong_model: [
    { message: "The selected model may not be available for your plan" },
    { message: "Try a different model from the dropdown" },
  ],
};

export function Dashboard({ onBack }: DashboardProps) {
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState<Provider | null>(null);
  const [model, setModel] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [testState, setTestState] = useState<TestState>("idle");
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const selectedModel = customModel || model;

  const simulateTest = useCallback(async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }
    if (!provider) {
      toast.error("Please select a provider");
      return;
    }
    if (!selectedModel) {
      toast.error("Please select or enter a model");
      return;
    }

    setTestState("testing");
    setTestResult(null);

    // Simulate API test (1-3 seconds)
    const delay = 800 + Math.random() * 2000;
    await new Promise((r) => setTimeout(r, delay));

    const responseTime = Math.round(100 + Math.random() * 400);
    // Simulate: keys starting with "invalid" fail, otherwise succeed
    const isValid = !apiKey.toLowerCase().startsWith("invalid");

    if (isValid) {
      setTestState("success");
      setTestResult({ responseTime });
      toast.success("API Key is active and working!");
    } else {
      const errors = ["invalid_key", "expired", "no_credits", "wrong_model"];
      const errorType = errors[Math.floor(Math.random() * errors.length)];
      setTestState("error");
      setTestResult({
        responseTime,
        error: "Authentication failed. The provided API key is invalid.",
        errorType,
      });
      toast.error("API Key validation failed");
    }

    // Add to history
    setHistory((prev) => [
      {
        id: crypto.randomUUID(),
        provider: provider.name,
        providerIcon: provider.icon,
        model: selectedModel,
        maskedKey: maskApiKey(apiKey),
        success: isValid,
        responseTime,
        timestamp: new Date(),
      },
      ...prev.slice(0, 9),
    ]);
  }, [apiKey, provider, selectedModel]);

  return (
    <div className="relative min-h-svh bg-mesh-subtle">
      <AnimatedBackground subtle />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-gradient-primary">KeyPulse</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Console */}
          <div className="lg:col-span-9 space-y-6">
            {/* API Key Input */}
            <motion.div
              className={`glass-strong rounded-2xl p-1 transition-all duration-500 ${
                testState === "testing" ? "glow-primary" : ""
              } ${testState === "success" ? "glow-success" : ""} ${
                testState === "error" ? "glow-error" : ""
              }`}
              animate={
                testState === "testing"
                  ? {
                      boxShadow: [
                        "0 0 0px 0px rgba(139, 92, 246, 0)",
                        "0 0 20px 2px rgba(139, 92, 246, 0.3)",
                        "0 0 0px 0px rgba(139, 92, 246, 0)",
                      ],
                    }
                  : {}
              }
              transition={testState === "testing" ? { repeat: Infinity, duration: 1.5 } : {}}
            >
              <div className="flex items-center gap-3 px-6 py-4">
                <Key className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key..."
                  className="flex-1 bg-transparent text-lg font-mono text-foreground outline-none placeholder:text-muted-foreground/50"
                  onKeyDown={(e) => e.key === "Enter" && simulateTest()}
                />
              </div>
            </motion.div>

            {/* Provider + Model Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">
                  Provider
                </label>
                <ProviderSelector selected={provider} onSelect={(p) => { setProvider(p); setModel(p.models[0]); setCustomModel(""); }} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">
                  Model
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    className="w-full glass-strong rounded-xl px-4 py-3 flex items-center justify-between text-left hover:border-primary/30 transition-colors"
                    disabled={!provider}
                  >
                    <span className={`text-sm ${selectedModel ? "text-foreground font-medium font-mono" : "text-muted-foreground"}`}>
                      {selectedModel || "Select a model..."}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showModelDropdown ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {showModelDropdown && provider && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 glass-strong rounded-xl overflow-hidden"
                      >
                        <div className="p-2 border-b border-border/50">
                          <input
                            value={customModel}
                            onChange={(e) => setCustomModel(e.target.value)}
                            placeholder="Type custom model name..."
                            className="w-full bg-background/50 rounded-lg px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground font-mono"
                          />
                        </div>
                        <div className="max-h-48 overflow-y-auto p-1">
                          {provider.models.map((m) => (
                            <button
                              key={m}
                              onClick={() => { setModel(m); setCustomModel(""); setShowModelDropdown(false); }}
                              className={`w-full px-3 py-2 rounded-lg text-left text-sm font-mono transition-colors ${
                                model === m && !customModel
                                  ? "bg-primary/10 text-foreground"
                                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Test Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={simulateTest}
              disabled={testState === "testing"}
              className="w-full rounded-xl py-4 text-base font-semibold text-primary-foreground disabled:opacity-60 transition-all relative overflow-hidden border-glow"
              style={{
                background: "linear-gradient(135deg, hsl(263.4, 70%, 50.4%), hsl(199, 89%, 48%))",
              }}
            >
              {testState === "testing" ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Testing API Key...
                </span>
              ) : (
                "Test API Key"
              )}
            </motion.button>

            {/* Results */}
            <AnimatePresence mode="wait">
              {testState === "success" && testResult && provider && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="glass-strong rounded-2xl p-6 border-success/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <h3 className="text-foreground font-semibold">API Key is Active and Working</h3>
                        <p className="text-sm text-muted-foreground">Your key has been validated successfully</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-background/30 rounded-xl p-3">
                        <p className="text-xs text-muted-foreground mb-1">Provider</p>
                        <p className="text-sm font-medium text-foreground">{provider.icon} {provider.name}</p>
                      </div>
                      <div className="bg-background/30 rounded-xl p-3">
                        <p className="text-xs text-muted-foreground mb-1">Model</p>
                        <p className="text-sm font-medium text-foreground font-mono">{selectedModel}</p>
                      </div>
                      <div className="bg-background/30 rounded-xl p-3">
                        <p className="text-xs text-muted-foreground mb-1">Response</p>
                        <p className="text-sm font-medium text-success">{testResult.responseTime}ms</p>
                      </div>
                    </div>
                  </div>

                  <CodeOutput provider={provider} model={selectedModel} apiKey={apiKey} />
                </motion.div>
              )}

              {testState === "error" && testResult && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="glass-strong rounded-2xl p-6 border-destructive/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                        <X className="w-5 h-5 text-destructive" />
                      </div>
                      <div>
                        <h3 className="text-foreground font-semibold">API Key is Invalid or Not Working</h3>
                        <p className="text-sm text-muted-foreground">{testResult.error}</p>
                      </div>
                    </div>
                  </div>

                  {testResult.errorType && errorSuggestions[testResult.errorType] && (
                    <div className="glass rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4 text-accent" />
                        <h4 className="text-sm font-semibold text-foreground">Fix Suggestions</h4>
                      </div>
                      <ul className="space-y-2">
                        {errorSuggestions[testResult.errorType].map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary mt-0.5">→</span>
                            <span>{s.message}</span>
                            {s.link && (
                              <a href={s.link} target="_blank" rel="noopener" className="text-accent hover:underline inline-flex items-center gap-1">
                                Learn more <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-8">
              <label className="text-xs font-medium text-muted-foreground mb-3 block uppercase tracking-wider">
                History
              </label>
              <HistoryPanel entries={history} onClear={() => setHistory([])} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
