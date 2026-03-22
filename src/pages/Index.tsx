import { useState, useEffect } from "react";
import { LandingPage } from "@/components/LandingPage";
import { Dashboard } from "@/components/Dashboard";
import { SharedResultView } from "@/components/SharedResultView";
import { AnimatePresence, motion } from "framer-motion";

const Index = () => {
  const [view, setView] = useState<"landing" | "dashboard" | "shared">("landing");
  const [sharedData, setSharedData] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get("result");
    if (result) {
      try {
        const data = JSON.parse(atob(result));
        setSharedData(data);
        setView("shared");
      } catch {
        // Invalid share link, ignore
      }
    }
  }, []);

  const clearShared = () => {
    window.history.replaceState({}, "", window.location.pathname);
    setSharedData(null);
    setView("dashboard");
  };

  return (
    <AnimatePresence mode="wait">
      {view === "shared" && sharedData ? (
        <motion.div
          key="shared"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SharedResultView data={sharedData} onClose={clearShared} />
        </motion.div>
      ) : view === "landing" ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LandingPage onStart={() => setView("dashboard")} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Dashboard onBack={() => setView("landing")} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;
