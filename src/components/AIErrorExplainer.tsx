import { Bot, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

const errorExplanations: Record<string, string> = {
  "Unauthorized": "Your API key may be incorrect or missing permissions. Double-check the key and ensure it hasn't been revoked.",
  "Forbidden": "Your API key doesn't have access to this resource. Check your account permissions or upgrade your plan.",
  "Too Many Requests": "You've hit the rate limit. Wait a moment and try again, or check your usage quota.",
  "Not Found": "The model or endpoint wasn't found. Make sure the model name is correct and available on your plan.",
  "Payment Required": "Your account has run out of credits. Add billing information or purchase more credits.",
  "Bad Request": "The request format was invalid. This might be a configuration issue — try a different model.",
  "Internal Server Error": "The provider's server encountered an error. This is usually temporary — try again in a few seconds.",
  "Service Unavailable": "The provider's service is temporarily down. Check their status page for updates.",
};

function getExplanation(error: string): string {
  // Check for exact matches first
  for (const [key, explanation] of Object.entries(errorExplanations)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return explanation;
    }
  }
  
  // Status code patterns
  if (error.includes("401") || error.includes("403")) {
    return errorExplanations["Unauthorized"];
  }
  if (error.includes("429")) {
    return errorExplanations["Too Many Requests"];
  }
  if (error.includes("404")) {
    return errorExplanations["Not Found"];
  }
  if (error.includes("402")) {
    return errorExplanations["Payment Required"];
  }
  if (error.includes("CORS") || error.includes("Failed to fetch")) {
    return "This provider blocks direct browser requests. You'll need a backend proxy to validate this key.";
  }
  
  return "An unexpected error occurred. Verify your API key is correct and try again.";
}

interface AIErrorExplainerProps {
  error: string;
}

export function AIErrorExplainer({ error }: AIErrorExplainerProps) {
  const explanation = getExplanation(error);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="rounded-xl border border-accent/20 bg-accent/5 p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
          <Bot className="w-3.5 h-3.5 text-accent" />
        </div>
        <span className="text-xs font-semibold text-accent uppercase tracking-wider">AI Analysis</span>
      </div>
      <div className="flex items-start gap-2">
        <Lightbulb className="w-3.5 h-3.5 text-accent/60 mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
      </div>
    </motion.div>
  );
}
