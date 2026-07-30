# AI Gateway v1 API Freeze & Observability Specification

> **API Version**: `v1.0.0`  
> **Status**: Frozen for Public Alpha / Beta Release

---

## 🎯 Architecture & Resilience Guarantees

### 1. Request Correlation IDs (`air_req_...`)
Every AI execution is tagged with a unique tracing Correlation ID (`air_req_<timestamp>_<hash>`) that propagates through:
`Frontend Studio UI` → `NestJS API Controller` → `AIRouter v1` → `Provider SDK` → `Structured Telemetry Log`.

---

## ⚡ 2. Circuit Breaker Specification
- **Failure Threshold**: `5` consecutive provider failures (e.g. 5xx status or network timeout).
- **Circuit State**: `OPEN` for `60` seconds cooldown.
- **Degradation Policy**: Automatically routes 100% of incoming prompt completions to the local **Ollama** instance (`qwen2.5-coder`) during the cooldown window without throwing user-facing 500 errors.
- **Recovery Policy**: After 60 seconds, circuit switches to `HALF-OPEN` mode to probe primary provider health.

---

## 📊 3. Structured JSON Telemetry Schema
Every completed or degraded AI stream emits an immutable JSON log record:

```json
{
  "type": "AI_TELEMETRY",
  "correlationId": "air_req_1740000000000_a1b2c3",
  "provider": "openrouter",
  "model": "meta-llama/llama-3.3-70b-instruct:free",
  "latencyMs": 1640,
  "promptTokens": 932,
  "completionTokens": 518,
  "totalTokens": 1450,
  "estimatedCost": 0,
  "fallbackTriggered": false,
  "circuitOpen": false,
  "timestamp": "2026-07-30T15:14:00.000Z"
}
```

---

## 🔒 4. Frozen API Contract Guardrails
- **No Incompatible Signatures**: Future model or provider additions MUST implement `BaseAIProvider` without altering `AIRouter.executeStream(request, messages, onChunk)`.
- **Backward Compatibility**: If breaking changes are required, introduce `AIRouterV2` alongside `v1`.
