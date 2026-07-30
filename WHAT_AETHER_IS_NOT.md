# What Aether Is Not

> This document defines the boundaries of **Aether**. It serves as a filter for all future design, product, and engineering decisions to prevent scope creep and maintain platform focus.

---

## 🛑 What Aether Is NOT

1. **Aether is NOT just another chatbot**:
   - Aether is not a floating prompt box. Conversations only exist inside a Project Context with access to project files, RAG memory, and assets.

2. **Aether is NOT an AI model provider**:
   - Aether does not lock users into proprietary models. It acts as an Operating System routing requests across cloud and local Ollama models.

3. **Aether is NOT a collection of disconnected generators**:
   - Visual generators, code workbenches, and video tools DO NOT exist as isolated silos. Every output automatically becomes a versioned `Asset` inside the active project.

4. **Aether is NOT a file manager with AI attached**:
   - Storage and files are not passive folders. Every file feeds into the **Project Brain** and dynamic RAG vector store to inform AI decisions.

5. **Aether is NOT a wall of vanity metrics**:
   - Dashboards DO NOT display token counters or vanity charts that fail to drive action. Every metric must answer: *"What should I do next to complete this project?"*

---

## 🎯 What Aether IS

- **Aether IS a unified Project Workspace**:
  - One workspace where AI exists to help creators finish projects from Brief to Publication.
- **Aether IS a Project Intelligence Engine**:
  - Remembers all project files, history, assets, and decisions so the user never has to re-explain context.
