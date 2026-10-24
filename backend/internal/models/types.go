package models

// ProjectRequest represents user setup inputs
type ProjectRequest struct {
	StoryGist         string `json:"story_gist"`
	TotalDuration     int    `json:"total_duration"`      // e.g. 120 (2 mins)
	SceneDuration     int    `json:"scene_duration"`      // e.g. 6, 8, or 10
	BonusDancePrompts int    `json:"bonus_dance_prompts"` // e.g. 5 additional dance prompts
	VisualStyle       string `json:"visual_style"`
	MusicGenre        string `json:"music_genre"`
	IncludeDance      bool   `json:"include_dance"`
	Model             string `json:"model,omitempty"`
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
	SceneNumber   int    `json:"scene_number"`
	TimeRange     string `json:"time_range"`     // e.g. "00:00 - 00:06"
	CameraAngle   string `json:"camera_angle"`   // from StudioBinder taxonomy
	DanceAction   string `json:"dance_action"`   // choreographic motion if applicable
	VisualSummary string `json:"visual_summary"` // scene action synopsis
	VeoPrompt     string `json:"veo_prompt"`     // ready-to-paste video prompt
	SunoPrompt    string `json:"suno_prompt"`    // synchronized lyrics / audio prompt
	Status        string `json:"status"`         // "pending", "verified", "patched"
}

// ContinuityRule represents an autonomous constraint stored in memory/disk
type ContinuityRule struct {
	ID          string `json:"id"`
	Category    string `json:"category"` // "character", "lighting", "motion"
	Constraint  string `json:"constraint"`
	Version     int    `json:"version"`
	LastPatched string `json:"last_patched"`
}

// ExpandedConcept represents the full generated studio project
type ExpandedConcept struct {
	Title            string          `json:"title"`
	Logline          string          `json:"logline"`
	StoryBeats       []string        `json:"story_beats"`
	Lyrics           string          `json:"lyrics"`
	SunoMasterPrompt string          `json:"suno_master_prompt"`
	CharacterAnchor  CharacterAnchor `json:"character_anchor"`
	Scenes           []ScenePrompt   `json:"scenes"`
	TotalDuration    int             `json:"total_duration"`
	SceneDuration    int             `json:"scene_duration"`
	VisualStyle      string          `json:"visual_style"`
	MusicGenre       string          `json:"music_genre"`
	ModelUsed        string          `json:"model_used"`
}

// AuditResult represents the output of the continuity audit pass
type AuditResult struct {
	TotalScenes    int            `json:"total_scenes"`
	VerifiedCount  int            `json:"verified_count"`
	DriftDetected  bool           `json:"drift_detected"`
	PatchesApplied []string       `json:"patches_applied"`
	AuditNotes     []string       `json:"audit_notes"`
	Scenes         []ScenePrompt  `json:"scenes"`
	UpdatedRules   []ContinuityRule `json:"updated_rules"`
}
