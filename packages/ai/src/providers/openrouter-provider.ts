import OpenAI from "openai";
import { ChatMessage, StreamChatRequest } from "@aether/shared";
import { BaseAIProvider, AIProviderResponse } from "./abstract-provider";

export class OpenRouterProvider extends BaseAIProvider {
  name = "openrouter";
  private client: OpenAI;

  constructor(apiKey?: string) {
    super();
    const key = apiKey || process.env.OPENROUTER_API_KEY;
    if (!key) {
      throw new Error("OPENROUTER_API_KEY environment variable is not configured.");
    }

    this.client = new OpenAI({
      apiKey: key,
      baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://aether.ai",
        "X-Title": "Aether OS",
      },
    });
  }

  async complete(request: StreamChatRequest, messages: ChatMessage[]): Promise<AIProviderResponse> {
    const formattedMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      ...(request.systemPrompt ? [{ role: "system" as const, content: request.systemPrompt }] : []),
      ...messages.map((m) => ({ role: m.role as "user" | "assistant" | "system", content: m.content })),
      { role: "user" as const, content: request.prompt },
    ];

    const response = await this.client.chat.completions.create({
      model: request.model || "meta-llama/llama-3.3-70b-instruct:free",
      messages: formattedMessages,
      temperature: request.temperature || 0.7,
    });

    const content = response.choices[0]?.message?.content || "";
    return {
      content,
      tokensUsed: response.usage?.total_tokens,
      model: request.model,
    };
  }

  async stream(
    request: StreamChatRequest,
    messages: ChatMessage[],
    onChunk: (chunk: string) => void
  ): Promise<AIProviderResponse> {
    const formattedMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      ...(request.systemPrompt ? [{ role: "system" as const, content: request.systemPrompt }] : []),
      ...messages.map((m) => ({ role: m.role as "user" | "assistant" | "system", content: m.content })),
      { role: "user" as const, content: request.prompt },
    ];

    const stream = await this.client.chat.completions.create({
      model: request.model || "meta-llama/llama-3.3-70b-instruct:free",
      messages: formattedMessages,
      temperature: request.temperature || 0.7,
      stream: true,
    });

    let fullContent = "";

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || "";
      if (delta) {
        fullContent += delta;
        onChunk(delta);
      }
    }

    return {
      content: fullContent,
      model: request.model,
    };
  }
}
