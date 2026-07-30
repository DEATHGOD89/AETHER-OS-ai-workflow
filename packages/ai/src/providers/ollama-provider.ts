import { ChatMessage, StreamChatRequest } from "@aether/shared";
import { BaseAIProvider, AIProviderResponse } from "./abstract-provider";

export class OllamaProvider extends BaseAIProvider {
  name = "ollama";
  private baseUrl: string;

  constructor(host = "http://localhost:11434") {
    super();
    this.baseUrl = process.env.OLLAMA_HOST || host;
  }

  async complete(request: StreamChatRequest, messages: ChatMessage[]): Promise<AIProviderResponse> {
    const formattedMessages = [
      ...(request.systemPrompt ? [{ role: "system", content: request.systemPrompt }] : []),
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: request.prompt },
    ];

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: request.model || "qwen2.5-coder",
        messages: formattedMessages,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama local API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.message?.content || "",
      model: request.model,
    };
  }

  async stream(
    request: StreamChatRequest,
    messages: ChatMessage[],
    onChunk: (chunk: string) => void
  ): Promise<AIProviderResponse> {
    const formattedMessages = [
      ...(request.systemPrompt ? [{ role: "system", content: request.systemPrompt }] : []),
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: request.prompt },
    ];

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: request.model || "qwen2.5-coder",
        messages: formattedMessages,
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Ollama Local Stream error: ${response.status} ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunkText = decoder.decode(value, { stream: true });
      const lines = chunkText.split("\n").filter((l) => l.trim().length > 0);

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          const contentDelta = parsed.message?.content || "";
          if (contentDelta) {
            fullContent += contentDelta;
            onChunk(contentDelta);
          }
        } catch {
          // ignore stream parse errors
        }
      }
    }

    return {
      content: fullContent,
      model: request.model,
    };
  }
}
