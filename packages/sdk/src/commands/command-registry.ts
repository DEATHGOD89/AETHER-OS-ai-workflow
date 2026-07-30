export interface SystemCommand {
  id: string;
  title: string;
  category: "AI" | "Developer" | "Creative" | "Automation" | "Memory" | "Deploy";
  description: string;
  shortcut?: string;
  action: (context?: any) => Promise<any> | void;
}

export class CommandRegistry {
  private static instance: CommandRegistry;
  private commands: Map<string, SystemCommand> = new Map();

  private constructor() {
    this.registerDefaults();
  }

  public static getInstance(): CommandRegistry {
    if (!CommandRegistry.instance) {
      CommandRegistry.instance = new CommandRegistry();
    }
    return CommandRegistry.instance;
  }

  public register(cmd: SystemCommand) {
    this.commands.set(cmd.id, cmd);
  }

  public getCommands(query?: string): SystemCommand[] {
    const all = Array.from(this.commands.values());
    if (!query || !query.trim()) return all;
    const q = query.toLowerCase();
    return all.filter(
      (c) => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }

  public async execute(id: string, context?: any) {
    const cmd = this.commands.get(id);
    if (!cmd) throw new Error(`Command ${id} not found in Aether registry.`);
    return await cmd.action(context);
  }

  private registerDefaults() {
    this.register({
      id: "ai.chat.new",
      title: "New AI Conversation",
      category: "AI",
      description: "Start a fresh multi-modal thread with active model",
      shortcut: "Ctrl+N",
      action: () => console.log("[CommandEngine] Triggered New Chat"),
    });

    this.register({
      id: "creative.image.flux",
      title: "Generate Image (FLUX.1)",
      category: "Creative",
      description: "Open visual studio with FLUX backend",
      action: () => console.log("[CommandEngine] Triggered FLUX Image Gen"),
    });

    this.register({
      id: "workflow.run.all",
      title: "Execute Project Workflow Pipeline",
      category: "Automation",
      description: "Trigger n8n background publish jobs",
      action: () => console.log("[CommandEngine] Triggered Workflow"),
    });
  }
}
