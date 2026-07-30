# Aether Alpha QA & Release Gatekeeper Checklist

> Every release MUST pass 100% of these checks before being deployed to staging or production.

---

## 🛠️ 1. Functional QA Checklist
- [ ] **Authentication**: Login with Email / Google / GitHub OAuth works without page freeze.
- [ ] **Logout**: Session cleared, state reset, redirected cleanly to `/login`.
- [ ] **Workspace Creation**: Create workspace with valid name; handles empty name gracefully.
- [ ] **Workspace Deletion**: Delete workspace prompts for confirmation and cleans up project scoping.
- [ ] **Project Creation**: Create project via Conversational Brief Wizard.
- [ ] **Project Open**: Open project loads all files, assets, and project memory within 1 second.
- [ ] **File Upload**: Drag and drop single and batch files (PDF, PNG, TSX, Markdown) into project.
- [ ] **Image Generation**: Generate image via FLUX.1 / ComfyUI backend; asset saved to project gallery.
- [ ] **Code Workbench**: Edit file, syntax highlighting rendered, live preview iframe updates on change.
- [ ] **Universal Search**: Meilisearch query returns instant results across files, assets, and prompts.
- [ ] **Command Palette (`Cmd + K`)**: Every command fires correctly; Esc key closes palette cleanly.

---

## 🎨 2. Visual & Design System Checklist
- [ ] **Icon Alignment**: All Lucide SVGs stroke 1.75px, optically aligned, zero colored square background badges.
- [ ] **Spacing Consistency**: Strict adherence to 4px spacing scale (4px, 8px, 12px, 16px, 24px, 32px).
- [ ] **Border Radius**: 8px (`rounded-lg`) for buttons, 12px (`rounded-xl`) for panels, 16px (`rounded-2xl`) for modals.
- [ ] **Elevation & Depth**: Glass panels use `rgba(13, 17, 23, 0.85)` with `backdrop-blur(20px)` and subtle `rgba(255, 255, 255, 0.07)` borders.
- [ ] **Hover Physics**: Buttons and interactive cards transition smoothly without layout shifting.
- [ ] **Typography Hierarchy**: Distinct weights (`400` body, `500` medium labels, `600` bold headers).

---

## ⚡ 3. Performance & Console Checklist
- [ ] **Lighthouse Score**: Performance > 95, Accessibility > 95, Best Practices 100, SEO > 95.
- [ ] **React Warnings**: 0 React state or key warnings in console.
- [ ] **Hydration Warnings**: 0 hydration mismatch errors (`suppressHydrationWarning` active on root layout).
- [ ] **Memory Leaks**: Event listeners, WebSocket connections, and SSE stream readers disposed on unmount.
- [ ] **Console Hygiene**: 0 Errors, 0 Warnings in browser DevTools during core workflows.

---

## 🧪 4. Edge-Case & Stress Testing Protocol
1. **Empty Project Name**: Submit empty string -> triggers validation message instead of crash.
2. **Batch Upload**: Drag 50+ files simultaneously -> process asynchronously via queue without blocking UI.
3. **Mid-Generation Refresh**: Refresh browser while AI streaming -> connection closes gracefully; background job completes in BullMQ.
4. **Offline Mode**: Disconnect network -> offline status banner displayed; retries queued.
5. **API Timeout**: Simulate 504 gateway timeout -> error boundary displays graceful retry option.
6. **Invalid API Key**: Provide bad OpenRouter/Ollama key -> fallback provider takes over or displays clear setup prompt.
7. **Empty Prompt**: Press send on empty text -> send button disabled; no empty message appended.

---

## 👥 5. User Testing Protocol (3-Second Rule)
1. Find 5 real users/creators.
2. Give zero instructions. Simply say: *"Build a landing page for your idea."*
3. Watch silently.
4. Every time a user hesitates for more than **3 seconds**, immediately record the exact screen state and question into `USER_LESSONS.md`.
