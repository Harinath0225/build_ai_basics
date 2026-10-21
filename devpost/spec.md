---
doc: spec
status: approved
---

# ContinuityStudio — Technical Spec

## How This Works, In Plain Language
ContinuityStudio is split into two cleanly separated local services with vector memory integration:
1. **Frontend (React + Vite):** A responsive, single-page creative studio interface. It captures the user's story outline, duration parameters, visual style, and music mood. It uses smooth motion design to unfold sections as work completes, lets creators adjust suggested camera angles, and offers 1-click clipboard copy for Google Veo and Suno prompt decks.
2. **Backend (Golang Agent Server):** A lightweight Go REST API that orchestrates the AI agent pipeline. It calculates scene duration math (e.g., 60s ÷ 6s = 10 scenes), executes prompt expansion via a Lyricist persona, attaches StudioBinder-based camera shots and realistic dance choreography, and performs an automated **Continuity Audit Pass**.
3. **Chroma DB Vector Memory & Persistent Autonomous Rule Patching:** The Go server integrates with a local Chroma DB instance via HTTP REST (`http://localhost:8000/api/v1`) to store and query vector embeddings of character DNA and scene prompts, with a resilient local JSON vector fallback in `backend/data/rules.json` and `backend/data/characters.json`. When the audit agent detects a continuity drift, it writes a patch to persistent storage and reloads that context into the agent's active in-memory prompt context, ensuring subsequent prompts inherit the corrected rules.

## The Core Journey Through the System
*PRD ref: `prd.md > The Core Journey`*
1. **Project Setup (`POST /api/expand`):** The React frontend sends the story gist, visual style, music genre, and timing settings to the Go backend.
2. **Expansion & Lyricist Pass:** The Go agent calls the Google Cloud Model (Gemini via Google GenAI / Vertex AI SDK) with a specialized Lyricist system prompt to output the expanded story beats, song lyrics, and Suno master prompt.
3. **Director Timeline (`POST /api/direct`):** The Go agent calculates scene splits, extracts the Character DNA anchor, assigns StudioBinder camera shot recommendations (Dolly, Tracking, Crane, Low-Angle Hero, etc.), and generates dance choreography prompts for rhythm scenes.
4. **Continuity Audit & Memory Query (`POST /api/audit`):** The Go agent indexes character visual traits in Chroma DB, queries cosine similarity across generated scene prompts to detect semantic drift (costume, lighting, mood), patches the persistent rule file, updates its in-memory agent cache, and returns the verified deck with patch notes.
5. **Prompt Deck (`GET /api/deck` or direct payload):** The React UI renders the timeline cards and prompt cards with 1-click clipboard copy for Veo and Suno.

## Stack
- **Backend Language & Runtime:** Go (Golang 1.27.0). Fast, strongly typed, single-binary compilation, ideal for clean agent service loops.
- **Vector Memory & Embeddings:** **Chroma DB** (via HTTP REST client on port 8000) with automatic, resilient local vector fallback. Rationale: Real vector database semantic similarity search for drift detection, guaranteed to work offline without blocking development if Chroma isn't running.
- **AI Agent & LLM Client:** Google Gen AI SDK for Go / Vertex AI client (`cloud.google.com/go/vertexai/genai` or `github.com/google/generative-ai-go/genai`). Rationale: Connects directly to Google Cloud Project Agent Platform / Gemini models. Includes a mock/fallback engine for offline or credential-free hackathon testing.
- **Environment & Secrets:** `github.com/joho/godotenv` to load `.env` variables (e.g., `GCP_PROJECT_ID`, `GEMINI_API_KEY`, `CHROMA_URL`). All `.env` files are excluded by `.gitignore`.
- **Frontend Framework:** React 18+ with Vite. Rationale: Instant HMR, minimal build friction, modern component ecosystem.
- **Styling & Motion:** Modern CSS + Tailwind CSS utilities with **Framer Motion** (`framer-motion`) for smooth unfolding stage animations and **Lucide React** (`lucide-react`) for studio director icons.
- **Storage:** Chroma DB vector collection + local JSON file persistence in `backend/data/` for character profiles, rule definitions, and audit logs.

## Where It Runs and How Someone Tries It
- **Runtime:** Two local processes running on `localhost` (plus optional local Chroma DB).
  - Backend: `http://localhost:8080`
  - Frontend: `http://localhost:5173`
  - Vector DB (Optional): `http://localhost:8000` (Chroma DB)
