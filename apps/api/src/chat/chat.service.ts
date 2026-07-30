import { Injectable } from "@nestjs/common";
import { AIRouter } from "@aether/ai";
import { StreamChatRequest, ChatMessage } from "@aether/shared";

@Injectable()
export class ChatService {
  private router = new AIRouter();

  async processChatStream(
    request: StreamChatRequest,
    history: ChatMessage[],
    onChunk: (chunk: string) => void
  ) {
    return this.router.executeStream(request, history, onChunk);
  }
}
