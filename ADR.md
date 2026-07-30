# Architecture Decision Records (ADR)

> Concise log of major architectural and product decisions for **Aether — The Operating System for AI Creators**.

---

## ADR-001: Project-Centric Context Architecture
- **Date**: 2026-07-30
- **Status**: Accepted
- **Context**: AI creators currently switch between ChatGPT, Canva, Midjourney, and Cursor, resulting in fragmented context.
- **Decision**: Every chat conversation, code file, generated visual asset, prompt, agent, document, and automation workflow MUST be attached to a specific `ProjectId`.
- **Alternatives Considered**: Conversation-centric model (like ChatGPT).
- **Consequence**: Decisive advantage in context preservation; AI co-pilot has 100% project awareness.

---

## ADR-002: Modular Monolith vs. Early Microservices
- **Date**: 2026-07-30
- **Status**: Accepted
- **Context**: Managing microservices too early creates operational overhead and slows iteration.
- **Decision**: Adopt a `pnpm` + Turborepo modular monolith (`apps/web`, `apps/api`, `packages/*`). Services are split only when background performance dictates.
- **Alternatives Considered**: Multi-repo microservices with Kubernetes.
- **Consequence**: High developer velocity with clear package boundaries.

---

## ADR-003: Manifest-Driven Plugin Architecture
- **Date**: 2026-07-30
- **Status**: Accepted
- **Context**: Community and third-party integrations (GitHub, Notion, Canva, Spotify) must not pollute core application files.
- **Decision**: Third-party plugins register capabilities via `manifest.json`.
- **Alternatives Considered**: Modifying core routing and sidebar files directly.
- **Consequence**: Clean, non-invasive extensibility.
