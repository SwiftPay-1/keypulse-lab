import { useState, useRef, useEffect } from "react";
import { providers, type Provider } from "@/data/providers";
import { Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProviderSelectorProps {
  selected: Provider | null;
  onSelect: (provider: Provider) => void;
}

export function ProviderSelector({ selected, onSelect }: ProviderSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = providers.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full glass-strong rounded-xl px-4 py-3 flex items-center justify-between text-left hover:border-primary/30 transition-colors"
      >
        <span className="flex items-center gap-3">
          {selected ? (
            <>
              <span className="text-xl">{selected.icon}</span>
              <span className="text-foreground font-medium">{selected.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Select a provider...</span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 glass-strong rounded-xl overflow-hidden"
          >
            <div className="p-2 border-b border-border/50">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search providers..."
                  className="bg-transparent text-foreground text-sm outline-none w-full placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto p-1">
              {filtered.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => {
                    onSelect(provider);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    selected?.id === provider.id
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <span className="text-lg">{provider.icon}</span>
                  <span className="text-sm font-medium">{provider.name}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-3 py-4 text-sm text-muted-foreground text-center">No providers found</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
