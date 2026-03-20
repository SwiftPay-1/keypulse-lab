import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const statusMessages = [
  "Connecting to API...",
  "Validating API key...",
  "Fetching response...",
];

export function TestStatusMessages({ active }: { active: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % statusMessages.length);
    }, 1400);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="h-6 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {active && (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs text-muted-foreground font-medium"
          >
            {statusMessages[index]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
