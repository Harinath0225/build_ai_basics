package agent

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"continuity-studio/internal/models"
)

// Agent handles concept expansion, direction, and prompt generation
type Agent struct {
	geminiAPIKey string
	rulesManager *RulesManager
}

// NewAgent creates a new Agent instance
func NewAgent(rm *RulesManager) *Agent {
	return &Agent{
		geminiAPIKey: os.Getenv("GEMINI_API_KEY"),
		rulesManager: rm,
	}
}

// ExpandConcept expands the user's story gist into full narrative beats, lyrics, and scene breakdown
func (a *Agent) ExpandConcept(req models.ProjectRequest) (*models.ExpandedConcept, error) {
	// 1. Math engine: Scene segmentation
	if req.SceneDuration <= 0 {
		req.SceneDuration = 6
	}
	if req.TotalDuration <= 0 {
		req.TotalDuration = 60
	}
	if req.VisualStyle == "" {
		req.VisualStyle = "Cinematic 3D Animation"
	}
	if req.MusicGenre == "" {
		req.MusicGenre = "Upbeat Electro-Swing Rhyme"
	}

	sceneCount := req.TotalDuration / req.SceneDuration
	if sceneCount < 1 {
		sceneCount = 1
	}

	// Try live Gemini expansion if API key is configured
	if a.geminiAPIKey != "" {
		concept, err := a.expandWithGemini(req, sceneCount)
		if err == nil && concept != nil {
			return concept, nil
		}
		fmt.Printf("Gemini API call failed or timed out, using intelligent local engine: %v\n", err)
	}

	// Intelligent deterministic engine (creative, rich, offline-ready)
	return a.generateLocalConcept(req, sceneCount), nil
}

// expandWithGemini makes a call to Google Gemini API
func (a *Agent) expandWithGemini(req models.ProjectRequest, sceneCount int) (*models.ExpandedConcept, error) {
	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=%s", a.geminiAPIKey)

	systemPrompt := `You are an elite Hollywood Director and Master Lyricist for multi-scene AI video and music production.
Output MUST be strict JSON matching this schema:
{
  "title": "Short Catchy Title",
  "logline": "1-2 sentence dramatic pitch",
  "story_beats": ["Beat 1", "Beat 2", "Beat 3"],
  "lyrics": "Rhyming musical lyrics for the song",
  "suno_master_prompt": "Music prompt for Suno with tempo, instrumentation, and vocal style",
  "character_anchor": {
    "name": "Character Name",
    "visual_dna": "Specific distinctive appearance, costume details, colors, hair, eyes",
    "lighting_key": "Consistent lighting mood e.g. Golden hour amber rim light"
  },
  "scene_summaries": ["Scene 1 action", "Scene 2 action", ...]
}`

	userPrompt := fmt.Sprintf("Story Gist: %s\nVisual Style: %s\nMusic Style: %s\nTotal Scenes needed: %d\nInclude Dance: %v",
		req.StoryGist, req.VisualStyle, req.MusicGenre, sceneCount, req.IncludeDance)

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

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonBytes))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		b, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("gemini api returned status %d: %s", resp.StatusCode, string(b))
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
		return nil, fmt.Errorf("empty response from gemini")
	}

	rawJSON := geminiResp.Candidates[0].Content.Parts[0].Text

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
		return nil, err
	}

	// Build full ExpandedConcept
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
		Scenes:           make([]models.ScenePrompt, sceneCount),
	}

	studioBinderAngles := []string{
		"Wide Establishing Shot",
		"Low-Angle Hero Shot",
		"Dolly In Tracking Shot",
		"Medium Action Shot",
		"Close-Up Expression Shot",
		"Crane / High-Angle Dynamic Shot",
		"Over-The-Shoulder Dynamic Shot",
	}

	for i := 0; i < sceneCount; i++ {
		startTime := i * req.SceneDuration
		endTime := (i + 1) * req.SceneDuration
		timeRange := fmt.Sprintf("%02d:%02d - %02d:%02d", startTime/60, startTime%60, endTime/60, endTime%60)

		summary := fmt.Sprintf("Scene %d action beat", i+1)
		if i < len(parsed.SceneSummaries) {
			summary = parsed.SceneSummaries[i]
		}

		angle := studioBinderAngles[i%len(studioBinderAngles)]
		dancePrompt := ""
		if req.IncludeDance {
			dancePrompt = " Realistic expressive human choreography, rhythmic footwork and syncopated torso groove,"
		}

		veoPrompt := fmt.Sprintf("Google Veo Prompt: %s (%s). Featuring %s with %s. %s lighting. %s%s Photorealistic 4K render, cinematic depth of field, seamless temporal consistency.",
			angle, req.VisualStyle, concept.CharacterAnchor.Name, concept.CharacterAnchor.VisualDNA, concept.CharacterAnchor.LightingKey, summary, dancePrompt)

		sunoPrompt := fmt.Sprintf("Suno Music Cue: [%s - %s] %s with rhythmic pulse matching tempo 120bpm.", req.MusicGenre, timeRange, summary)

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

// generateLocalConcept creates a rich, deterministic concept when offline
func (a *Agent) generateLocalConcept(req models.ProjectRequest, sceneCount int) *models.ExpandedConcept {
	title := "The Chronicles of " + capitalizeWords(req.StoryGist)
	if len(title) > 40 {
		title = capitalizeWords(req.StoryGist)
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

	concept := &models.ExpandedConcept{
		Title:   title,
		Logline: fmt.Sprintf("In a visually striking world rendered in %s, an iconic journey unfolds driven by %s music.", req.VisualStyle, req.MusicGenre),
		StoryBeats: storyBeats,
		Lyrics: lyrics,
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
		Scenes:        make([]models.ScenePrompt, sceneCount),
	}

	studioBinderAngles := []string{
		"Wide Establishing Shot",
		"Low-Angle Hero Shot",
		"Dolly In Tracking Shot",
		"Medium Action Shot",
		"Close-Up Expression Shot",
		"Crane / High-Angle Dynamic Shot",
		"Over-The-Shoulder Dynamic Shot",
	}

	for i := 0; i < sceneCount; i++ {
		startTime := i * req.SceneDuration
		endTime := (i + 1) * req.SceneDuration
		timeRange := fmt.Sprintf("%02d:%02d - %02d:%02d", startTime/60, startTime%60, endTime/60, endTime%60)

		angle := studioBinderAngles[i%len(studioBinderAngles)]
		summary := fmt.Sprintf("Scene %d: %s navigates the world as the narrative tempo evolves.", i+1, charName)

		danceMotion := ""
		if req.IncludeDance {
			danceMoves := []string{
				"Rhythmic hip-hop glide and syncopated footwork lock step,",
				"Fluid contemporary torso wave and expressive arm extensions,",
				"Energetic street-style spin landing on the downbeat,",
				"Subtle rhythmic head-nod and bouncing groove cadence,",
			}
			danceMotion = " " + danceMoves[i%len(danceMoves)]
		}

		veoPrompt := fmt.Sprintf("Google Veo Prompt: [%s] %s style. %s (%s). Lighting: %s. Action: %s%s Cinematic 4K, realistic anatomy, temporal consistency locked across scene transitions.",
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
