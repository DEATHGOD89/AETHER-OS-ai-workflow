import { ChatMessage, StreamChatRequest } from "@aether/shared";

export interface AIProviderResponse {
  content: string;
  tokensUsed?: number;
  model: string;
}

export abstract class BaseAIProvider {
  abstract name: string;
  
  abstract complete(request: StreamChatRequest, messages: ChatMessage[]): Promise<AIProviderResponse>;
  
  abstract stream(
    request: StreamChatRequest,
    messages: ChatMessage[],
    onChunk: (chunk: string) => void
  ): Promise<AIProviderResponse>;
}
