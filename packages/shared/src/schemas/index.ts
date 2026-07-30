import { z } from "zod";

export const AIProviderSchema = z.enum([
  "openrouter",
  "openai",
  "anthropic",
  "gemini",
  "deepseek",
  "ollama",
]);

export const ImageBackendSchema = z.enum([
  "FLUX",
  "COMFYUI",
  "A1111",
  "REPLICATE",
  "STABLE_DIFFUSION_XL",
]);

export const VideoBackendSchema = z.enum([
  "VEO",
  "KLING",
  "RUNWAY",
  "PIKA",
  "LUMA",
  "HAILUO",
]);

export const ChatMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(["system", "user", "assistant", "tool"]),
  content: z.string(),
  model: z.string().optional(),
  tokens: z.number().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().or(z.date()).optional(),
});

export const StreamChatRequestSchema = z.object({
  projectId: z.string(),
  chatId: z.string().optional(),
  model: z.string().default("claude-3-5-sonnet"),
  provider: AIProviderSchema.default("openrouter"),
  prompt: z.string().min(1, "Prompt cannot be empty"),
  systemPrompt: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
  attachedFileIds: z.array(z.string()).default([]),
  enableRAG: z.boolean().default(true),
});

export const ImageGenerationRequestSchema = z.object({
  projectId: z.string(),
  backend: ImageBackendSchema.default("FLUX"),
  prompt: z.string().min(1, "Prompt is required"),
  negativePrompt: z.string().optional(),
  width: z.number().int().positive().default(1024),
  height: z.number().int().positive().default(1024),
  aspectRatio: z.enum(["1:1", "16:9", "9:16", "4:3", "3:4"]).default("1:1"),
  steps: z.number().int().min(1).max(150).default(30),
  seed: z.number().int().optional(),
});

export const CreateProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional(),
  workspaceId: z.string(),
});

export const CreateWorkspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters"),
  organizationId: z.string(),
});
