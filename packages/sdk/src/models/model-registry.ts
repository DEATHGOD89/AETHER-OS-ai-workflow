export interface ModelConfig {
  id: string;
  name: string;
  provider: "openrouter" | "openai" | "anthropic" | "gemini" | "deepseek" | "ollama";
  contextWindow: number;
  inputCostPer1K: number; // in USD
  outputCostPer1K: number; // in USD
  isLocal: boolean;
  capabilities: ("text" | "code" | "vision" | "audio" | "tools")[];
}

export class ModelRegistry {
  private static instance: ModelRegistry;
  private models: Map<string, ModelConfig> = new Map();

  private constructor() {
    this.registerDefaults();
  }

  public static getInstance(): ModelRegistry {
    if (!ModelRegistry.instance) {
      ModelRegistry.instance = new ModelRegistry();
    }
    return ModelRegistry.instance;
  }

  public registerModel(config: ModelConfig) {
    this.models.set(config.id, config);
  }

  public getModel(id: string): ModelConfig | undefined {
    return this.models.get(id);
  }

  public listModels(provider?: string): ModelConfig[] {
    const list = Array.from(this.models.values());
    if (provider) return list.filter((m) => m.provider === provider);
    return list;
  }

  private registerDefaults() {
    this.registerModel({
      id: "anthropic/claude-3.5-sonnet",
      name: "Claude 3.5 Sonnet",
      provider: "anthropic",
      contextWindow: 200000,
      inputCostPer1K: 0.003,
      outputCostPer1K: 0.015,
      isLocal: false,
      capabilities: ["text", "code", "vision", "tools"],
    });

    this.registerModel({
      id: "deepseek/deepseek-r1",
      name: "DeepSeek R1",
      provider: "deepseek",
      contextWindow: 128000,
      inputCostPer1K: 0.00055,
      outputCostPer1K: 0.00219,
      isLocal: false,
      capabilities: ["text", "code", "tools"],
    });

    this.registerModel({
      id: "ollama/qwen2.5-coder",
      name: "Qwen 2.5 Coder (Local)",
      provider: "ollama",
      contextWindow: 32000,
      inputCostPer1K: 0,
      outputCostPer1K: 0,
      isLocal: true,
      capabilities: ["text", "code", "tools"],
    });
  }
}
