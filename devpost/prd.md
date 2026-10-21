---
doc: prd
status: approved
---

# ContinuityStudio — Product Requirements

A single-page, progressive AI multimedia production studio where creators expand story ideas, compose lyrics with a lyricist persona, generate mathematically paced scene prompts with smart camera angles, and autonomously audit and patch multi-scene continuity rules for Google Veo and Suno.
Source: `scope.md > ContinuityStudio: Multi-Scene Continuity Workflow Agent`

## The Core Journey
1. **Arrival & Project Setup:** The creator arrives at a sleek, single-page studio dashboard. They enter a core story or rhyme idea, pick total video duration (e.g., 60s), choose scene chunk length (6s, 8s, or 10s), and specify the visual style and music genre.
2. **Concept Expansion & Lyricist Lounge:** With one click, the agent expands the gist into a rich narrative premise and invokes a Lyricist persona to write synchronized lyrics or rhythmic narration alongside a Suno audio style prompt.
3. **Character Sketch & Director Timeline:** The agent extracts and anchors the protagonist's persistent visual traits (costume, hair, physical build) and lighting style. It calculates the exact scene split (e.g., 60s ÷ 6s = 10 scenes) and populates a visual timeline where each scene features an AI-suggested camera angle (Wide Establishing, Low-Angle Hero, Dynamic Tracking, Close-up) that the user can manually customize.
4. **Autonomous Continuity Audit & Rule Patching:** The agent runs an automated consistency audit across all scene prompts. If drift is detected (e.g., mismatched lighting or costume discrepancy), the agent highlights the drift, patches its persistent continuity rules, and updates the prompt.
5. **Production Prompt Deck & Copy:** The final stage reveals clean production-ready prompt cards for each scene, equipped with one-click copy buttons for Google Veo prompts and Suno music prompts, plus an export/copy-all package.

