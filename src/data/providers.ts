export interface Provider {
  id: string;
  name: string;
  icon: string; // emoji fallback
  logo?: string; // path to logo SVG
  brandColor: string; // for fallback avatar
  models: string[];
  baseUrl: string;
  keyPrefix?: string;
  authHeader?: string; // custom auth header name
  authStyle?: "bearer" | "query" | "x-api-key"; // how to pass the key
  testEndpoint?: string; // endpoint to test the key
  testMethod?: "GET" | "POST";
  testBody?: Record<string, unknown>;
}

export const providers: Provider[] = [
  {
    id: "openai",
    name: "OpenAI",
    icon: "⚡",
    logo: "/logos/openai.svg",
    brandColor: "#10a37f",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo", "o1-preview", "o1-mini"],
    baseUrl: "https://api.openai.com/v1",
    keyPrefix: "sk-",
    authStyle: "bearer",
    testEndpoint: "/models",
    testMethod: "GET",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    icon: "🧠",
    logo: "/logos/anthropic.svg",
    brandColor: "#d97757",
    models: ["claude-sonnet-4-20250514", "claude-3-5-haiku-20241022", "claude-3-opus-20240229", "claude-3-haiku-20240307"],
    baseUrl: "https://api.anthropic.com/v1",
    keyPrefix: "sk-ant-",
    authStyle: "x-api-key",
    testEndpoint: "/messages",
    testMethod: "POST",
    testBody: {
      model: "claude-3-haiku-20240307",
      max_tokens: 1,
      messages: [{ role: "user", content: "hi" }],
    },
  },
  {
    id: "google",
    name: "Google Gemini",
    icon: "✨",
    logo: "/logos/google.svg",
    brandColor: "#4285f4",
    models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-pro"],
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    authStyle: "query",
    testEndpoint: "/models",
    testMethod: "GET",
  },
  {
    id: "groq",
    name: "Groq",
    icon: "🚀",
    brandColor: "#f55036",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768", "gemma2-9b-it"],
    baseUrl: "https://api.groq.com/openai/v1",
    keyPrefix: "gsk_",
    authStyle: "bearer",
    testEndpoint: "/models",
    testMethod: "GET",
  },
  {
    id: "mistral",
    name: "Mistral",
    icon: "🌊",
    brandColor: "#ff7000",
    models: ["mistral-large-latest", "mistral-medium-latest", "mistral-small-latest", "open-mixtral-8x22b"],
    baseUrl: "https://api.mistral.ai/v1",
    authStyle: "bearer",
    testEndpoint: "/models",
    testMethod: "GET",
  },
  {
    id: "cohere",
    name: "Cohere",
    icon: "🔮",
    brandColor: "#39594d",
    models: ["command-r-plus", "command-r", "command-light", "embed-english-v3.0"],
    baseUrl: "https://api.cohere.ai/v1",
    authStyle: "bearer",
    testEndpoint: "/models",
    testMethod: "GET",
  },
  {
    id: "together",
    name: "Together AI",
    icon: "🤝",
    brandColor: "#0f6fff",
    models: ["meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo", "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", "mistralai/Mixtral-8x7B-Instruct-v0.1"],
    baseUrl: "https://api.together.xyz/v1",
    authStyle: "bearer",
    testEndpoint: "/models",
    testMethod: "GET",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    icon: "🔍",
    logo: "/logos/perplexity.svg",
    brandColor: "#20808d",
    models: ["llama-3.1-sonar-huge-128k-online", "llama-3.1-sonar-large-128k-online", "llama-3.1-sonar-small-128k-online"],
    baseUrl: "https://api.perplexity.ai",
    keyPrefix: "pplx-",
    authStyle: "bearer",
    testEndpoint: "/chat/completions",
    testMethod: "POST",
    testBody: {
      model: "llama-3.1-sonar-small-128k-online",
      messages: [{ role: "user", content: "hi" }],
      max_tokens: 1,
    },
  },
  {
    id: "xai",
    name: "xAI (Grok)",
    icon: "𝕏",
    logo: "/logos/xai.svg",
    brandColor: "#000000",
    models: ["grok-beta", "grok-2", "grok-2-mini"],
    baseUrl: "https://api.x.ai/v1",
    keyPrefix: "xai-",
    authStyle: "bearer",
    testEndpoint: "/models",
    testMethod: "GET",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    icon: "🐋",
    brandColor: "#4d6bfe",
    models: ["deepseek-chat", "deepseek-coder", "deepseek-reasoner"],
    baseUrl: "https://api.deepseek.com/v1",
    keyPrefix: "sk-",
    authStyle: "bearer",
    testEndpoint: "/models",
    testMethod: "GET",
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    icon: "🤗",
    logo: "/logos/huggingface.svg",
    brandColor: "#ffbd45",
    models: ["meta-llama/Meta-Llama-3-70B-Instruct", "mistralai/Mistral-7B-Instruct-v0.2", "google/gemma-7b-it"],
    baseUrl: "https://api-inference.huggingface.co",
    keyPrefix: "hf_",
    authStyle: "bearer",
    testEndpoint: "/api/whoami",
    testMethod: "GET",
  },
  {
    id: "replicate",
    name: "Replicate",
    icon: "🔄",
    logo: "/logos/replicate.svg",
    brandColor: "#3d3d3d",
    models: ["meta/meta-llama-3-70b-instruct", "stability-ai/sdxl", "openai/whisper"],
    baseUrl: "https://api.replicate.com/v1",
    keyPrefix: "r8_",
    authStyle: "bearer",
    testEndpoint: "/models",
    testMethod: "GET",
  },
  {
    id: "fireworks",
    name: "Fireworks AI",
    icon: "🎆",
    brandColor: "#6c3bef",
    models: ["accounts/fireworks/models/llama-v3p1-405b-instruct", "accounts/fireworks/models/mixtral-8x22b-instruct"],
    baseUrl: "https://api.fireworks.ai/inference/v1",
    authStyle: "bearer",
    testEndpoint: "/models",
    testMethod: "GET",
  },
  {
    id: "azure",
    name: "Azure OpenAI",
    icon: "☁️",
    brandColor: "#0078d4",
    models: ["gpt-4o", "gpt-4-turbo", "gpt-35-turbo"],
    baseUrl: "https://{resource}.openai.azure.com",
    authStyle: "bearer",
  },
  {
    id: "bedrock",
    name: "AWS Bedrock",
    icon: "🏔️",
    brandColor: "#ff9900",
    models: ["anthropic.claude-3-sonnet", "amazon.titan-text-express-v1", "meta.llama3-70b-instruct-v1"],
    baseUrl: "https://bedrock-runtime.{region}.amazonaws.com",
  },
];

