package agent

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"continuity-studio/internal/models"
)

// AvailableModels lists the active Google AI Studio Gemini models supported for studio expansion
var AvailableModels = []struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}{
	{ID: "gemini-3.6-flash", Name: "Gemini 3.6 Flash", Description: "Fast, ultra-reliable multimodal studio director (Recommended)"},
	{ID: "gemini-3.5-flash", Name: "Gemini 3.5 Flash", Description: "High-speed creative narrative & lyric generation"},
	{ID: "gemini-3.8-flash", Name: "Gemini 3.8 Flash", Description: "Latest flagship Flash model with auto-fallback"},
	{ID: "gemini-4-argon", Name: "Gemini 4 Argon", Description: "Next-gen deep reasoning & cinematic continuity"},
}

// Agent handles concept expansion, direction, and prompt generation
type Agent struct {
	geminiAPIKey string
	geminiModel  string
	rulesManager *RulesManager
	httpClient   *http.Client
}

// NewAgent creates a new Agent instance
func NewAgent(rm *RulesManager) *Agent {
	model := strings.TrimSpace(os.Getenv("GEMINI_MODEL"))
	if model == "" || model == "gemini-1.5-flash" || model == "gemini-2.5-flash" {
		model = "gemini-3.6-flash"
	}
	return &Agent{
		geminiAPIKey: strings.TrimSpace(os.Getenv("GEMINI_API_KEY")),
		geminiModel:  model,
		rulesManager: rm,
		httpClient:   &http.Client{Timeout: 25 * time.Second},
	}
}

// GetConfigStatus returns the current Gemini configuration status
func (a *Agent) GetConfigStatus() map[string]interface{} {
	return map[string]interface{}{
		"gemini_configured": a.geminiAPIKey != "",
		"active_model":      a.geminiModel,
		"available_models":  AvailableModels,
	}
}

// ExpandConcept expands the user's story gist into full narrative beats, lyrics, and scene breakdown
func (a *Agent) ExpandConcept(req models.ProjectRequest) (*models.ExpandedConcept, error) {
	// 1. Math engine: Scene segmentation
	if req.SceneDuration <= 0 {
		req.SceneDuration = 6
	}
	if req.TotalDuration <= 0 {
		req.TotalDuration = 120
	}
	if req.VisualStyle == "" {
		req.VisualStyle = "3D Animated Pixar style, expressive character animation, soft global illumination, rich subsurface scattering"
	}
	if req.MusicGenre == "" {
		req.MusicGenre = "Suno AI Soundtrack: Upbeat Cinematic Pixar Orchestral Pop & Electro-Swing Groove, 124 BPM"
	}
	if req.BonusDancePrompts < 0 {
		req.BonusDancePrompts = 0
	}

	sceneCount := req.TotalDuration / req.SceneDuration
	if sceneCount < 1 {
		sceneCount = 1
	}

	// Try live Gemini expansion if API key is configured
	if a.geminiAPIKey != "" {
		concept, err := a.expandWithGeminiFallback(req, sceneCount)
		if err == nil && concept != nil {
			return concept, nil
		}
		fmt.Printf("Gemini API call failed across fallback chain, using intelligent local engine: %v\n", err)
	}

	// Intelligent deterministic engine (creative, rich, offline-ready)
	return a.generateLocalConcept(req, sceneCount), nil
}

// expandWithGeminiFallback tries the requested/default model and automatically falls back across active Google AI Studio models on 404/503
func (a *Agent) expandWithGeminiFallback(req models.ProjectRequest, sceneCount int) (*models.ExpandedConcept, error) {
	preferred := strings.TrimSpace(req.Model)
	if preferred == "" {
		preferred = a.geminiModel
	}
	preferred = strings.TrimPrefix(preferred, "models/")

	candidates := []string{preferred, "gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.8-flash", "gemini-4-argon"}
	seen := make(map[string]bool)
	var uniqueCandidates []string
	for _, c := range candidates {
		if c != "" && !seen[c] {
			seen[c] = true
			uniqueCandidates = append(uniqueCandidates, c)
		}
	}

	var lastErr error
	for _, modelName := range uniqueCandidates {
		concept, err := a.expandWithGeminiModel(req, sceneCount, modelName)
		if err == nil && concept != nil {
			concept.ModelUsed = modelName
			return concept, nil
		}
		fmt.Printf("⚠️  Gemini model [%s] returned error: %v — trying next model in chain...\n", modelName, err)
		lastErr = err
	}

	return nil, lastErr
}

