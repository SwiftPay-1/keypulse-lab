import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface CopyButtonProps {
  value: string;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export function CopyButton({ value, label = "Copy", size = "sm", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  const padding = size === "sm" ? "p-1.5" : "p-2";

  return (
    <button
      onClick={handleCopy}
      className={`rounded-lg ${padding} text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors ${className}`}
      title={label}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Check className={`${iconSize} text-success`} />
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Copy className={iconSize} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
