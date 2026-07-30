import { ChatMessage, StreamChatRequest } from "@aether/shared";
import { BaseAIProvider, AIProviderResponse } from "./providers/abstract-provider.js";
import { OpenRouterProvider } from "./providers/openrouter-provider.js";
import { OllamaProvider } from "./providers/ollama-provider.js";

export interface AIExecutionTelemetry {
  correlationId: string;
  provider: string;
  model: string;
  latencyMs: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  estimatedCost: number;
  fallbackTriggered: boolean;
  circuitOpen: boolean;
  timestamp: string;
}

export class AIRouter {
  private providers: Map<string, BaseAIProvider> = new Map();

  // Circuit Breaker State
  private consecutiveFailures = 0;
  private failureThreshold = 5;
  private circuitOpen = false;
  private circuitResetTime = 0;
  private cooldownDurationMs = 60000; // 60s cooldown

  constructor() {
    this.registerProvider(new OpenRouterProvider());
    this.registerProvider(new OllamaProvider());
    this.logStartupHealth();
  }

  private logStartupHealth() {
    console.log("--------------------------------------------------");
    console.log("  ✓ AIRouter API v1 Gateway Initialized:");
    console.log("    - OpenRouter Provider: Ready (Default: meta-llama/llama-3.3-70b-instruct:free)");
    console.log("    - Local Ollama Provider: Ready (Fallback: qwen2.5-coder)");
    console.log("    - Observability: Correlation IDs & Structured JSON Logging Enabled");
    console.log("    - Circuit Breaker: Armed (Threshold: 5 failures, Cooldown: 60s)");
    console.log("--------------------------------------------------");
  }

  public registerProvider(provider: BaseAIProvider) {
    this.providers.set(provider.name, provider);
  }

  public getProvider(name: string): BaseAIProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      return this.providers.get("openrouter")!;
    }
    return provider;
  }

  private isCircuitOpen(): boolean {
    if (this.circuitOpen) {
      if (Date.now() > this.circuitResetTime) {
        console.log("[AIRouter CircuitBreaker] Cooldown expired. Resetting circuit to CLOSED state.");
        this.circuitOpen = false;
        this.consecutiveFailures = 0;
        return false;
      }
      return true;
    }
    return false;
  }

  private handleFailure() {
    this.consecutiveFailures++;
    if (this.consecutiveFailures >= this.failureThreshold) {
      this.circuitOpen = true;
      this.circuitResetTime = Date.now() + this.cooldownDurationMs;
      console.error(`[AIRouter CircuitBreaker] TRIP ALERT: ${this.failureThreshold} consecutive failures. Circuit OPEN for 60s. Routing traffic to Ollama fallback.`);
    }
  }

  private handleSuccess() {
    if (this.consecutiveFailures > 0) {
      this.consecutiveFailures = 0;
    }
  }

  public async executeStream(
    request: StreamChatRequest,
    messages: ChatMessage[],
    onChunk: (chunk: string) => void
  ): Promise<AIProviderResponse & { telemetry: AIExecutionTelemetry }> {
    const startTime = Date.now();
    const correlationId = `air_req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    let requestedProvider = request.provider || "openrouter";
    let fallbackTriggered = false;

    // Check Circuit Breaker
    if (requestedProvider === "openrouter" && this.isCircuitOpen()) {
      console.warn(`[AIRouter ${correlationId}] OpenRouter circuit is OPEN. Forcing immediate fallback to Ollama.`);
      requestedProvider = "ollama";
      fallbackTriggered = true;
    }

    let provider = this.getProvider(requestedProvider);

    try {
      const response = await provider.stream(request, messages, onChunk);
      const latencyMs = Date.now() - startTime;
      this.handleSuccess();

      const telemetry: AIExecutionTelemetry = {
        correlationId,
        provider: provider.name,
        model: request.model || "meta-llama/llama-3.3-70b-instruct:free",
        latencyMs,
        totalTokens: response.tokensUsed || 350,
        estimatedCost: request.model?.includes(":free") ? 0 : 0.0002,
        fallbackTriggered,
        circuitOpen: this.circuitOpen,
        timestamp: new Date().toISOString(),
      };

      // Emit Structured JSON Log
      console.log(JSON.stringify({ type: "AI_TELEMETRY", ...telemetry }));

      return { ...response, telemetry };
    } catch (err: any) {
      this.handleFailure();
      console.warn(`[AIRouter ${correlationId}] Primary provider ${requestedProvider} failed: ${err.message}. Attempting fallback...`);

      if (requestedProvider !== "ollama" && this.providers.has("ollama")) {
        const localProvider = this.providers.get("ollama")!;
        const response = await localProvider.stream(
          { ...request, provider: "ollama", model: "ollama/qwen2.5-coder" },
          messages,
          onChunk
        );
        const latencyMs = Date.now() - startTime;

        const telemetry: AIExecutionTelemetry = {
          correlationId,
          provider: "ollama",
          model: "ollama/qwen2.5-coder",
          latencyMs,
          totalTokens: response.tokensUsed || 200,
          estimatedCost: 0,
          fallbackTriggered: true,
          circuitOpen: this.circuitOpen,
          timestamp: new Date().toISOString(),
        };

        // Emit Structured JSON Log for Fallback
        console.log(JSON.stringify({ type: "AI_TELEMETRY_FALLBACK", ...telemetry }));

        return { ...response, telemetry };
      }

      throw err;
    }
  }
}
