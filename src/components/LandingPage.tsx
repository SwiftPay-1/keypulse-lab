import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Code2, Sparkles } from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="relative min-h-svh flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-4 max-w-3xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm px-4 py-1.5 mb-8 text-sm text-muted-foreground"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="font-medium text-foreground">KeyPulse</span>
          <span className="text-muted-foreground/50">·</span>
          <span>API Key Diagnostics</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          <span className="text-foreground">Test Your API Keys</span>
          <br />
          <span className="text-gradient-primary">Instantly.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg text-muted-foreground max-w-xl mb-10"
        >
          Check if your API keys are alive, diagnose issues, and get ready-to-use code snippets.
          No more <span className="text-destructive font-mono text-sm">401 Unauthorized</span> debugging loops.
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="group rounded-xl px-7 py-3.5 text-base font-semibold text-primary-foreground transition-shadow hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)]"
          style={{
            background: "linear-gradient(135deg, hsl(263.4, 70%, 50.4%), hsl(199, 89%, 48%))",
          }}
        >
          <span className="flex items-center gap-2">
            Start Testing
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </motion.button>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 w-full"
        >
          {[
            { icon: Zap, title: "Instant Validation", desc: "Test any provider in milliseconds" },
            { icon: Code2, title: "Code Snippets", desc: "Python, JS, TS & cURL ready" },
            { icon: Shield, title: "Secure by Design", desc: "Keys never stored or logged" },
          ].map((f, i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-5 text-left hover:border-primary/20 transition-colors group">
              <f.icon className="w-6 h-6 text-primary mb-3 group-hover:text-accent transition-colors" />
              <h3 className="font-semibold text-foreground text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
