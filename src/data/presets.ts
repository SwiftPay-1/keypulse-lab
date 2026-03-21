import { providers } from "./providers";

export interface QuickPreset {
  id: string;
  label: string;
  providerId: string;
  model: string;
  description: string;
}

export const quickPresets: QuickPreset[] = [
  { id: "openai-gpt", label: "OpenAI - GPT Test", providerId: "openai", model: "gpt-4o-mini", description: "Fast GPT-4o Mini test" },
  { id: "gemini-quick", label: "Gemini Quick Test", providerId: "google", model: "gemini-2.0-flash", description: "Google Gemini Flash" },
  { id: "groq-fast", label: "Groq Fast Test", providerId: "groq", model: "llama-3.1-8b-instant", description: "Ultra-fast Groq inference" },
  { id: "claude-test", label: "Claude Test", providerId: "anthropic", model: "claude-3-haiku-20240307", description: "Anthropic Claude Haiku" },
  { id: "deepseek-test", label: "DeepSeek Test", providerId: "deepseek", model: "deepseek-chat", description: "DeepSeek Chat model" },
];

export function getProviderFromPreset(preset: QuickPreset) {
  return providers.find((p) => p.id === preset.providerId) || null;
}
