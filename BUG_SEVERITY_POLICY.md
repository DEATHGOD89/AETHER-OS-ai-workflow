# Aether Alpha Bug Severity & SLA Policy

This document defines the bug severity classification and resolution SLAs for Aether Alpha development and public testing.

---

## 🚨 P0 — Critical (Blocks Workflow / Security / Data Loss)
- **Definition**: Complete block of Golden Workflow #1, data loss, NestJS backend boot crash, unthrottled API cost exposure, or security vulnerability.
- **Action**: Fix immediately. Blocks all releases and pull requests.
- **Examples**:
  - NestJS API Gateway fails to start in development/production.
  - Rate limiting missing on public streaming AI endpoints.
  - Payload validation missing on API controllers.

---

## ⚠️ P1 — High Priority (Major Frustration / Reliability Loss)
- **Definition**: Significant disruption to creator experience; loss of confidence during work.
- **Action**: Fix before next public Alpha cut.
- **Examples**:
  - Wi-Fi disconnect freezes UI without displaying offline banner.
  - Workspace edits do not autosave on browser close.
  - Key modal lacks focus trap or keyboard navigation controls.

---

## 🔷 P2 — Medium Priority (Noticeable Quality / Performance Issue)
- **Definition**: Non-blocking quality defect, visual misalignment, or performance regression.
- **Action**: Fix during stabilization sprint.
- **Examples**:
  - Live preview iframe missing strict `sandbox` isolation attributes.
  - Initial JS bundle > 100 kB.
  - Unstructured AI logging.

---

## 🔹 P3 — Low Priority (Polish & Visual Enhancements)
- **Definition**: Minor visual polish, spacing micro-adjustments, or non-critical edge cases.
- **Action**: Schedule when time permits.
- **Examples**:
  - Micro-animation timing adjustments.
  - Additional dark mode contrast tweaks.