export function maskApiKey(key: string): string {
  if (key.length <= 8) return "****";
  return key.slice(0, 6) + "****" + key.slice(-4);
}

export async function validateApiKey(
  provider: Provider,
  apiKey: string,
  model?: string
): Promise<{ success: boolean; responseTime: number; error?: string; errorType?: string; statusCode?: number }> {
  const startTime = performance.now();

  if (!provider.testEndpoint) {
    return {
      success: false,
      responseTime: 0,
      error: `${provider.name} does not support direct browser validation. The key format looks valid.`,
      errorType: "unsupported",
    };
  }

  try {
    let url = provider.baseUrl + provider.testEndpoint;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (provider.authStyle === "bearer") {
      headers["Authorization"] = `Bearer ${apiKey}`;
    } else if (provider.authStyle === "x-api-key") {
      headers["x-api-key"] = apiKey;
      headers["anthropic-version"] = "2023-06-01";
      headers["anthropic-dangerous-direct-browser-access"] = "true";
    } else if (provider.authStyle === "query") {
      url += (url.includes("?") ? "&" : "?") + `key=${apiKey}`;
    }

    // For Hugging Face, the base URL for whoami is different
    if (provider.id === "huggingface") {
      url = "https://huggingface.co/api/whoami";
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const fetchOptions: RequestInit = {
      method: provider.testMethod || "GET",
      headers,
    };

    if (provider.testMethod === "POST" && provider.testBody) {
      const body = { ...provider.testBody };
      if (model && body.model) {
        body.model = model;
      }
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    const responseTime = Math.round(performance.now() - startTime);

    if (response.ok || response.status === 200 || response.status === 201) {
      return { success: true, responseTime, statusCode: response.status };
    }

    // Parse error
    let errorMessage = `HTTP ${response.status}`;
    let errorType = "unknown";

    try {
      const errorData = await response.json();
      errorMessage = errorData?.error?.message || errorData?.message || errorData?.detail || JSON.stringify(errorData).slice(0, 200);
    } catch {
      errorMessage = await response.text().catch(() => `HTTP ${response.status}`);
    }

    if (response.status === 401 || response.status === 403) {
      errorType = "invalid_key";
    } else if (response.status === 429) {
      errorType = "no_credits";
    } else if (response.status === 404) {
      errorType = "wrong_model";
    } else if (response.status === 402) {
      errorType = "no_credits";
    }

    return { success: false, responseTime, error: errorMessage, errorType, statusCode: response.status };
  } catch (err) {
    const responseTime = Math.round(performance.now() - startTime);
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("Failed to fetch") || message.includes("NetworkError") || message.includes("CORS")) {
      return {
        success: false,
        responseTime,
        error: `CORS blocked: ${provider.name} doesn't allow direct browser requests. Try using a backend proxy.`,
        errorType: "cors",
      };
    }

    return { success: false, responseTime, error: message, errorType: "unknown" };
  }
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
