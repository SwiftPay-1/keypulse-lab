import { motion } from "framer-motion";

export function ResultSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-3.5 w-32 bg-muted rounded animate-pulse" />
          <div className="h-2.5 w-48 bg-muted/60 rounded animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-muted/40 rounded-lg p-3 space-y-2 animate-pulse">
            <div className="h-2 w-12 bg-muted rounded" />
            <div className="h-3 w-16 bg-muted/70 rounded" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
