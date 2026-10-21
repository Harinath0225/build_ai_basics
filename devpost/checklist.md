---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. Studio Foundation, Scene Math & Lyricist Persona Expansion**
  Becomes usable: A running Go backend and React frontend where a creator can enter a story gist, select durations (e.g. 60s total, 6s scenes), and see the expanded narrative beats, lyricist rhymes, and calculated scene cards (10 scenes) unfold on screen.
  Why now: Bootstraps both environments inside a usable end-to-end slice, proving frontend-to-backend communication, scene duration calculations, and LLM expansion right away.
  PRD ref: `prd.md > Features and Behavior > 1. Duration Math` & `2. Idea Expansion & Lyricist Persona`
  Spec ref: `spec.md > Components > 1. Concept & Lyricist Studio Component`, `spec.md > Stack`
  Build: Scaffold `backend/` (Go module, HTTP server, `/api/expand` endpoint with mock/Gemini fallback) and `frontend/` (Vite, React, Tailwind, Framer Motion); implement Concept Studio and Lyricist Lounge components.
  Verify (mechanical): Start backend and frontend; trigger `POST /api/expand` with `{"story_gist":"cyberpunk detective", "total_duration":60, "scene_duration":6}` and assert HTTP 200 with 10 calculated scenes and expanded lyrics.
  Learner check: Open `http://localhost:5173`, enter a story gist, click "Expand & Direct", and verify the expanded lyrics and 10 scene cards unfold with smooth motion.
  Commit: `feat: bootstrap studio with scene math and lyricist expansion`

- [ ] **2. Character Sketch Anchor, StudioBinder Camera Director & Dance Steps**
  Becomes usable: Interactive scene timeline where each scene card displays a recommended StudioBinder camera angle (Dolly, Tracking, Crane, Low-Angle, etc.) and realistic human dance motion prompt; users can override camera angles and see prompt updates live.
  Why now: Establishes the visual identity anchor and cinematography controls before the continuity audit pass tests them for drift.
  PRD ref: `prd.md > Features and Behavior > 3. Character Sketch Anchor, Camera Director & Dance Choreography`
  Spec ref: `spec.md > Components > 2. Scene Timeline & Camera Director Component`
  Build: Implement Character DNA extraction, `/api/direct` endpoint, StudioBinder camera taxonomy, and dance step generator; add interactive dropdowns in React timeline cards.
  Verify (mechanical): Call `/api/direct`; verify response contains Character DNA anchor and StudioBinder shot types for all scenes; verify changing camera angle changes prompt output.
  Learner check: Change a scene's camera angle to "Dolly Shot" or toggle dance motion, and confirm the scene prompt updates immediately.
  Commit: `feat: add character anchor, StudioBinder camera angles, and dance steps`

- [ ] **3. Chroma DB Vector Memory & Autonomous Continuity Drift Auditor with Self-Patching Rules**
  Becomes usable: The core intelligence loop: clicking "Run Continuity Audit" runs semantic similarity analysis across scenes (via Chroma DB HTTP or local vector fallback), detects any character or lighting drift, logs the autonomous rule patch to persistent storage (`backend/data/rules.json`), and reloads active agent memory.
  Why now: Implements the unique kernel and your primary learning goal early, proving autonomous self-patching and persistent vector memory.
  PRD ref: `prd.md > Features and Behavior > 4. Autonomous Continuity Audit & Self-Patching Rules`
  Spec ref: `spec.md > Components > 3. Autonomous Continuity Auditor & Memory Inspector Component`, `spec.md > Stack`
  Build: Implement `backend/internal/agent/chroma.go` (Chroma HTTP client + local vector fallback), `continuity.go` (drift detector & rule patcher), and `backend/data/rules.json`; add React Continuity Audit panel with patch logs and verified green badges.
  Verify (mechanical): Run automated audit test simulating a clothing color drift; verify audit flags the conflict, appends a patch to `rules.json`, reloads in-memory rules, and returns 10/10 verified scenes.
  Learner check: Click "Run Continuity Audit" in the UI, watch the audit animation, and verify the patch event log and "Continuity Locked" emerald badges appear.
  Commit: `feat: implement Chroma vector memory, drift auditor, and autonomous rule patching`

- [ ] **4. Production Prompt Deck & 1-Click Clipboard Export**
  Becomes usable: Ready-to-use production prompt deck displaying formatted prompt cards for Google Veo and Suno, complete with 1-click clipboard copy triggers, copy-all bundle, and toast notifications.
  Why now: Completes the full user journey from raw story idea to copy-pasteable production assets ready for the demo video.
  PRD ref: `prd.md > Features and Behavior > 5. Production Prompt Deck & Clipboard Export`
  Spec ref: `spec.md > Components > 4. Production Prompt Deck Component`
  Build: Implement Prompt Deck component, 1-click clipboard copy utility with micro-interaction checkmarks, "Copy Full Production Deck" exporter, and sample pre-fill button.
  Verify (mechanical): Test clipboard payload formatting against Veo and Suno specifications; verify copy action triggers correct clipboard text and visual confirmation.
  Learner check: Click "Copy Veo Prompt" and "Copy Suno Prompt", paste into a text editor, and confirm the prompts are complete and formatted cleanly.
  Commit: `feat: add production prompt deck with 1-click clipboard export`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — Slice 2 (Timeline with Camera Angles & Dance Steps)
- [ ] Final kick-the-tires exploration and feedback completed — Slice 4 (Complete Studio with Prompt Deck)

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [to be recorded upon completion]
Route and stops: [to be recorded upon completion]
Edit outcome: [to be recorded upon completion]
Reflection: [to be recorded upon completion]
Activity mode: [to be recorded upon completion]

## Revisions
