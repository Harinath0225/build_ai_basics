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
Five fluid screens built with the **Deep Field** design system, linked by a header step trail (**Story, Sound, Shots, Check**) and **Back / Continue** navigation:
- **Header (`Header.jsx`):** Brand mark (orbital ellipse + core + pink moon dot) and "Continuity Studio" in Fraunces 600 on the left; 4-step trail (`Story`, `Sound`, `Shots`, `Check`) joined by 24px hairline connectors on the right (or `← Back to check` on the Export screen).
- **Screen 1 — Story (`ConceptStudio.jsx`, 760px column):** Title *"What is your story about?"*, a large `THE GIST` textarea, three duration & prompt math controls (`EXPECTED VIDEO LENGTH` e.g. 2 mins / 120s, `SECS GENERATED PER SHOT` e.g. 6s = 20 story video prompts, and `ADDITIONAL DANCE PROMPTS` e.g. +5 dance prompts = 25 total 3D Animated Pixar prompts), a live spectral readout bar, a `"Try a demo story (2m · 20 + 5 dance)"` ghost button, an unfolding editable `3D PIXAR STORY PROMPT` textarea with `"Reset to suggestion"`, and a primary `"Continue"` button.
- **Screen 2 — Sound (`LyricistLounge.jsx`, 760px column):** Title *"How should it sound?"*, an editable `SUNO MUSIC & AUDIO PROMPT` textarea calibrated to the exact video duration (e.g. `2:00`), an editable `SUNO SONG STRUCTURE & DANCE GROOVE CUES` box, `"Copy Suno prompt"`, `"Reset to suggestion"`, and `"Back"` / `"Continue"` controls.
- **Screen 3 — Shots (`TimelineDirector.jsx`, 860px column):** Title *"Write the shots"*:
  - **Locked in every shot card:** Displays `CHARACTER`, `WORLD`, `LOOK` (defaulting to *3D Animated Pixar style*), and `LIGHT` in a two-column definition list (`96px minmax(0,1fr)`), toggling to four labelled textareas when `"Edit"` is clicked.
  - **Constellation Path Shot List:** Segmented filter (`All (25)` | `Story (20)` | `Dance (+5)`) and shot rows connected by a 1px vertical rail and 11px ringed nodes (cyan for story shots, pink `#ff7ab8` for bonus dance prompts). Clicking `"Edit prompt"` expands inline beneath the row with `WHAT HAPPENS`, `CAMERA`, `HOW IT ENDS`, a dashed `FULL 3D ANIMATED PIXAR PROMPT` preview (`Look / Character / World / Light / Camera / Duration / Starts / Scene / Choreography / Ends`), `"Copy prompt"`, and `"Revert to original"`.
- **Screen 4 — Check (`ContinuityAudit.jsx`, 960px column):** Title *"Check continuity"*:
  - **Continuity Dial Card:** 200x200 SVG instrument dial with 15 ticks (24° apart, cyan `#7ee8f0` for aligned shots, gold `#e9c98f` with an outer gold dot for shots needing a look), center aligned count in 48px Fraunces, headline (*"13 of 15 shots line up"*), and legend.
  - **Flagged Shots List:** Lists shots with character detail omissions (e.g., Shot 07 missing copper goggles) or repeated neighbouring camera moves (e.g., Shot 11 repeating Shot 10's dolly move). Clicking `"Review"` opens an inline prompt editor, a dashed `SUGGESTION` box, `"Use suggestion"` (primary), and `"Keep my version"` (ghost), updating the dial and headline live.
- **Screen 5 — Export (`PromptDeck.jsx`, 760px column):** Title *"Export your prompts"*, primary `"Copy all 15 prompts"` button, `"Video tool"` / `"Editing timeline"` segmented switch, format rows (*Image directing sheet*, *Text-to-video matrix*, *Realtime video dispatcher*), and one-click raw downloads for `JSON`, `TXT`, and `Markdown`.

## Look and Feel
- **Aesthetic:** Deep Field — a calm, focused workspace set against a deep indigo night (`#0b0b20`) with subtle background radial glows, a quiet star field, and top-right orbital rings.
- **Color Palette:** Deep indigo background (`#0b0b20`), recessed cards (`rgba(20, 18, 46, 0.72)`), inputs (`rgba(10, 10, 31, 0.85)`), primary gradient (`linear-gradient(135deg, #c42882, #6a1fb8)`), pink step accent (`#ff7ab8`), cyan aligned accent (`#7ee8f0`), focus ring (`#00f0ff`), and warm gold (`#e9c98f`) for flagged items.
- **Typography:** `Fraunces` (600) for display titles, headlines, and dial numerals; `Instrument Sans` (400, 500, 600) for body copy, buttons, and fields; `DM Mono` (400, 500) for uppercase eyebrows, field labels, shot labels, and full-prompt readouts.
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