// expandWithGeminiModel makes a call to Google Gemini API for a specific model
func (a *Agent) expandWithGeminiModel(req models.ProjectRequest, sceneCount int, modelName string) (*models.ExpandedConcept, error) {
	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", modelName, a.geminiAPIKey)

	systemPrompt := `You are an elite Hollywood Director and Master Lyricist for multi-scene AI video and music production.
Output MUST be strict, raw JSON matching this exact schema (do not wrap in markdown code fences):
{
  "title": "Short Catchy Title",
  "logline": "1-2 sentence dramatic pitch",
  "story_beats": ["Beat 1", "Beat 2", "Beat 3"],
  "lyrics": "Rhyming musical lyrics for the song with [Verse] and [Chorus] markers",
  "suno_master_prompt": "Music prompt for Suno with tempo, instrumentation, and vocal style",
  "character_anchor": {
    "name": "Character Name",
    "visual_dna": "Specific distinctive appearance, costume details, colors, hair, eyes",
    "lighting_key": "Consistent lighting mood e.g. Golden hour amber rim light"
  },
  "scene_summaries": ["Scene 1 action", "Scene 2 action"]
}`

	userPrompt := fmt.Sprintf("Story Gist: %s\nVisual Style: %s (3D Animated Pixar style)\nMusic Style: %s\nTotal Video Duration: %ds (%d seconds per shot = %d story scenes + %d bonus dance choreography shots = %d total scenes needed in scene_summaries)\nInclude Dance: %v",
		req.StoryGist, req.VisualStyle, req.MusicGenre, req.TotalDuration, req.SceneDuration, sceneCount, req.BonusDancePrompts, sceneCount+req.BonusDancePrompts, req.IncludeDance)

	requestBody := map[string]interface{}{
		"contents": []map[string]interface{}{
			{
				"role": "user",
				"parts": []map[string]interface{}{
					{"text": systemPrompt + "\n\n" + userPrompt},
				},
			},
		},
		"generationConfig": map[string]interface{}{
			"responseMimeType": "application/json",
		},
	}

	jsonBytes, err := json.Marshal(requestBody)
	if err != nil {
		return nil, err
	}

	resp, err := a.httpClient.Post(url, "application/json", bytes.NewBuffer(jsonBytes))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		b, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("gemini api (%s) returned status %d: %s", modelName, resp.StatusCode, string(b))
	}

	var geminiResp struct {
		Candidates []struct {
			Content struct {
				Parts []struct {
					Text string `json:"text"`
				} `json:"parts"`
			} `json:"content"`
		} `json:"candidates"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&geminiResp); err != nil {
		return nil, err
	}

	if len(geminiResp.Candidates) == 0 || len(geminiResp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("empty response from gemini (%s)", modelName)
	}

	rawJSON := cleanJSONResponse(geminiResp.Candidates[0].Content.Parts[0].Text)

	var parsed struct {
		Title            string                 `json:"title"`
		Logline          string                 `json:"logline"`
		StoryBeats       []string               `json:"story_beats"`
		Lyrics           string                 `json:"lyrics"`
		SunoMasterPrompt string                 `json:"suno_master_prompt"`
		CharacterAnchor  models.CharacterAnchor `json:"character_anchor"`
		SceneSummaries   []string               `json:"scene_summaries"`
	}

	if err := json.Unmarshal([]byte(rawJSON), &parsed); err != nil {
		return nil, fmt.Errorf("failed to parse gemini JSON: %w", err)
	}

	if parsed.CharacterAnchor.ID == "" {
		parsed.CharacterAnchor.ID = "char_01"
	}

	totalPrompts := sceneCount + req.BonusDancePrompts
	concept := &models.ExpandedConcept{
		Title:            parsed.Title,
		Logline:          parsed.Logline,
		StoryBeats:       parsed.StoryBeats,
		Lyrics:           parsed.Lyrics,
		SunoMasterPrompt: parsed.SunoMasterPrompt,
		CharacterAnchor:  parsed.CharacterAnchor,
		TotalDuration:    req.TotalDuration,
		SceneDuration:    req.SceneDuration,
		VisualStyle:      req.VisualStyle,
		MusicGenre:       req.MusicGenre,
		ModelUsed:        modelName,
		Scenes:           make([]models.ScenePrompt, totalPrompts),
	}

	studioBinderAngles := []string{
		"Wide Establishing Shot",
		"Low-Angle Hero Shot",
		"Dolly In Tracking Shot",
		"Tracking Shot",
		"Close-Up Expression Shot",
		"Crane / High-Angle Dynamic Shot",
		"Over-The-Shoulder Dynamic Shot",
	}

	danceMoves := []string{
		"Joyful Pixar-style 3D character dance routine, rhythmic footwork spin and syncopated shoulder groove",
		"Expressive 3D animated moonwalk glide into a bouncy upbeat chorus hop with full wardrobe continuity",
		"Dynamic low-angle 3D Pixar breakdance freeze and fluid twirl synced to the 124 BPM brass beat",
		"Playful synchronized step-touch choreography with expressive facial animation and lively hand claps",
		"Grand finale 3D Pixar showstopper dance spin landing in a heroic pose as confetti and golden dust swirl",
	}

	for i := 0; i < totalPrompts; i++ {
		isBonusDance := i >= sceneCount
		startTime := i * req.SceneDuration
		endTime := (i + 1) * req.SceneDuration
		timeRange := fmt.Sprintf("%02d:%02d - %02d:%02d", startTime/60, startTime%60, endTime/60, endTime%60)

		angle := studioBinderAngles[i%len(studioBinderAngles)]
		summary := fmt.Sprintf("Scene %d: %s advances through the 3D Pixar-style story beat.", i+1, concept.CharacterAnchor.Name)
		if i < len(parsed.SceneSummaries) && strings.TrimSpace(parsed.SceneSummaries[i]) != "" {
			summary = parsed.SceneSummaries[i]
		} else if isBonusDance {
			danceIdx := i - sceneCount
			move := danceMoves[danceIdx%len(danceMoves)]
			summary = fmt.Sprintf("[Bonus Dance Prompt %d] %s performs %s.", danceIdx+1, concept.CharacterAnchor.Name, move)
		}

		dancePrompt := ""
		if isBonusDance {
			danceIdx := i - sceneCount
			dancePrompt = " " + danceMoves[danceIdx%len(danceMoves)]
		} else if req.IncludeDance {
			dancePrompt = " Expressive 3D Pixar character movement and rhythmic groove,"
		}

		veoPrompt := fmt.Sprintf("3D Animated Pixar Video Prompt: [%s] %s. Featuring %s (%s). Lighting: %s. Action: %s.%s Photorealistic Pixar 3D render, subsurface scattering, seamless character continuity.",
			angle, req.VisualStyle, concept.CharacterAnchor.Name, concept.CharacterAnchor.VisualDNA, concept.CharacterAnchor.LightingKey, summary, dancePrompt)

		sunoPrompt := fmt.Sprintf("Suno Music Cue: [%s - %s] %s synced to %ds master track.", req.MusicGenre, timeRange, summary, req.TotalDuration)

		concept.Scenes[i] = models.ScenePrompt{
			SceneNumber:   i + 1,
			TimeRange:     timeRange,
			CameraAngle:   angle,
			DanceAction:   dancePrompt,
			VisualSummary: summary,
			VeoPrompt:     veoPrompt,
			SunoPrompt:    sunoPrompt,
			Status:        "pending",
		}
	}

	return concept, nil
}

// cleanJSONResponse strips markdown code fences if present
func cleanJSONResponse(raw string) string {
	trimmed := strings.TrimSpace(raw)
	if strings.HasPrefix(trimmed, "```") {
		lines := strings.Split(trimmed, "\n")
		if len(lines) >= 2 {
			lines = lines[1:]
			if strings.HasPrefix(strings.TrimSpace(lines[len(lines)-1]), "```") {
				lines = lines[:len(lines)-1]
			}
			trimmed = strings.Join(lines, "\n")
		}
	}
	return strings.TrimSpace(trimmed)
}

