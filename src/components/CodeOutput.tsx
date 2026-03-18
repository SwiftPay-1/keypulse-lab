import { useState, useMemo } from "react";
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

// Simple syntax highlighter
function highlightCode(code: string, lang: TabId): JSX.Element[] {
  const lines = code.split("\n");
  return lines.map((line, i) => (
    <div key={i}>{tokenizeLine(line, lang)}</div>
  ));
}

function tokenizeLine(line: string, lang: TabId): JSX.Element[] {
  const elements: JSX.Element[] = [];
  let remaining = line;
  let key = 0;

  const push = (text: string, cls: string) => {
    elements.push(<span key={key++} className={cls}>{text}</span>);
  };

  // Process token by token
  while (remaining.length > 0) {
    // Comments
    if (remaining.startsWith("#") || remaining.startsWith("//")) {
      push(remaining, "text-muted-foreground/60 italic");
      break;
    }

    // Strings (double or single quoted)
    const strMatch = remaining.match(/^("[^"]*"|'[^']*')/);
    if (strMatch) {
      push(strMatch[0], "text-success");
      remaining = remaining.slice(strMatch[0].length);
      continue;
    }

    // Template literals
    const tmplMatch = remaining.match(/^`[^`]*`/);
    if (tmplMatch) {
      push(tmplMatch[0], "text-success");
      remaining = remaining.slice(tmplMatch[0].length);
      continue;
    }

    // Keywords
    const keywords = lang === "python"
      ? /^(import|from|def|return|print|class|if|else|for|in|as|with|try|except|raise|True|False|None)\b/
      : lang === "curl"
      ? /^(curl)\b/
      : /^(import|export|const|let|var|function|return|await|async|interface|type|new|class|if|else|for|of|in|from)\b/;
    const kwMatch = remaining.match(keywords);
    if (kwMatch) {
      push(kwMatch[0], "text-primary font-semibold");
      remaining = remaining.slice(kwMatch[0].length);
      continue;
    }

    // Types (TypeScript)
    const typeMatch = remaining.match(/^(string|number|boolean|void|any|ChatResponse)\b/);
    if (typeMatch) {
      push(typeMatch[0], "text-accent");
      remaining = remaining.slice(typeMatch[0].length);
      continue;
    }

    // Numbers
    const numMatch = remaining.match(/^\d+(\.\d+)?/);
    if (numMatch) {
      push(numMatch[0], "text-accent");
      remaining = remaining.slice(numMatch[0].length);
      continue;
    }

    // Function calls
    const fnMatch = remaining.match(/^([a-zA-Z_]\w*)\s*(?=\()/);
    if (fnMatch) {
      push(fnMatch[1], "text-[hsl(40,80%,65%)]");
      remaining = remaining.slice(fnMatch[1].length);
      continue;
    }

    // Flags (curl)
    const flagMatch = remaining.match(/^-[A-Za-z]+/);
    if (lang === "curl" && flagMatch) {
      push(flagMatch[0], "text-accent");
      remaining = remaining.slice(flagMatch[0].length);
      continue;
    }

    // Punctuation
    const punctMatch = remaining.match(/^[{}()\[\]:;,=<>\\]+/);
    if (punctMatch) {
      push(punctMatch[0], "text-muted-foreground");
      remaining = remaining.slice(punctMatch[0].length);
      continue;
    }

    // Property keys (before colon)
    const propMatch = remaining.match(/^([a-zA-Z_"]\w*)\s*(?=:)/);
    if (propMatch) {
      push(propMatch[1], "text-foreground");
      remaining = remaining.slice(propMatch[1].length);
      continue;
    }

    // Default: single character
    push(remaining[0], "text-foreground");
    remaining = remaining.slice(1);
  }

  return elements;
}

export function CodeOutput({ provider, model, apiKey }: CodeOutputProps) {
  const [activeTab, setActiveTab] = useState<TabId>("python");
  const [copied, setCopied] = useState(false);
  const snippets = generateCodeSnippets(provider, model, apiKey);

  const highlighted = useMemo(() => highlightCode(snippets[activeTab], activeTab), [snippets, activeTab]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-border/50 px-1">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-3 py-2.5 text-xs font-medium transition-colors ${
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
          className="flex items-center gap-1.5 px-3 py-1.5 mr-1 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-xs leading-relaxed">
          <code>{highlighted}</code>
        </pre>
      </div>
    </motion.div>
  );
}
