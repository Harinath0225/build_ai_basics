---
doc: scope
status: approved
---

# ContinuityStudio: Multi-Scene Continuity Workflow Agent

A workflow agent that translates story outlines or rhymes into mathematically paced, continuity-locked scene prompts for Google Veo and Suno, while autonomously evaluating drift and patching persistent character and rule memory.

## The Unique Kernel
Autonomous multi-scene continuity auditing and persistent rule patching. Instead of generating isolated prompts where character features and lighting shift randomly, the agent enforces a persistent character anchor and lighting constraints across exact scene duration splits (e.g., 10 scenes of 6s for a 1-minute video), updating its own persistent rule storage whenever drift is detected.

## Who It's For
An AI video creator or animator producing multi-scene video stories, children's rhymes, or cinematic shorts. Today, they battle character morphing and mismatched lighting across prompts, having to repeatedly re-prompt and manually fiddle with consistency tricks.

## The Core Loop
1. The creator enters a story or rhyme gist, selects scene duration (6s, 8s, or 10s), total video length (e.g., 60s), and visual style.
2. The agent generates or loads a persistent **Character Sketch Anchor** and lighting profile.
3. The agent calculates the scene breakdown (e.g., 60s / 6s = 10 scenes) and generates synchronized visual prompts (tailored for Veo) and background music/rhyme prompts (tailored for Suno).
4. The agent executes an internal **Continuity Audit Pass** to verify character, lighting, and mood consistency, autonomously patching its persistent rules/character storage if any drift occurs.
5. The creator gets a ready-to-use production prompt deck to feed into Veo and Suno.

## Inspiration & Identity
Focused director's workbench built on the **Deep Field** design system (deep indigo night `#0b0b20`, quiet orbital motifs, Fraunces + Instrument Sans + DM Mono typography, and a 4-step trail: **Story, Sound, Shots, Check** plus **Export**). Clean, structured, and predictable, giving the creator confidence that shot 15 matches shot 1 in character fidelity, world, look, and light.
References & Industry Standards:
- **Deep Field Design System:** One idea per screen, editable prompts with instant reset, locked details card (`Character`, `World`, `Look`, `Light`), constellation-path shot rows, and a 15-tick continuity instrument dial.
- [StudioBinder Ultimate Guide to Camera Shots](https://www.studiobinder.com/blog/ultimate-guide-to-camera-shots/#dollyshot) for cinematography taxonomy (Dolly, Tracking, Low Angle, Crane, Close-Up).

## Why This Matters to the Learner
The creator experiences firsthand the frustration of character sketches and lighting becoming inconsistent across multi-scene video projects. Technically, this project provides direct hands-on practice with autonomous agent rule patching, memory loading, and persistent storage.

## What "Working" Looks Like
In a 1-minute demo:
1. The creator inputs a short story/rhyme, sets 6s scenes with a 60s total duration, and picks a visual style.
2. The agent generates the persistent character anchor, 10 sequential Veo scene prompts, and synchronized Suno music prompts.
3. The continuity check verifies that the character traits, costume, lighting, and musical key/tempo remain aligned across all 10 scenes.
4. Persistent storage updates with the character rules, proving that subsequent prompts or project sessions retain the same character.

## The POC Boundary
**Now (In the Proof of Concept):**
- Input form for story/rhyme gist, scene length (6s, 8s, 10s), overall length, and visual style.
- Scene math engine (calculating exact number of scene prompts based on duration).
- Character Sketch anchor generator.
- Multi-scene prompt generator (visual prompts optimized for Veo; audio prompts for Suno).
- Continuity audit evaluator that flags drift (character appearance, lighting, audio mood).
- Persistent storage for character profiles and self-patching continuity rules.
- Production prompt deck display with easy copy/export.

## Later
- Direct API integration to automatically dispatch jobs to Veo and Suno.
- Multi-character ensemble tracking and scene dialogue generation.
- Keyframe image preview generation to visually inspect consistency.

## Explicitly Cut
- In-app video rendering and video file encoding (avoids high compute/API costs, rate limits, and slow render times during the hackathon).
