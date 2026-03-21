import { quickPresets, getProviderFromPreset, type QuickPreset } from "@/data/presets";
import { type Provider } from "@/data/providers";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

interface QuickPresetsProps {
  onSelect: (provider: Provider, model: string) => void;
}

export function QuickPresets({ onSelect }: QuickPresetsProps) {
  const handleSelect = (preset: QuickPreset) => {
    const provider = getProviderFromPreset(preset);
    if (provider) {
      onSelect(provider, preset.model);
    }
  };

  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider flex items-center gap-1.5">
        <Zap className="w-3 h-3" />
        Quick Presets
      </label>
      <div className="flex flex-wrap gap-2">
        {quickPresets.map((preset) => (
          <motion.button
            key={preset.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(preset)}
            className="px-3 py-1.5 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/40 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            title={preset.description}
          >
            {preset.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
