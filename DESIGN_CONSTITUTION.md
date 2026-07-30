# Aether Design Constitution

> The non-negotiable rules and principles governing all code, features, UI/UX, and AI operations within **Aether — The Operating System for AI Creators**.

---

## 📜 Core Principles

1. **Everything Lives Inside a Project Context**:
   - Every chat conversation, code file, generated visual asset, prompt, agent, document, and automation workflow MUST be attached to a specific `ProjectId`.
   - Disconnected, global floating items are strictly forbidden.

2. **One Workspace Layout (No Disconnected Pages)**:
   - Stop thinking in separate pages (Chat Page, Image Page, Video Page). Everything exists inside ONE unified workspace (like Cursor, Figma, or Photoshop).
   - Panels (Explorer, Canvas, Code, Chat, Preview, Inspector) update live in place.

3. **Invisible AI (Action → Result)**:
   - The UI MUST NOT constantly remind users they are using AI. Focus on seamless interaction: Drag-and-drop assets into chat, right-click context menus (*Improve*, *Upscale*, *Animate*, *Deploy*). No unnecessary AI branding clutter.

4. **Goal-Oriented User Experience**:
   - Expose user goals (**Create**, **Improve**, **Publish**, **Research**) rather than underlying technical implementation details (ComfyUI, BullMQ, OpenRouter).

5. **Command Palette First (`Cmd + K`)**:
   - Every system action, tool execution, model switch, workflow run, and project navigation MUST be triggerable via the universal Command Palette.

6. **Single Pipeline AI Execution**:
   - Every AI request MUST pass through the unified `PromptCompiler` (`System + Workspace + Project + Agent + User`) and `CapabilityRouter`.

7. **Universal Polymorphic Asset Graph**:
   - Every item created or uploaded (Image, Video, Document, Code, Prompt, Workflow, Agent) MUST be registered as an `Asset` node with relational metadata edges.

8. **Immutable Asset Versioning**:
   - All prompts, workflows, agents, templates, and code files MUST preserve version history (`v1`, `v2`, `v3`).

9. **Non-Blocking Asynchronous Background Tasks**:
   - Long-running operations MUST run asynchronously via the background event queue (BullMQ/RabbitMQ). The workspace UI must remain fluid.

10. **Manifest-Driven Extensions**:
    - Plugins extend the platform via clean `manifest.json` contracts without modifying core codebase files.

11. **Workspace Justification Rule**:
    - Every new feature MUST justify its place in the Workspace. If it does not improve the core project workflow or reduce context switching, it DOES NOT belong in the product.

---

## ⚡ Performance Budget & Quality Rules

- **Page Load**: Initial load < 2.0s on average broadband.
- **Interactivity**: 120 FPS animations, zero layout shifts, skeleton loading states.
- **AI Streaming**: Stream initiation < 1.0s.
- **Route Transitions**: Instantaneous in-workspace panel switching.
