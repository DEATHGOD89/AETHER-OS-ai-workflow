import { z } from "zod";
import {
  AIProviderSchema,
  ImageBackendSchema,
  VideoBackendSchema,
  ChatMessageSchema,
  StreamChatRequestSchema,
  ImageGenerationRequestSchema,
  CreateProjectSchema,
  CreateWorkspaceSchema,
} from "../schemas/index";

export type AIProvider = z.infer<typeof AIProviderSchema>;
export type ImageBackend = z.infer<typeof ImageBackendSchema>;
export type VideoBackend = z.infer<typeof VideoBackendSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type StreamChatRequest = z.infer<typeof StreamChatRequestSchema>;
export type ImageGenerationRequest = z.infer<typeof ImageGenerationRequestSchema>;
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;

export interface ProjectContext {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModelOption {
  id: string;
  name: string;
  provider: AIProvider;
  contextWindow: number;
  description: string;
  isLocal?: boolean;
}
