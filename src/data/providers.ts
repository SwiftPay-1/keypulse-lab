export interface Provider {
  id: string;
  name: string;
  icon: string;
  models: string[];
  baseUrl: string;
  keyPrefix?: string;
}

export const providers: Provider[] = [
  {
    id: "openai",
    name: "OpenAI",
    icon: "⚡",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo", "o1-preview", "o1-mini"],
    baseUrl: "https://api.openai.com/v1",
    keyPrefix: "sk-",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    icon: "🧠",
    models: ["claude-sonnet-4-20250514", "claude-3-5-haiku-20241022", "claude-3-opus-20240229", "claude-3-haiku-20240307"],
    baseUrl: "https://api.anthropic.com/v1",
    keyPrefix: "sk-ant-",
  },
  {
    id: "google",
    name: "Google Gemini",
    icon: "✨",
    models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-pro"],
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
  },
  {
    id: "groq",
    name: "Groq",
    icon: "🚀",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768", "gemma2-9b-it"],
    baseUrl: "https://api.groq.com/openai/v1",
    keyPrefix: "gsk_",
  },
  {
    id: "mistral",
    name: "Mistral",
    icon: "🌊",
    models: ["mistral-large-latest", "mistral-medium-latest", "mistral-small-latest", "open-mixtral-8x22b"],
    baseUrl: "https://api.mistral.ai/v1",
  },
  {
    id: "cohere",
    name: "Cohere",
    icon: "🔮",
    models: ["command-r-plus", "command-r", "command-light", "embed-english-v3.0"],
    baseUrl: "https://api.cohere.ai/v1",
  },
  {
    id: "together",
    name: "Together AI",
    icon: "🤝",
    models: ["meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo", "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", "mistralai/Mixtral-8x7B-Instruct-v0.1"],
    baseUrl: "https://api.together.xyz/v1",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    icon: "🔍",
    models: ["llama-3.1-sonar-huge-128k-online", "llama-3.1-sonar-large-128k-online", "llama-3.1-sonar-small-128k-online"],
    baseUrl: "https://api.perplexity.ai",
    keyPrefix: "pplx-",
  },
  {
    id: "xai",
    name: "xAI (Grok)",
    icon: "𝕏",
    models: ["grok-beta", "grok-2", "grok-2-mini"],
    baseUrl: "https://api.x.ai/v1",
    keyPrefix: "xai-",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    icon: "🐋",
    models: ["deepseek-chat", "deepseek-coder", "deepseek-reasoner"],
    baseUrl: "https://api.deepseek.com/v1",
    keyPrefix: "sk-",
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    icon: "🤗",
    models: ["meta-llama/Meta-Llama-3-70B-Instruct", "mistralai/Mistral-7B-Instruct-v0.2", "google/gemma-7b-it"],
    baseUrl: "https://api-inference.huggingface.co",
    keyPrefix: "hf_",
  },
  {
    id: "replicate",
    name: "Replicate",
    icon: "🔄",
    models: ["meta/meta-llama-3-70b-instruct", "stability-ai/sdxl", "openai/whisper"],
    baseUrl: "https://api.replicate.com/v1",
    keyPrefix: "r8_",
  },
  {
    id: "fireworks",
    name: "Fireworks AI",
    icon: "🎆",
    models: ["accounts/fireworks/models/llama-v3p1-405b-instruct", "accounts/fireworks/models/mixtral-8x22b-instruct"],
    baseUrl: "https://api.fireworks.ai/inference/v1",
  },
  {
    id: "azure",
    name: "Azure OpenAI",
    icon: "☁️",
    models: ["gpt-4o", "gpt-4-turbo", "gpt-35-turbo"],
    baseUrl: "https://{resource}.openai.azure.com",
  },
  {
    id: "bedrock",
    name: "AWS Bedrock",
    icon: "🏔️",
    models: ["anthropic.claude-3-sonnet", "amazon.titan-text-express-v1", "meta.llama3-70b-instruct-v1"],
    baseUrl: "https://bedrock-runtime.{region}.amazonaws.com",
  },
];

export function maskApiKey(key: string): string {
  if (key.length <= 8) return "****";
  return key.slice(0, 6) + "****" + key.slice(-4);
}

export function generateCodeSnippets(provider: Provider, model: string, apiKey: string) {
  const masked = maskApiKey(apiKey);
  
  const python = `import requests

url = "${provider.baseUrl}/chat/completions"
headers = {
    "Authorization": "Bearer ${masked}",
    "Content-Type": "application/json"
}
data = {
    "model": "${model}",
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 100
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`;

  const javascript = `const response = await fetch("${provider.baseUrl}/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${masked}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "${model}",
    messages: [{ role: "user", content: "Hello!" }],
    max_tokens: 100,
  }),
});

const data = await response.json();
console.log(data);`;

  const typescript = `interface ChatResponse {
  choices: { message: { content: string } }[];
}

const response = await fetch("${provider.baseUrl}/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${masked}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "${model}",
    messages: [{ role: "user", content: "Hello!" }],
    max_tokens: 100,
  }),
});

const data: ChatResponse = await response.json();
console.log(data.choices[0].message.content);`;

  const curl = `curl -X POST "${provider.baseUrl}/chat/completions" \\
  -H "Authorization: Bearer ${masked}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 100
  }'`;

  return { python, javascript, typescript, curl };
}
