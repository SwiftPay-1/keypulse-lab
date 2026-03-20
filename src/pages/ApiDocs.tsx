import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Zap, Brain, Search, Image, Code2, MessageSquare, Database, Globe, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProviderGuide {
  name: string;
  icon: string;
  color: string;
  bestFor: string[];
  pricing: string;
  authType: string;
  keyFormat: string;
  docUrl: string;
  quickStart: string;
}

const providerGuides: ProviderGuide[] = [
  {
    name: "OpenAI",
    icon: "⚡",
    color: "#10a37f",
    bestFor: ["General chat & assistants", "Code generation", "Function calling", "Embeddings"],
    pricing: "Pay-per-token, starts ~$0.50/1M tokens",
    authType: "Bearer token",
    keyFormat: "sk-xxxxxxxx...",
    docUrl: "https://platform.openai.com/docs",
    quickStart: "Best all-rounder. GPT-4o for quality, GPT-4o-mini for speed & cost.",
  },
  {
    name: "Anthropic",
    icon: "🧠",
    color: "#d97757",
    bestFor: ["Long-form writing", "Code analysis", "Safety-critical apps", "Document processing"],
    pricing: "Pay-per-token, starts ~$0.25/1M tokens",
    authType: "x-api-key header",
    keyFormat: "sk-ant-xxxxxxxx...",
    docUrl: "https://docs.anthropic.com",
    quickStart: "Best for nuanced, careful reasoning. Claude Sonnet 4 balances quality and cost.",
  },
  {
    name: "Google Gemini",
    icon: "✨",
    color: "#4285f4",
    bestFor: ["Multimodal (text+image)", "Large context windows", "Google ecosystem", "Free tier available"],
    pricing: "Free tier available, paid starts ~$0.075/1M tokens",
    authType: "API key in query",
    keyFormat: "AIzaSy...",
    docUrl: "https://ai.google.dev/docs",
    quickStart: "Best free option. Gemini 2.0 Flash for speed, Gemini 1.5 Pro for quality.",
  },
  {
    name: "Groq",
    icon: "🚀",
    color: "#f55036",
    bestFor: ["Ultra-fast inference", "Real-time applications", "Cost-effective", "Open-source models"],
    pricing: "Free tier, very low cost per token",
    authType: "Bearer token",
    keyFormat: "gsk_xxxxxxxx...",
    docUrl: "https://console.groq.com/docs",
    quickStart: "Fastest inference available. Great for Llama 3.3 70B at lightning speed.",
  },
  {
    name: "Mistral",
    icon: "🌊",
    color: "#ff7000",
    bestFor: ["European data compliance", "Multilingual tasks", "Code generation", "Efficient models"],
    pricing: "Competitive per-token pricing",
    authType: "Bearer token",
    keyFormat: "Standard API key",
    docUrl: "https://docs.mistral.ai",
    quickStart: "Strong European alternative. Mistral Large for quality, Small for efficiency.",
  },
  {
    name: "Perplexity",
    icon: "🔍",
    color: "#20808d",
    bestFor: ["Web-connected answers", "Real-time information", "Research & citations", "Fact-checking"],
    pricing: "Pay-per-request, includes web search",
    authType: "Bearer token",
    keyFormat: "pplx-xxxxxxxx...",
    docUrl: "https://docs.perplexity.ai",
    quickStart: "Best for answers that need current web data. Always includes sources.",
  },
];

const useCaseMatrix = [
  { useCase: "Chatbot / Assistant", best: "OpenAI", runner: "Anthropic", icon: MessageSquare },
  { useCase: "Code Generation", best: "Anthropic", runner: "OpenAI", icon: Code2 },
  { useCase: "Image Understanding", best: "Google Gemini", runner: "OpenAI", icon: Image },
  { useCase: "Real-time Search", best: "Perplexity", runner: "Google Gemini", icon: Search },
  { useCase: "Speed Critical", best: "Groq", runner: "Mistral", icon: Zap },
  { useCase: "Long Documents", best: "Google Gemini", runner: "Anthropic", icon: Database },
  { useCase: "Multilingual", best: "Mistral", runner: "OpenAI", icon: Globe },
  { useCase: "Complex Reasoning", best: "Anthropic", runner: "OpenAI", icon: Brain },
];