## Screens and Layout
A **Progressive Single-Page Studio** where sections unfold with smooth motion transitions as earlier steps are completed:
- **Header:** Studio title, project status, and "Reset / Load Sample" shortcuts.
- **Surface 1 — Concept & Style Desk:** Input fields for Story/Rhyme Gist, Visual Style, Music Mood/Genre, Scene Duration toggle (6s, 8s, 10s), and Total Duration selector (30s, 60s, 90s). Prominent "Expand & Direct" action button.
- **Surface 2 — Lyricist Lounge & Story Arc (Unfolds on step 1 complete):** Displays the expanded narrative beats, the AI lyricist's crafted verses/rhymes, and the master Suno audio prompt card.
- **Surface 3 — Character Anchor & Scene Director Timeline (Unfolds next):** 
  - Persistent Character Sketch card (shows locked visual DNA and lighting key).
  - Horizontal/vertical timeline cards for each calculated scene, displaying scene number, timestamp range (e.g., 00:00 - 00:06), visual prompt summary, and an interactive **Camera Angle selector** (pre-selected with the agent's recommendation).
- **Surface 4 — Continuity Engine & Rule-Patch Log (Unfolds next):** Live visual audit badge ("Continuity Verified"), showing any detected drift and the autonomous patch applied to persistent storage.
- **Surface 5 — Production Prompt Deck:** Tabular/Card layout displaying the finalized Veo prompts (with camera angle & character anchor baked in) and Suno audio cues, each with a 1-click clipboard copy button.

## Look and Feel
- **Aesthetic:** Professional director's console blended with playful, creative energy.
- **Color Palette:** Deep slate/charcoal background (`#0d1117`, `#161b22`) accented with electric violet/magenta (`#a855f7`), neon cyan (`#06b6d4`), and glowing emerald (`#10b981`) for locked continuity badges.
- **Typography:** Modern, crisp sans-serif (Inter / Outfit style) with monospace font accents for prompt tokens, camera angles, and timestamps.
- **Motion Design:** Smooth, satisfying unfolding animations for newly unlocked studio sections, micro-bounces on button clicks, and subtle pulse effects during the continuity audit pass.
- **Cinematography & Script Reference:** Grounded in industry-standard shot taxonomy from [StudioBinder's Ultimate Guide to Camera Shots](https://www.studiobinder.com/blog/ultimate-guide-to-camera-shots/#dollyshot) (Dolly, Tracking, Crane, Low-Angle Hero, Over-the-Shoulder, Wide Establishing).

## Features and Behavior

### 1. Duration Math & Scene Segmentation Engine
- Calculates exact scene count based on user inputs (`Total Duration` ÷ `Scene Duration`).
- Automatically handles remainders with a clean outro scene or notification.
- *Acceptance Criteria:*
  - Given 60s total and 6s scene duration, exactly 10 scene cards are created.
  - Given 30s total and 10s scene duration, exactly 3 scene cards are created.

### 2. Idea Expansion & Lyricist Persona
- Expands short user inputs (even 1–2 sentences) into a coherent multi-beat storyline.
- Adopts a lyricist persona to write synchronized lyrics/rhymes matching the selected music mood.
- *Acceptance Criteria:*
  - Generates both narrative scene descriptions and rhyming/musical lyric lines.
  - Outputs a master Suno prompt including genre, tempo, instruments, and vocal tone.

### 3. Character Sketch Anchor, Camera Director & Dance Choreography
- Formulates a locked "Character DNA" string (e.g., age, clothing colors, distinctive features, lighting palette) injected into every Veo prompt.
- Suggests cinematic camera angles based on the [StudioBinder](https://www.studiobinder.com/blog/ultimate-guide-to-camera-shots/#dollyshot) taxonomy (Dolly shot, Tracking shot, Low-Angle Hero, Crane shot, Wide Establishing, Close-Up) appropriate to each scene's emotional beat.
- **Realistic Human-Like Dance Steps:** For musical and rhyme scenes, incorporates realistic, expressive dance choreography descriptors (e.g., rhythmic footwork, fluid hip and torso sway, tempo-locked arm gestures, pirouettes, synchronized groove) into the Veo video prompts without breaking character anatomy, clothing, or lighting continuity.
- Allows the user to manually override any scene's camera angle or toggle dance motion from an interactive selector.
- *Acceptance Criteria:*
  - Every scene card contains a camera angle badge and selector from StudioBinder shot types.
  - Musical scenes with dance enabled output anatomically sound, realistic choreographic prompts while preserving 100% of the character's clothing and appearance anchor.
  - Manually changing a camera angle immediately updates the generated prompt for that scene.

### 4. Autonomous Continuity Audit & Self-Patching Rules
- Scans generated prompts for continuity violations: character clothing shifts, accidental lighting changes, or mood dissonance.
- When an inconsistency is detected, logs the drift and patches the persistent rule file (`SKILL.md` / character storage) to prevent future drift.
- *Acceptance Criteria:*
  - Displays a visual continuity audit summary ("10/10 Scenes Verified").
  - Displays a "Rule Patch Applied" event indicator when a fix is enacted.

### 5. Production Prompt Deck & Clipboard Export
- Displays formatted, ready-to-paste prompt cards for Google Veo and Suno.
- 1-click copy buttons for individual prompts and a master "Copy Full Production Deck" button.
- *Acceptance Criteria:*
  - Clicking "Copy" triggers a brief checkmark animation and copies the exact prompt text to the system clipboard.

## States and Boundaries

- **First Use / Initial State:** Clean, distraction-free screen showing only the Concept & Style Desk, plus a "Load Sample Project" button to populate pre-tested sample data instantly.
- **Generating / Unfolding State:** Smooth progress indicators as the Lyricist Lounge, Timeline, and Prompt Deck unlock sequentially.
- **Manual Edit State:** When a user alters a camera angle or character descriptor, the prompt card recalculates instantly in-place without reloading the page.
- **Persistence:** Saved character profiles and patched continuity rules persist in local storage, allowing the user to reload the page or launch a new story with the same character.
- **Error State:** If inputs are empty or under 3 words, a gentle prompt highlights the input field with guidance instead of breaking.

## Product Decisions
- **Progressive Single-Page Layout over Multi-Step Wizard:** Chosen because creators want to see the whole production pipeline at a glance and jump between the lyrics, character sketch, and prompt cards without pagination friction.
- **Manual Camera Angle Customization:** Chosen because while the agent's cinematic recommendations are valuable, directors always need creative veto over specific shots.
- **Text & Prompt Generation over Video Rendering:** Chosen to maintain a fast, reliable, zero-cost proof of concept that directly serves tools like Google Veo and Suno without hitting external API billing or render timeouts.

## What We're Building
- Single-page progressive web application.
- Story expansion engine with Lyricist persona.
- Scene duration & timing calculation engine (6s/8s/10s).
- Character Sketch anchor generator.
- Smart camera angle recommender based on [StudioBinder](https://www.studiobinder.com/blog/ultimate-guide-to-camera-shots/#dollyshot) taxonomy with manual dropdown overrides.
- Human-like dance choreography prompt generator for musical and rhythm scenes.
- Autonomous continuity audit pass with rule-patching log.
- Production prompt cards with 1-click clipboard copy for Veo & Suno.
- Persistent local storage for characters and patched rules.

## Deferred From the POC
- Direct automated dispatch to Veo/Suno APIs via headless browser or webhook.
- Multi-character ensemble tracking (PoC focuses on single protagonist + environmental lighting).
- Voiceover audio synthesis in-app.

## Possible Later Enhancements
- Interactive storyboard with AI keyframe image generation.
- Audio preview playback alongside prompts.
- Export to video editing timeline formats (EDL / Final Cut XML).

## Non-Goals
- Real-time video rendering or video file generation.
- Full DAW (Digital Audio Workstation) music sequencing.

## Open Questions
- None blocking spec or build; the journey, states, and behaviors are fully resolved.