- **Prerequisites:** Go (installed: 1.27), Node.js (installed: v20), and an optional `.env` file with Google Cloud / Gemini API credentials.
- **Exact Start Commands:**
  ```powershell
  # (Optional) Terminal 0 - Chroma DB (if installed):
  chroma run --path ./chroma_data
  
  # Terminal 1 - Backend:
  cd backend
  go run main.go
  
  # Terminal 2 - Frontend:
  cd frontend
  npm run dev
  ```
  *(Note: If Chroma DB is not started, the Go backend automatically switches to its built-in local vector memory fallback so the app runs flawlessly).*
- **Demo Recording:** Open `http://localhost:5173` in a browser to record the 1-minute demo video showing story expansion, camera angle customization, continuity audit, and prompt copying.

## Look and Feel
*PRD ref: `prd.md > Look and Feel`*
- **Palette:** Modern creative studio dark theme. Deep obsidian background (`#090d16`, `#111827`), elevated card surfaces (`#1f2937`), electric purple accents (`#9333ea`), neon cyan highlights (`#06b6d4`), and emerald continuity badges (`#10b981`).
- **Typography:** Inter / Outfit for headlines and studio UI controls; JetBrains Mono / monospace for prompt tokens, camera shot badges, and duration timestamps.
- **Motion:** Framer Motion staggered reveals as each production stage unlocks, pulse glows on active audit passes, and spring micro-interactions on button clicks.

## Components

### 1. Concept & Lyricist Studio Component
Renders the input form for the story gist, duration sliders (60s total, 6s/8s/10s scenes), visual style presets, and music genre. Calls `POST /api/expand`.
*PRD ref: `prd.md > Features and Behavior > 1 & 2`*

### 2. Scene Timeline & Camera Director Component
Displays the calculated scene cards with timestamps, suggested StudioBinder camera angles (Dolly, Tracking, Low Angle, etc.), and dance choreography toggles. Allows inline dropdown overrides. Calls `POST /api/direct`.
*PRD ref: `prd.md > Features and Behavior > 3`*

### 3. Autonomous Continuity Auditor & Memory Inspector Component
Triggers the continuity audit pass. Displays the audit progress, verified scene indicators, detected drift warnings, and the exact rule patches written to persistent memory and Chroma DB. Calls `POST /api/audit` and `GET /api/rules`.
*PRD ref: `prd.md > Features and Behavior > 4`*

### 4. Production Prompt Deck Component
Displays the final, formatted Google Veo prompts and Suno audio prompts with 1-click clipboard copy triggers and feedback toasts.
*PRD ref: `prd.md > Features and Behavior > 5`*

### 5. Backend Agent Service & Rule Manager (`backend/internal/agent`)
Go package that coordinates the LLM calls, parses prompts into structured scenes, executes the rule evaluation against character DNA, connects to Chroma DB / local vector fallback, and writes/reloads `rules.json`.
*PRD ref: `prd.md > Features and Behavior > 1, 2, 3, 4`*

## Data Model

```go
// ProjectRequest represents user setup inputs
type ProjectRequest struct {
    StoryGist     string `json:"story_gist"`
    TotalDuration int    `json:"total_duration"` // e.g. 60
    SceneDuration int    `json:"scene_duration"` // 6, 8, or 10
    VisualStyle   string `json:"visual_style"`
    MusicGenre    string `json:"music_genre"`
    IncludeDance  bool   `json:"include_dance"`
}

// CharacterAnchor represents the persistent character visual DNA
type CharacterAnchor struct {
    ID          string `json:"id"`
    Name        string `json:"name"`
    VisualDNA   string `json:"visual_dna"`   // costume, hair, physical build
    LightingKey string `json:"lighting_key"` // color temperature, ambient mood
}

// ScenePrompt represents an individual video + audio slice
type ScenePrompt struct {
    SceneNumber int    `json:"scene_number"`
    TimeRange   string `json:"time_range"`   // e.g. "00:00 - 00:06"
    CameraAngle string `json:"camera_angle"` // from StudioBinder taxonomy
    DanceAction string `json:"dance_action"` // choreographic motion if applicable
    VeoPrompt   string `json:"veo_prompt"`   // ready-to-paste video prompt
    SunoPrompt  string `json:"suno_prompt"`  // synchronized lyrics / audio prompt
    Status      string `json:"status"`       // "verified", "patched"
}

// ContinuityRule represents an autonomous constraint stored in memory/disk
type ContinuityRule struct {
    ID          string `json:"id"`
    Category    string `json:"category"`    // "character", "lighting", "motion"
    Constraint  string `json:"constraint"`  // rule enforced on prompts
    Version     int    `json:"version"`
    LastPatched string `json:"last_patched"`
}
```

