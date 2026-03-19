import { useState, useCallback } from "react";
import { ProviderSelector } from "./ProviderSelector";
import { CodeOutput } from "./CodeOutput";
import { HistoryPanel, type HistoryEntry } from "./HistoryPanel";
import { type Provider, maskApiKey, validateApiKey } from "@/data/providers";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Key, ArrowLeft, Check, X, AlertTriangle,
  Loader2, ChevronDown, ExternalLink, Sparkles
} from "lucide-react";
import { ProviderLogo } from "./ProviderLogo";

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
    { message: "Your account may have insufficient credits or hit rate limits" },
    { message: "Check your billing page and add credits" },
  ],
  wrong_model: [
    { message: "The selected model may not be available for your plan" },
    { message: "Try a different model from the dropdown" },
  ],
  cors: [
    { message: "This provider blocks direct browser requests (CORS)" },
    { message: "Use a backend proxy or server-side validation for this provider" },
  ],
  unsupported: [
    { message: "This provider requires custom endpoint configuration" },
    { message: "Key format appears valid based on prefix" },
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

  const runTest = useCallback(async () => {
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

    const result = await validateApiKey(provider, apiKey, selectedModel);

    if (result.success) {
      setTestState("success");
      setTestResult({ responseTime: result.responseTime });
      toast.success("API Key is active and working!");
    } else {
      setTestState("error");
      setTestResult({
        responseTime: result.responseTime,
        error: result.error || "Validation failed",
        errorType: result.errorType,
      });
      toast.error("API Key validation failed");
    }

    setHistory((prev) => [
      {
        id: crypto.randomUUID(),
        provider: provider.name,
        providerLogo: provider.logo,
        providerBrandColor: provider.brandColor,
        model: selectedModel,
        maskedKey: maskApiKey(apiKey),
        success: result.success,
        responseTime: result.responseTime,
        timestamp: new Date(),
      },
      ...prev.slice(0, 9),
    ]);
  }, [apiKey, provider, selectedModel]);

  return (
    <div className="min-h-svh bg-background">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-card/50 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary/50">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h1 className="text-lg font-bold text-foreground">KeyPulse</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Console */}
          <div className="lg:col-span-8 space-y-4">
            {/* Single Card Container for all inputs */}
            <div
              className={`rounded-2xl border bg-card/60 backdrop-blur-sm p-5 sm:p-6 space-y-5 transition-all duration-300 ${
                testState === "testing" ? "border-primary/50 shadow-[0_0_20px_-3px_hsl(var(--primary)/0.25)]" :
                testState === "success" ? "border-success/50 shadow-[0_0_20px_-3px_hsl(var(--success)/0.25)]" :
                testState === "error" ? "border-destructive/50 shadow-[0_0_20px_-3px_hsl(var(--destructive)/0.25)]" :
                "border-border/50"
              }`}
            >
              {/* API Key Input */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">
                  API Key
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/20 px-4 py-3 focus-within:border-primary/50 transition-colors">
                  <Key className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                    className="flex-1 bg-transparent text-sm font-mono text-foreground outline-none placeholder:text-muted-foreground/40"
                    onKeyDown={(e) => e.key === "Enter" && runTest()}
                  />
                </div>
              </div>

              {/* Provider */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">
                  Provider
                </label>
                <ProviderSelector selected={provider} onSelect={(p) => { setProvider(p); setModel(p.models[0]); setCustomModel(""); }} />
              </div>

              {/* Model */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">
                  Model
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    className="w-full rounded-xl border border-border/50 bg-secondary/20 px-4 py-3 flex items-center justify-between text-left hover:border-border transition-colors focus-within:border-primary/50"
                    disabled={!provider}
                  >
                    <span className={`text-sm ${selectedModel ? "text-foreground font-medium font-mono" : "text-muted-foreground/60"}`}>
                      {selectedModel || "Select a model..."}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showModelDropdown ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {showModelDropdown && provider && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.12 }}
                        className="absolute z-50 w-full mt-2 rounded-xl border border-border/50 bg-card backdrop-blur-xl shadow-xl overflow-hidden"
                      >
                        <div className="p-2 border-b border-border/50">
                          <input
                            value={customModel}
                            onChange={(e) => setCustomModel(e.target.value)}
                            placeholder="Type custom model name..."
                            className="w-full bg-secondary/50 rounded-lg px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground font-mono"
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

              {/* Test Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={runTest}
                disabled={testState === "testing"}
                className="w-full rounded-xl py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60 transition-all"
                style={{
                  background: "linear-gradient(135deg, hsl(263.4, 70%, 50.4%), hsl(199, 89%, 48%))",
                }}
              >
                {testState === "testing" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Validating...
                  </span>
                ) : (
                  "Test API Key"
                )}
              </motion.button>
            </div>

            {/* Results */}
            <AnimatePresence mode="wait">
              {testState === "success" && testResult && provider && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="space-y-4"
                >
                  <div className="rounded-xl border border-success/20 bg-card/60 backdrop-blur-sm p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center">
                        <Check className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <h3 className="text-foreground font-semibold text-sm">API Key is Active</h3>
                        <p className="text-xs text-muted-foreground">Validated successfully via live request</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Provider</p>
                        <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                          <ProviderLogo provider={provider} size={14} />
                          {provider.name}
                        </p>
                      </div>
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Model</p>
                        <p className="text-xs font-medium text-foreground font-mono truncate">{selectedModel}</p>
                      </div>
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Response</p>
                        <p className="text-xs font-medium text-success">{testResult.responseTime}ms</p>
                      </div>
                    </div>
                  </div>
                  <CodeOutput provider={provider} model={selectedModel} apiKey={apiKey} />
                </motion.div>
              )}

              {testState === "error" && testResult && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="space-y-4"
                >
                  <div className="rounded-xl border border-destructive/20 bg-card/60 backdrop-blur-sm p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center">
                        <X className="w-4 h-4 text-destructive" />
                      </div>
                      <div>
                        <h3 className="text-foreground font-semibold text-sm">Invalid or Not Working</h3>
                        <p className="text-xs text-muted-foreground break-all">{testResult.error}</p>
                      </div>
                    </div>
                  </div>

                  {testResult.errorType && errorSuggestions[testResult.errorType] && (
                    <div className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4 text-accent" />
                        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Fix Suggestions</h4>
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
          <div className="lg:col-span-4">
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