const fadeUp = {
  initial: { opacity: 0, y: 16, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function ApiDocs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-svh bg-background">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-card/50 backdrop-blur-md sticky top-0">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary/50 active:scale-[0.96]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Sparkles className="w-4 h-4 text-primary" />
          <h1 className="text-lg font-bold text-foreground">API Documentation</h1>
        </div>
      </header>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Hero */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 leading-tight">
            Which API Should You Use?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A practical guide to choosing the right AI provider for your project, with setup instructions and best-use recommendations.
          </p>
        </motion.div>

        {/* Use Case Matrix */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Best API by Use Case</h3>
          <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_140px_140px] text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 sm:px-5 py-3 border-b border-border/50 bg-secondary/20">
              <span>Use Case</span>
              <span className="text-center">Best Pick</span>
              <span className="text-center">Runner Up</span>
            </div>
            {useCaseMatrix.map((row, i) => {
              const Icon = row.icon;
              return (
                <motion.div
                  key={row.useCase}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.3 }}
                  className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_140px_140px] items-center px-4 sm:px-5 py-3.5 border-b border-border/20 last:border-0 hover:bg-secondary/20 transition-colors"
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                    <Icon className="w-4 h-4 text-primary shrink-0" />
                    {row.useCase}
                  </span>
                  <span className="text-center">
                    <span className="inline-block text-xs font-semibold text-foreground bg-primary/10 rounded-md px-2.5 py-1">
                      {row.best}
                    </span>
                  </span>
                  <span className="text-center">
                    <span className="inline-block text-xs font-medium text-muted-foreground bg-secondary/40 rounded-md px-2.5 py-1">
                      {row.runner}
                    </span>
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Provider Cards */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Provider Quick Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providerGuides.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 hover:border-border transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: p.color + "18" }}
                  >
                    {p.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-foreground">{p.name}</h4>
                    <p className="text-[10px] text-muted-foreground font-mono">{p.keyFormat}</p>
                  </div>
                  <a
                    href={p.docUrl}
                    target="_blank"
                    rel="noopener"
                    className="text-muted-foreground hover:text-primary transition-colors p-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{p.quickStart}</p>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {p.bestFor.map((tag) => (
                      <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary/50 text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/30">
                    <span>Auth: <span className="text-foreground font-medium">{p.authType}</span></span>
                    <span className="text-foreground font-medium">{p.pricing}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* General Integration Guide */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Integration Guide</h3>
          <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 sm:p-7 space-y-6">
            {[
              {
                step: "01",
                title: "Get Your API Key",
                desc: "Sign up on the provider's platform and generate an API key from their dashboard. Keep it secret — never expose it in client-side code.",
              },
              {
                step: "02",
                title: "Test Your Key",
                desc: "Use KeyPulse to validate your key instantly. We'll check authentication, permissions, and rate limits with a single click.",
              },
              {
                step: "03",
                title: "Copy Integration Code",
                desc: "After successful validation, grab the ready-to-use code snippet in Python, JavaScript, TypeScript, or cURL.",
              },
              {
                step: "04",
                title: "Use Environment Variables",
                desc: "Store your API key in environment variables (e.g., .env file). Never hardcode keys in source code that gets committed to repositories.",
              },
              {
                step: "05",
                title: "Handle Errors Gracefully",
                desc: "Implement retry logic for 429 (rate limit) errors, validate responses, and provide meaningful error messages to your users.",
              },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.06, duration: 0.3 }}
                className="flex gap-4"
              >
                <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary tabular-nums">{s.step}</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-0.5">{s.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Security Tips */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Security Best Practices</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: "Never Expose Keys", desc: "Use server-side proxies. Frontend code is always visible to users." },
              { title: "Rotate Regularly", desc: "Set reminders to rotate keys every 90 days. Revoke unused ones immediately." },
              { title: "Set Rate Limits", desc: "Configure spending caps and rate limits on your provider dashboard." },
            ].map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.06, duration: 0.3 }}
                className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4"
              >
                <h4 className="text-xs font-bold text-foreground mb-1">{tip.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{tip.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
