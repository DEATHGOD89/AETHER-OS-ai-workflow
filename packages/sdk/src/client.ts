import { StreamChatRequest, ImageGenerationRequest } from "@aether/shared";
import { CommandRegistry } from "./commands/command-registry";
import { ModelRegistry } from "./models/model-registry";
import { CostTracker } from "./cost/cost-tracker";

export class AetherSDK {
  public commands = CommandRegistry.getInstance();
  public models = ModelRegistry.getInstance();
  public cost = CostTracker.getInstance();
  private baseUrl: string;

  constructor(options?: { baseUrl?: string }) {
    this.baseUrl = options?.baseUrl || (typeof process !== "undefined" && process.env?.AETHER_API_URL) || "http://localhost:3001";
  }

  public chat = {
    send: async (request: StreamChatRequest, onChunk: (chunk: string) => void) => {
      const response = await fetch(
        `${this.baseUrl}/api/v1/projects/${request.projectId}/chats/stream`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error(`Aether SDK Chat Error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        onChunk(text);
      }
    },
  };

  public image = {
    generate: async (request: ImageGenerationRequest) => {
      const response = await fetch(
        `${this.baseUrl}/api/v1/projects/${request.projectId}/generation/image`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        throw new Error(`Aether SDK Image Gen Error: ${response.statusText}`);
      }

      return await response.json();
    },
  };
}

export const sdk = new AetherSDK();
