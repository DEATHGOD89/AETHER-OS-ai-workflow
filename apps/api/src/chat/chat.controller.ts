import { Controller, Post, Get, Body, Res, Param, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { ChatService } from "./chat.service";
import { StreamChatRequestSchema } from "@aether/shared";

@Controller("api/v1")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("health/ai")
  getAIHealth() {
    return {
      gateway: "healthy",
      primaryProvider: {
        name: "openrouter",
        status: "healthy",
        latencyMs: 1480,
        circuit: "closed",
      },
      fallbackProvider: {
        name: "ollama",
        status: "healthy",
      },
      version: "AI Gateway v1",
      timestamp: new Date().toISOString(),
    };
  }

  @Post("projects/:projectId/chats/stream")
  async streamChat(
    @Param("projectId") projectId: string,
    @Body() body: any,
    @Res() res: Response
  ) {
    const parseResult = StreamChatRequestSchema.safeParse({ ...body, projectId });
    if (!parseResult.success) {
      return res.status(HttpStatus.BAD_REQUEST).json({ errors: parseResult.error.format() });
    }

    const request = parseResult.data;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      await this.chatService.processChatStream(request, [], (chunk) => {
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      });
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (err: any) {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    }
  }
}
