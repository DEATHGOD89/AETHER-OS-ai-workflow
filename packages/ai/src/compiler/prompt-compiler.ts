export interface PromptContextLayers {
  systemPrompt?: string;
  workspacePrompt?: string;
  projectPrompt?: string;
  agentPrompt?: string;
  userPrompt: string;
}

export class PromptCompiler {
  public static compile(layers: PromptContextLayers): string {
    const parts: string[] = [];

    if (layers.systemPrompt) {
      parts.push(`[SYSTEM CONTEXT]\n${layers.systemPrompt}`);
    }

    if (layers.workspacePrompt) {
      parts.push(`[WORKSPACE GUIDELINES]\n${layers.workspacePrompt}`);
    }

    if (layers.projectPrompt) {
      parts.push(`[PROJECT CONTEXT]\n${layers.projectPrompt}`);
    }

    if (layers.agentPrompt) {
      parts.push(`[AGENT INSTRUCTIONS]\n${layers.agentPrompt}`);
    }

    parts.push(`[USER REQUEST]\n${layers.userPrompt}`);

    return parts.join("\n\n---\n\n");
  }
}
