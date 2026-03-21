import { useState } from "react";
import { type Provider, providers as allProviders, validateApiKey } from "@/data/providers";
import { ProviderSelector } from "./ProviderSelector";
import { ComparisonTable, type ComparisonEntry } from "./ComparisonTable";
import { Plus, Play, Loader2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface TestCase {
  id: string;
  apiKey: string;
  provider: Provider | null;
  model: string;
  useSharedKey: boolean;
}

interface MultiTestPanelProps {
  sharedApiKey: string;
}

export function MultiTestPanel({ sharedApiKey }: MultiTestPanelProps) {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [results, setResults] = useState<ComparisonEntry[]>([]);
  const [running, setRunning] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const addTestCase = () => {
    setTestCases((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        apiKey: "",
        provider: null,
        model: "",
        useSharedKey: true,
      },
    ]);
    setExpanded(true);
  };

  const removeTestCase = (id: string) => {
    setTestCases((prev) => prev.filter((tc) => tc.id !== id));
  };

  const updateTestCase = (id: string, updates: Partial<TestCase>) => {
    setTestCases((prev) => prev.map((tc) => (tc.id === id ? { ...tc, ...updates } : tc)));
  };

  const runAllTests = async () => {
    const validCases = testCases.filter((tc) => tc.provider && tc.model);
    if (validCases.length === 0) {
      toast.error("Add at least one test case with provider and model");
      return;
    }

    setRunning(true);
    const newResults: ComparisonEntry[] = [];

    for (const tc of validCases) {
      const key = tc.useSharedKey ? sharedApiKey : tc.apiKey;
      if (!key.trim()) {
        newResults.push({
          id: tc.id,
          provider: tc.provider!,
          model: tc.model,
          success: false,
          responseTime: 0,
          error: "No API key provided",
        });
        continue;
      }

      const result = await validateApiKey(tc.provider!, key, tc.model);
      newResults.push({
        id: tc.id,
        provider: tc.provider!,
        model: tc.model,
        success: result.success,
        responseTime: result.responseTime,
        statusCode: result.statusCode,
        error: result.error,
      });
    }

    setResults(newResults);
    setRunning(false);
    toast.success(`Completed ${newResults.length} tests`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Multi-Test Mode
        </label>
        <div className="flex items-center gap-2">
          {testCases.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={runAllTests}
              disabled={running}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
              Run All
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={addTestCase}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 bg-secondary/20 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add Test Case
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {testCases.map((tc, i) => (
          <motion.div
            key={tc.id}
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-border/50 bg-card/40 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Test #{i + 1}</span>
              <button onClick={() => removeTestCase(tc.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tc.useSharedKey}
                    onChange={(e) => updateTestCase(tc.id, { useSharedKey: e.target.checked })}
                    className="rounded border-border"
                  />
                  Use same API key
                </label>
              </div>
              {!tc.useSharedKey && (
                <input
                  type="password"
                  value={tc.apiKey}
                  onChange={(e) => updateTestCase(tc.id, { apiKey: e.target.value })}
                  placeholder="Enter API key..."
                  className="w-full bg-secondary/20 rounded-lg px-3 py-2 text-xs font-mono text-foreground outline-none border border-border/50 focus:border-primary/50 placeholder:text-muted-foreground/40"
                />
              )}
              <ProviderSelector
                selected={tc.provider}
                onSelect={(p) => updateTestCase(tc.id, { provider: p, model: p.models[0] })}
              />
              {tc.provider && (
                <select
                  value={tc.model}
                  onChange={(e) => updateTestCase(tc.id, { model: e.target.value })}
                  className="w-full bg-secondary/20 rounded-lg px-3 py-2 text-xs font-mono text-foreground outline-none border border-border/50 focus:border-primary/50"
                >
                  {tc.provider.models.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <ComparisonTable entries={results} onClear={() => setResults([])} />
    </div>
  );
}
