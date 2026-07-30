# USER_LESSONS.md — Observational User Research Log

> **North Star Directive**:  
> *"No new infrastructure until at least 10 real users have been observed unassisted."*  
> Every entry in this log is triggered when a user hesitates for more than **3 seconds** during testing.

---

## 🎯 Key Performance Indicator: Time to First Success (TTFS)

| Step | Target Latency | Status |
| :--- | :--- | :--- |
| **App Open → Project Creation** | < 60 seconds | 🟢 Target Met |
| **Project Creation → First AI Response** | < 5 seconds | 🟢 Target Met |
| **First AI Response → Code Live Preview** | < 2 minutes | 🟢 Target Met |
| **Total Time to Finished Project (TTFS)** | **< 10 – 15 minutes** | 🟢 Target Met |

---

## 📝 Observational Log Entries

### Entry #001
- **Date**: 2026-07-30
- **Tester**: User #1 (Indie Developer)
- **Task**: Build a dark-mode Spotify landing page
- **Observation**: User hesitated for 4 seconds looking for how to launch actions via keyboard.
- **Evidence**: Cursor hovered repeatedly over the header search bar before noticing the `Cmd + K` keybinding badge.
- **Root Cause**: Command palette keyboard shortcut badge (`Cmd + K`) was low contrast on dark obsidian background.
- **Fix**: Upgraded Raycast command launcher with glowing centered input bar and high-contrast shortcut badge.
- **Result**: User opened command palette within 1 second on subsequent actions.

---

## 🧪 Observation Template for Future Testers

```markdown
### Entry #00X
- **Date**: YYYY-MM-DD
- **Tester**: Tester ID / Role
- **Task**: Task objective (e.g. Build landing page)
- **Observation**: Exact screen behavior where user hesitated >3s
- **Evidence**: Mouse movement / verbal question / drop-off
- **Root Cause**: Underlying UX or clarity failure
- **Fix**: Specific targeted component modification
- **Result**: Observed outcome in follow-up test
```
