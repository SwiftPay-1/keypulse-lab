import { useState } from "react";
import { Download, Share2, FileJson, FileText, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ExportData {
  provider: string;
  model: string;
  success: boolean;
  responseTime: number;
  statusCode?: number;
  error?: string;
  timestamp: string;
}

interface ExportShareButtonsProps {
  data: ExportData;
}

export function ExportShareButtons({ data }: ExportShareButtonsProps) {
  const [showExport, setShowExport] = useState(false);
  const [shared, setShared] = useState(false);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `keypulse-${data.provider}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as JSON");
    setShowExport(false);
  };

  const exportTXT = () => {
    const lines = [
      `KeyPulse Test Result`,
      `====================`,
      `Provider: ${data.provider}`,
      `Model: ${data.model}`,
      `Status: ${data.success ? "✅ Success" : "❌ Failed"}`,
      `Response Time: ${data.responseTime}ms`,
      data.statusCode ? `HTTP Status: ${data.statusCode}` : "",
      data.error ? `Error: ${data.error}` : "",
      `Tested: ${data.timestamp}`,
    ].filter(Boolean).join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `keypulse-${data.provider}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as TXT");
    setShowExport(false);
  };

  const shareResult = () => {
    const encoded = btoa(JSON.stringify(data));
    const url = `${window.location.origin}?result=${encoded}`;
    navigator.clipboard.writeText(url);
    setShared(true);
    toast.success("Share link copied to clipboard!");
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="flex items-center gap-1.5">
      {/* Share */}
      <button
        onClick={shareResult}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        title="Share result"
      >
        {shared ? <Check className="w-3.5 h-3.5 text-success" /> : <Share2 className="w-3.5 h-3.5" />}
        Share
      </button>

      {/* Export */}
      <div className="relative">
        <button
          onClick={() => setShowExport(!showExport)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          title="Export result"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
        <AnimatePresence>
          {showExport && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              className="absolute right-0 top-full mt-1 z-50 rounded-lg border border-border/50 bg-card shadow-xl overflow-hidden min-w-[140px]"
            >
              <button onClick={exportJSON} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-secondary/50 transition-colors">
                <FileJson className="w-3.5 h-3.5 text-accent" />
                Export JSON
              </button>
              <button onClick={exportTXT} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-secondary/50 transition-colors">
                <FileText className="w-3.5 h-3.5 text-primary" />
                Export TXT
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
