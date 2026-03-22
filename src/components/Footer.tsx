import { Shield, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/50 bg-card/30 backdrop-blur-sm py-6 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="font-medium text-foreground">KeyPulse</span>
          <span className="text-muted-foreground/50">·</span>
          <span>© {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-success/70">
          <Shield className="w-3 h-3" />
          We do NOT store your API keys
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