// generateLocalConcept creates a rich, deterministic concept when offline
func (a *Agent) generateLocalConcept(req models.ProjectRequest, sceneCount int) *models.ExpandedConcept {
	title := "The Chronicles of " + capitalizeWords(req.StoryGist)
	if len(title) > 40 {
		title = capitalizeWords(req.StoryGist[:37]) + "..."
	}

	charName := "Kaelen"
	visualDNA := "tall protagonist wearing an iridescent cobalt-blue leather aviator jacket with brass buckles, dark denim trousers, combat boots, silver-streaked dark hair"
	lightingKey := "dramatic neon-cyan rim lighting with warm golden-amber practical streetlamp fill"

	lyrics := fmt.Sprintf("[Verse 1 - 00:00 - %02d:00]\nThrough the rain and neon glow,\nFootsteps sync to the beat below,\nWatch the shadows bend and sway,\nWe chase the story night and day.\n\n[Chorus]\nSpin the rhythm, lock the frame,\nNever losing face or name,\nLighting burns and music plays,\nThrough the multi-scene arrays!", req.TotalDuration/2)

	sunoPrompt := fmt.Sprintf("%s, tempo 124 BPM, driving synth bassline, crisp acoustic drums, emotive melodic hook, high production fidelity", req.MusicGenre)

	storyBeats := []string{
		fmt.Sprintf("Introduction: Protagonist enters the atmosphere defined by '%s'.", req.StoryGist),
		"Rising Action: The rhythm quickens as kinetic obstacles and musical beats intensify.",
		"Climax & Resolution: High-energy synchronized finale locking character continuity across the story.",
	}

	totalPrompts := sceneCount + req.BonusDancePrompts
	concept := &models.ExpandedConcept{
		Title:            title,
		Logline:          fmt.Sprintf("In a visually striking world rendered in %s, an iconic journey unfolds driven by %s music.", req.VisualStyle, req.MusicGenre),
		StoryBeats:       storyBeats,
		Lyrics:           lyrics,
		SunoMasterPrompt: sunoPrompt,
		CharacterAnchor: models.CharacterAnchor{
			ID:          "char_01",
			Name:        charName,
			VisualDNA:   visualDNA,
			LightingKey: lightingKey,
		},
		TotalDuration: req.TotalDuration,
		SceneDuration: req.SceneDuration,
		VisualStyle:   req.VisualStyle,
		MusicGenre:    req.MusicGenre,
		ModelUsed:     "local-deterministic-engine",
		Scenes:        make([]models.ScenePrompt, totalPrompts),
	}

	studioBinderAngles := []string{
		"Wide Establishing Shot",
		"Low-Angle Hero Shot",
		"Dolly In Tracking Shot",
		"Tracking Shot",
		"Close-Up Expression Shot",
		"Crane / High-Angle Dynamic Shot",
		"Over-The-Shoulder Dynamic Shot",
	}

	for i := 0; i < totalPrompts; i++ {
		isBonusDance := i >= sceneCount
		startTime := i * req.SceneDuration
		endTime := (i + 1) * req.SceneDuration
		timeRange := fmt.Sprintf("%02d:%02d - %02d:%02d", startTime/60, startTime%60, endTime/60, endTime%60)

		angle := studioBinderAngles[i%len(studioBinderAngles)]
		summary := fmt.Sprintf("Scene %d: %s navigates the 3D Pixar animated world as the narrative tempo evolves.", i+1, charName)
		if isBonusDance {
			danceIdx := i - sceneCount
			summary = fmt.Sprintf("[Bonus Dance Prompt %d] %s performs an expressive 3D Pixar choreographed dance routine synced to the chorus beat.", danceIdx+1, charName)
		}

		danceMotion := ""
		if isBonusDance || req.IncludeDance {
			danceMoves := []string{
				"Rhythmic 3D Pixar hip-hop glide and syncopated footwork lock step,",
				"Fluid contemporary torso wave and expressive animated arm extensions,",
				"Energetic street-style spin landing on the downbeat,",
				"Subtle rhythmic head-nod and bouncy groove cadence,",
				"Showstopping 3D animated chorus jump-spin with full costume continuity,",
			}
			danceMotion = " " + danceMoves[i%len(danceMoves)]
		}

		veoPrompt := fmt.Sprintf("3D Animated Pixar Video Prompt: [%s] %s style. %s (%s). Lighting: %s. Action: %s%s Cinematic 4K Pixar render, realistic anatomy, temporal consistency locked across scene transitions.",
			angle, req.VisualStyle, charName, visualDNA, lightingKey, summary, danceMotion)

		sunoPrompt := fmt.Sprintf("Suno Audio Prompt: [%s | %s] Upbeat progression, vocal rhyme punch on scene beat %d.", req.MusicGenre, timeRange, i+1)

		concept.Scenes[i] = models.ScenePrompt{
			SceneNumber:   i + 1,
			TimeRange:     timeRange,
			CameraAngle:   angle,
			DanceAction:   danceMotion,
			VisualSummary: summary,
			VeoPrompt:     veoPrompt,
			SunoPrompt:    sunoPrompt,
			Status:        "pending",
		}
	}

	return concept
}

func capitalizeWords(s string) string {
	words := strings.Fields(s)
	for i, w := range words {
		if len(w) > 0 {
			words[i] = strings.ToUpper(w[:1]) + strings.ToLower(w[1:])
		}
	}
	return strings.Join(words, " ")
}
