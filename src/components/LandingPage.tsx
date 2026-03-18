import { motion } from "framer-motion";
import { AnimatedBackground } from "./AnimatedBackground";
import { FloatingElements } from "./FloatingElements";
import { ArrowRight, Shield, Zap, Code2 } from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="relative min-h-svh flex flex-col items-center justify-center overflow-hidden bg-mesh">
      <AnimatedBackground />
      <FloatingElements />

      <div className="relative z-10 flex flex-col items-center px-4 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-full px-4 py-1.5 mb-8 text-sm text-muted-foreground"
        >
          <span className="text-gradient-primary font-semibold">KeyPulse</span>
          <span className="mx-2">·</span>
          API Key Diagnostics
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight text-gradient leading-[1.1] mb-6"
        >
          Test Your API Keys
          <br />
          <span className="text-gradient-primary">Instantly.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12"
        >
          Check if your API keys are alive, diagnose issues, and get ready-to-use code snippets.
          No more <span className="text-destructive font-mono text-base">401 Unauthorized</span> debugging loops.
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="group relative rounded-2xl px-8 py-4 text-lg font-semibold text-primary-foreground overflow-hidden border-glow"
          style={{
            background: "linear-gradient(135deg, hsl(263.4, 70%, 50.4%), hsl(199, 89%, 48%))",
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            Start Testing
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.button>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 w-full"
        >
          {[
            { icon: Zap, title: "Instant Validation", desc: "Test any provider in milliseconds" },
            { icon: Code2, title: "Code Snippets", desc: "Python, JS, TS & cURL ready" },
            { icon: Shield, title: "Secure by Design", desc: "Keys never stored or logged" },
          ].map((f, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-left hover:border-primary/30 transition-colors">
              <f.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