## File Structure
```
build_ai_basics/
├── .gitignore                    # Ignores .env and devpost/learner-profile.md
├── devpost/                      # Hackathon planning artifacts
│   ├── learner-profile.md
│   ├── scope.md
│   ├── prd.md
│   └── spec.md
├── backend/
│   ├── .env.example              # Sample environment template
│   ├── go.mod
│   ├── go.sum
│   ├── main.go                   # HTTP server router & handlers
│   ├── data/
│   │   ├── characters.json       # Persistent character storage
│   │   └── rules.json            # Persistent continuity rules
│   └── internal/
│       ├── agent/
│       │   ├── agent.go          # Agent workflow orchestration
│       │   ├── continuity.go     # Drift auditor & rule patcher
│       │   ├── chroma.go         # Chroma DB HTTP client & vector fallback
│       │   └── memory.go         # Persistent memory load/store
│       └── models/
│           └── types.go          # Data structures
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx               # Progressive Single-Page Studio
        ├── components/
            ├── Header.jsx
            ├── ConceptStudio.jsx # Step 1: Inputs & Duration Math
            ├── LyricistLounge.jsx# Step 2: Expanded Story & Lyrics
            ├── TimelineDirector.jsx # Step 3: Camera & Dance Timeline
            ├── ContinuityAudit.jsx  # Step 4: Rule Patching & Memory Log
            └── PromptDeck.jsx       # Step 5: Veo & Suno Copy Cards
```

## External Services and Dependencies
1. **Google Cloud Vertex AI / Gemini API:**
   - Model: `gemini-1.5-flash` or `gemini-2.0-flash` (via official Go SDK).
   - Key: `GEMINI_API_KEY` or `GCP_PROJECT_ID` with Application Default Credentials in `.env`.
   - Docs: [Google GenAI Go SDK](https://github.com/google/generative-ai-go) / [Vertex AI Go SDK](https://cloud.google.com/vertexai/docs).
   - Fallback: Offline deterministic mock generator built into the Go backend so the studio works seamlessly even without an active cloud bill or offline.
2. **Local Chroma DB (Port 8000):**
   - API: Chroma HTTP REST v1 (`/api/v1/collections`).
   - Fallback: Automatic in-process vector/JSON storage if Chroma HTTP server is not detected.
3. **StudioBinder Cinematography Standards:**
   - Reference: [StudioBinder Camera Shots Guide](https://www.studiobinder.com/blog/ultimate-guide-to-camera-shots/#dollyshot).

## Important Failure Modes
1. **Chroma DB Not Running Locally:**
   - Fallback: The Go server checks health on startup. If unavailable, it logs an informative notice and transparently routes vector memory and similarity scoring to the built-in local vector memory engine in `backend/internal/agent/chroma.go`. Zero crashes.
2. **Missing or Invalid Google Cloud Credentials:**
   - Fallback: The Go server automatically switches to the built-in Intelligent Creative Fallback engine, producing complete story expansions, StudioBinder camera angles, and continuity audits so development and demo recording are never blocked.
3. **Mismatched Scene Duration Math (e.g. 65s total with 10s scenes):**
   - Fallback: The Go segmentation engine rounds to the nearest clean multiple (e.g., 6 scenes of 10s + 1 outro scene of 5s) and displays an informative badge in the UI rather than throwing an error.

## What Was Simplified and Why
- **Chroma DB via HTTP REST + Local Fallback instead of complex CGO bindings:** Simplified to clean standard HTTP calls to `localhost:8000` with an embedded fallback. Why: Gives full access to real Chroma DB vector collections when running, without requiring Python/CGO build toolchains inside Go.
- **Prompt Deck Output instead of Direct Video Rendering:** Simplified to formatted, production-grade prompts for Google Veo and Suno rather than calling third-party video generation APIs. Why: Guarantees zero latency, zero render costs, and complete reliability during demo recording.

## Decisions and Open Issues
- **Chroma DB Integration:** Agreed to use Chroma DB over HTTP (`localhost:8000`) for character vector memory and semantic drift scoring, paired with an automatic fallback in Go so local setup issues never block the hackathon build or demo recording.
- **Learning Goal Implementation (Autonomous Skill Patching & Memory):**
  - The agent updates persistent rule state on disk (`backend/data/rules.json`) and vector memory in Chroma DB. When drift is detected, it patches rules and reloads active memory.
- **Camera Shot Taxonomy:** Standardized on StudioBinder's 7 core shot types (Dolly Shot, Tracking Shot, Crane Shot, Low-Angle Hero, Over-The-Shoulder, Wide Establishing, Close-Up).
- **All requirements resolved:** The blueprint is ready for build execution in `5-build`.
