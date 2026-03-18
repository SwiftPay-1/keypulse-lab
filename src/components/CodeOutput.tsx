import { useState } from "react";
import { generateCodeSnippets, type Provider } from "@/data/providers";
import { Check, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface CodeOutputProps {
  provider: Provider;
  model: string;
  apiKey: string;
}

const tabs = [
  { id: "python", label: "Python" },
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "curl", label: "cURL" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function CodeOutput({ provider, model, apiKey }: CodeOutputProps) {
  const [activeTab, setActiveTab] = useState<TabId>("python");
  const [copied, setCopied] = useState(false);
  const snippets = generateCodeSnippets(provider, model, apiKey);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="glass-strong rounded-2xl overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-border/50 px-4">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="code-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-sm text-muted-foreground leading-relaxed">
          <code>{snippets[activeTab]}</code>
        </pre>
      </div>
    </motion.div>
  );
}
